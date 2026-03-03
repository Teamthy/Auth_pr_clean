import { refreshAccessToken } from "../services/token.service.js";
import { REFRESH_COOKIE_NAME, refreshCookieOptions } from "../config/cookies.js";

export async function refreshController(req, res, next) {
  try {
    const refreshToken = req.body?.refreshToken || req.cookies?.[REFRESH_COOKIE_NAME];
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    const result = await refreshAccessToken(refreshToken);
    if (result.refreshToken) {
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions);
    }

    return res.json({ accessToken: result.accessToken });
  } catch (err) {
    next(err);
  }
}
