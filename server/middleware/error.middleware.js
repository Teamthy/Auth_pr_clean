// server/middleware/error.middleware.js

export function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== "test") {
    console.error(err.stack || err);
  }

  const databaseConnectivityCodes = new Set([
    "ETIMEDOUT",
    "ENOTFOUND",
    "EAI_AGAIN",
    "ECONNREFUSED",
    "57P01",
    "08001",
    "08006",
  ]);

  const baseCode = err?.code;
  const causeCode = err?.cause?.code;
  const isDatabaseUnavailableError =
    databaseConnectivityCodes.has(baseCode) || databaseConnectivityCodes.has(causeCode);

  const status = err.status || (isDatabaseUnavailableError ? 503 : 500);
  const message = isDatabaseUnavailableError
    ? "Database is unavailable. Check DATABASE_URL and network access to your database host."
    : status >= 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(status).json({ error: message });
}
