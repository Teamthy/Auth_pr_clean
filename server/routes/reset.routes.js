import { Router } from "express";
import { body } from "express-validator";
import {
  forgotPassword,
  resetPasswordController,
} from "../controllers/reset.controller.js";

const router = Router();

router.post(
  "/forgot-password",
  [body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail()],
  forgotPassword
);
router.post(
  "/reset-password",
  [
    body("token").trim().isString().notEmpty().withMessage("Reset token is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  resetPasswordController
);

export default router;
