import { logout } from "../services/auth.service.js";

export async function logoutController(req, res, next) {
  try {
    const userId = req.user.sub;
    const result = await logout(userId);
    res.clearCookie("refreshToken");
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
