import { validationResult } from "express-validator";
import * as authService from "../services/auth.service.js";
import { REFRESH_COOKIE_NAME, refreshCookieOptions } from "../config/cookies.js";

export async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;
    const result = await authService.register({ fullName, email, password });

    if (result.refreshToken) {
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions);
    }

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    if (result.refreshToken) {
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions);
    }

    return res.json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (err) {
    next(err);
  }
}
