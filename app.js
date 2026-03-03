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

app.use(helmet());
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
app.use("/api/auth", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use("/api/auth/login", strictAuthLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/verify-email", strictAuthLimiter);
app.use("/api/auth/resend-verification", strictAuthLimiter);
app.use("/api/auth/forgot-password", strictAuthLimiter);
app.use("/api/auth/reset-password", strictAuthLimiter);
app.use("/api/auth/refresh", strictAuthLimiter);

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
