import { Router } from "express";
import { body } from "express-validator";
import { resend } from "../controllers/resend.controller.js";

const router = Router();
router.post(
  "/resend-verification",
  [body("email").isEmail().withMessage("Valid email required")],
  resend
);

export default router;
