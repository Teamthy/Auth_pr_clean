// server/middleware/error.middleware.js

export function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== "test") {
    console.error(err.stack || err);
  }

  const status = err.status || 500;
  const message =
    status >= 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(status).json({ error: message });
}
