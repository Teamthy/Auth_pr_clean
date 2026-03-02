import { refreshAccessToken } from "../services/token.service.js";

const REFRESH_COOKIE_NAME = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function refreshController(req, res, next) {
  try {
    const refreshToken = req.body?.refreshToken || req.cookies?.[REFRESH_COOKIE_NAME];
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    const result = await refreshAccessToken(refreshToken);
    if (result.refreshToken) {
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, COOKIE_OPTIONS);
    }

    return res.json({ accessToken: result.accessToken });
  } catch (err) {
    next(err);
  }
}
