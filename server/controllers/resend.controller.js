import { validationResult } from "express-validator";
import { resendVerificationEmail } from "../services/auth.service.js";

export async function resend(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const result = await resendVerificationEmail(email);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
