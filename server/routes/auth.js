// server/routes/auth.js
import { Router } from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/register",
  [
    body("fullName")
      .optional()
      .isLength({ min: 2, max: 150 })
      .withMessage("Full name must be between 2 and 150 characters"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

export default router;
