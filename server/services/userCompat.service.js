import { pool } from "../config/db.js";

let usersColumnsCache = null;

function parseBoolean(value, defaultValue) {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return Boolean(value);
}

function normalizeUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    fullName: row.full_name ?? null,
    email: row.email,
    passwordHash: row.password_hash ?? null,
    role: row.role ?? "user",
    isVerified: parseBoolean(row.is_verified, false),
    isActive: parseBoolean(row.is_active, true),
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? row.created_at ?? null,
  };
}

function buildUsersSelectProjection(columnSet) {
  const fullNameExpr = columnSet.has("full_name") ? `"full_name"` : `NULL`;
  const passwordExpr = columnSet.has("password_hash")
    ? `"password_hash"`
    : columnSet.has("password")
      ? `"password"`
      : `NULL`;
  const roleExpr = columnSet.has("role") ? `"role"` : `'user'`;
  const isVerifiedExpr = columnSet.has("is_verified") ? `"is_verified"` : `false`;
  const isActiveExpr = columnSet.has("is_active") ? `"is_active"` : `true`;
  const createdAtExpr = columnSet.has("created_at") ? `"created_at"` : `NOW()`;
  const updatedAtExpr = columnSet.has("updated_at")
    ? `"updated_at"`
    : columnSet.has("created_at")
      ? `"created_at"`
      : `NOW()`;

  return `
    "id",
    ${fullNameExpr} AS "full_name",
    "email",
    ${passwordExpr} AS "password_hash",
    ${roleExpr} AS "role",
    ${isVerifiedExpr} AS "is_verified",
    ${isActiveExpr} AS "is_active",
    ${createdAtExpr} AS "created_at",
    ${updatedAtExpr} AS "updated_at"
  `;
}

function buildUsersOrderBy(columnSet) {
  if (columnSet.has("created_at")) {
    return `"created_at" DESC`;
  }
  return `"id" DESC`;
}

export async function getUsersColumnSet() {
  if (usersColumnsCache) {
    return usersColumnsCache;
  }

  const result = await pool.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
    `
  );

  usersColumnsCache = new Set(result.rows.map((row) => row.column_name));
  return usersColumnsCache;
}

export async function findUserByEmail(email) {
  const columns = await getUsersColumnSet();
  const projection = buildUsersSelectProjection(columns);
  const result = await pool.query(
    `SELECT ${projection} FROM "users" WHERE "email" = $1 LIMIT 1`,
    [email]
  );
  return normalizeUserRow(result.rows[0]);
}

export async function findUserById(userId) {
  const columns = await getUsersColumnSet();
  const projection = buildUsersSelectProjection(columns);
  const result = await pool.query(
    `SELECT ${projection} FROM "users" WHERE "id" = $1 LIMIT 1`,
    [userId]
  );
  return normalizeUserRow(result.rows[0]);
}

export async function listUsersCompat() {
  const columns = await getUsersColumnSet();
  const projection = buildUsersSelectProjection(columns);
  const orderBy = buildUsersOrderBy(columns);
  const result = await pool.query(`SELECT ${projection} FROM "users" ORDER BY ${orderBy}`);
  return result.rows.map((row) => normalizeUserRow(row));
}

export async function createUser({
  email,
  passwordHash,
  role = "user",
  isVerified = false,
  isActive = true,
  fullName = null,
}) {
  const columns = await getUsersColumnSet();
  const fields = [];
  const values = [];

  function pushField(columnName, value) {
    fields.push(`"${columnName}"`);
    values.push(value);
  }

  pushField("email", email);

  if (columns.has("password_hash")) {
    pushField("password_hash", passwordHash);
  } else if (columns.has("password")) {
    pushField("password", passwordHash);
  } else {
    throw new Error("Users table does not have a password column");
  }

  if (columns.has("role")) {
    pushField("role", role);
  }
  if (columns.has("is_verified")) {
    pushField("is_verified", isVerified);
  }
  if (columns.has("is_active")) {
    pushField("is_active", isActive);
  }
  if (columns.has("full_name")) {
    pushField("full_name", fullName);
  }

  // Backward compatibility for legacy schemas that required these fields.
  if (columns.has("first_name")) {
    pushField("first_name", fullName?.trim().split(/\s+/)[0] || "User");
  }
  if (columns.has("last_name")) {
    const parts = fullName?.trim().split(/\s+/) || [];
    pushField("last_name", parts.length > 1 ? parts.slice(1).join(" ") : "Account");
  }
  if (columns.has("username")) {
    const usernameBase = email.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") || "user";
    const suffix = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    pushField("username", `${usernameBase}_${suffix}`.slice(0, 100));
  }

  if (columns.has("created_at")) {
    pushField("created_at", new Date());
  }
  if (columns.has("updated_at")) {
    pushField("updated_at", new Date());
  }

  const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
  const query = `INSERT INTO "users" (${fields.join(", ")}) VALUES (${placeholders})`;
  await pool.query(query, values);

  return findUserByEmail(email);
}

export async function updateUserById(userId, updates) {
  const columns = await getUsersColumnSet();
  const sets = [];
  const values = [];

  function pushSet(columnName, value) {
    sets.push(`"${columnName}" = $${values.length + 1}`);
    values.push(value);
  }

  if (updates.fullName !== undefined && columns.has("full_name")) {
    pushSet("full_name", updates.fullName);
  }
  if (updates.fullName !== undefined && columns.has("first_name")) {
    const firstName = updates.fullName?.trim().split(/\s+/)[0] || "User";
    pushSet("first_name", firstName);
  }
  if (updates.fullName !== undefined && columns.has("last_name")) {
    const parts = updates.fullName?.trim().split(/\s+/) || [];
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "Account";
    pushSet("last_name", lastName);
  }
  if (updates.role !== undefined && columns.has("role")) {
    pushSet("role", updates.role);
  }
  if (updates.isVerified !== undefined && columns.has("is_verified")) {
    pushSet("is_verified", updates.isVerified);
  }
  if (updates.isActive !== undefined && columns.has("is_active")) {
    pushSet("is_active", updates.isActive);
  }
  if (updates.passwordHash !== undefined) {
    if (columns.has("password_hash")) {
      pushSet("password_hash", updates.passwordHash);
    } else if (columns.has("password")) {
      pushSet("password", updates.passwordHash);
    }
  }
  if (sets.length > 0 && columns.has("updated_at")) {
    pushSet("updated_at", new Date());
  }

  if (sets.length > 0) {
    values.push(userId);
    await pool.query(`UPDATE "users" SET ${sets.join(", ")} WHERE "id" = $${values.length}`, values);
  }

  return findUserById(userId);
}
