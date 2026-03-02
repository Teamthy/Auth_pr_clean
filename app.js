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

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

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
