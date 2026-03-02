import { Router } from "express";
import { body } from "express-validator";
import { verify } from "../controllers/verify.controller.js";

const router = Router();
router.post(
  "/verify-email",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("code")
      .isLength({ min: 6, max: 6 })
      .withMessage("Verification code must be 6 digits")
      .isNumeric()
      .withMessage("Verification code must contain digits only"),
  ],
  verify
);

export default router;
