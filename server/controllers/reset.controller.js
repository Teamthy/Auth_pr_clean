import { validationResult } from "express-validator";
import { requestPasswordReset, resetPassword } from "../services/auth.service.js";

export async function forgotPassword(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await requestPasswordReset(req.body.email);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordController(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await resetPassword(req.body.token, req.body.password);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
