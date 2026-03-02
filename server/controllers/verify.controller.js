import { validationResult } from "express-validator";
import { verifyEmailCode } from "../services/auth.service.js";

export async function verify(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, code } = req.body;
    const result = await verifyEmailCode({ email, code });
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
