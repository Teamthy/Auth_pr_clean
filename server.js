// server/server.js
import dotenv from "dotenv";
import app from "./app.js";
import { ensureDatabaseCompatibility } from "./server/config/db.js";

dotenv.config();
const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "EMAIL_FROM"];
if (process.env.NODE_ENV === "production") {
  requiredEnv.push("SENDGRID_API_KEY", "FRONTEND_URL");
}
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`);
}

const PORT = process.env.PORT || 5000;
await ensureDatabaseCompatibility();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
