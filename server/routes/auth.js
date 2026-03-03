// server/routes/auth.js
import { Router } from "express";
import { body } from "express-validator";
import { register, login, googleAuth } from "../controllers/auth.controller.js";

const router = Router();

router.get("/google-client-id", (req, res) => {
  return res.json({
    clientId: process.env.GOOGLE_CLIENT_ID || null,
  });
});

router.post(
  "/register",
  [
    body("fullName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 150 })
      .withMessage("Full name must be between 2 and 150 characters"),
    body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.post(
  "/google",
  [body("accessToken").isString().notEmpty().withMessage("Google access token is required")],
  googleAuth
);

export default router;
