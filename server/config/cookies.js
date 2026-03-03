const isProduction = process.env.NODE_ENV === "production";

const cookieSameSite = process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax");
const cookieSecure =
  process.env.COOKIE_SECURE === "true" || (process.env.COOKIE_SECURE !== "false" && isProduction);

const refreshMaxAgeDays = Number(process.env.REFRESH_EXPIRES_DAYS) || 7;

export const REFRESH_COOKIE_NAME = "refreshToken";

export const refreshCookieOptions = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: cookieSecure,
  maxAge: refreshMaxAgeDays * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

export const clearRefreshCookieOptions = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: cookieSecure,
  path: "/api/auth",
};
