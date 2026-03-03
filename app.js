// server/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./server/routes/auth.js";
import cookieParser from "cookie-parser";
import verifyRoutes from "./server/routes/verify.routes.js";
import resendRoutes from "./server/routes/resend.routes.js";
import logoutRoutes from "./server/routes/logout.routes.js";
import refreshRoutes from "./server/routes/refresh.routes.js";
import resetRoutes from "./server/routes/reset.routes.js";
import adminRoutes from "./server/routes/admin.routes.js";
import { errorHandler } from "./server/middleware/error.middleware.js";
import { csrfTokenEndpoint, validateCSRFToken } from "./server/middleware/csrf.middleware.js";
import profileRoutes from "./server/routes/profile.js";




const app = express();
app.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const enforceOriginCheck =
  process.env.ENFORCE_ORIGIN_CHECK === "true" || process.env.NODE_ENV === "production";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Try again later." },
});

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_STRICT_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts from this IP. Please wait before retrying." },
});

app.use(
  helmet({
    // OAuth popups require a relaxed opener policy compared to helmet's default.
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "https://accounts.google.com"],
        imgSrc: ["'self'", "https:", "data:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        connectSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://oauth2.googleapis.com",
          "https://www.googleapis.com",
        ],
        frameSrc: ["'self'", "https://accounts.google.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const corsError = new Error("CORS origin not allowed");
      corsError.status = 403;
      return callback(corsError);
    },
    credentials: true,
  })
);
app.use(apiLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// CSRF token endpoint - GET /api/csrf-token
app.get("/api/csrf-token", csrfTokenEndpoint);

// CSRF validation middleware for state-changing requests
app.use("/api/auth", validateCSRFToken);
app.use("/api/profile", validateCSRFToken);
app.use("/api/admin", validateCSRFToken);

app.use("/api/auth", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");

  if (enforceOriginCheck && ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const origin = req.get("origin");
    if (!origin || !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: "Origin not allowed" });
    }
  }

  next();
});
app.use("/api/auth/login", strictAuthLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/verify-email", strictAuthLimiter);
app.use("/api/auth/resend-verification", strictAuthLimiter);
app.use("/api/auth/forgot-password", strictAuthLimiter);
app.use("/api/auth/reset-password", strictAuthLimiter);
app.use("/api/auth/refresh", strictAuthLimiter);
app.use("/api/auth/google", strictAuthLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", verifyRoutes);
app.use("/api/auth", resendRoutes);
app.use("/api/auth", logoutRoutes);
app.use("/api/auth", refreshRoutes);
app.use("/api/auth", resetRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});
app.use(errorHandler);

export default app;
