import { logout } from "../services/auth.service.js";
import { REFRESH_COOKIE_NAME, clearRefreshCookieOptions } from "../config/cookies.js";

export async function logoutController(req, res, next) {
  try {
    const userId = req.user.sub;
    const result = await logout(userId);
    res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
