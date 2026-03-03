import { randomBytes } from "crypto";

const isProduction = process.env.NODE_ENV === "production";
const cookieSameSite = process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax");
const cookieSecure =
  process.env.COOKIE_SECURE === "true" || (process.env.COOKIE_SECURE !== "false" && isProduction);

const CSRF_COOKIE_NAME = "csrfToken";

function generateCsrfToken() {
  return randomBytes(32).toString("hex");
}

export function issueCsrfToken(req, res) {
  const csrfToken = generateCsrfToken();
  res.cookie(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    sameSite: cookieSameSite,
    secure: cookieSecure,
    path: "/",
    maxAge: 60 * 60 * 1000,
  });
  return res.json({ csrfToken });
}
export const csrfTokenEndpoint = issueCsrfToken;

export function csrfProtection(req, res, next) {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return next();
  }

  const csrfFromHeader = req.get("x-csrf-token");
  const csrfFromCookie = req.cookies?.[CSRF_COOKIE_NAME];
  if (!csrfFromHeader || !csrfFromCookie || csrfFromHeader !== csrfFromCookie) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  return next();
}
export const validateCSRFToken = csrfProtection;
