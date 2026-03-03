import { refreshAccessToken } from "../services/token.service.js";
import { REFRESH_COOKIE_NAME, refreshCookieOptions } from "../config/cookies.js";

export async function refreshController(req, res, next) {
  try {
    const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME];
    const tokenFromBody = process.env.NODE_ENV === "production" ? null : req.body?.refreshToken;
    const refreshToken = tokenFromCookie || tokenFromBody;
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
