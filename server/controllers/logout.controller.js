import { logout } from "../services/auth.service.js";

const REFRESH_COOKIE_NAME = "refreshToken";
const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export async function logoutController(req, res, next) {
  try {
    const userId = req.user.sub;
    const result = await logout(userId);
    res.clearCookie(REFRESH_COOKIE_NAME, CLEAR_COOKIE_OPTIONS);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
