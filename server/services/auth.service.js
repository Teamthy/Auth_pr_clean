import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { users } from "../config/usersSchema.js";
import { emailVerificationCodes } from "../config/emailVerificationSchema.js";
import { and, desc, eq, gt } from "drizzle-orm";
import { issueTokens } from "./token.service.js";
import { sendEmail } from "../config/sendgrid.js";
import { refreshTokens } from "../config/refreshTokenSchema.js";
import { resetTokens } from "../config/resetTokensSchema.js"; 
import { randomInt, randomUUID } from "crypto";


const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const VERIFY_CODE_EXPIRES_MINUTES = Number(process.env.VERIFY_CODE_EXPIRES_MINUTES) || 10;
const RESET_TOKEN_EXPIRES_MINUTES = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES) || 60;

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function frontendUrl() {
  return process.env.FRONTEND_URL || "http://localhost:5173";
}

async function createAndSendVerificationCode(user) {
  const code = String(randomInt(100000, 1000000));
  const codeHash = await bcrypt.hash(code, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + VERIFY_CODE_EXPIRES_MINUTES * 60 * 1000);

  await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.userId, user.id));
  await db.insert(emailVerificationCodes).values({
    userId: user.id,
    codeHash,
    expiresAt,
  });

  await sendEmail({
    to: user.email,
    subject: "Your verification code",
    text: `Your verification code is ${code}. It expires in ${VERIFY_CODE_EXPIRES_MINUTES} minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in ${VERIFY_CODE_EXPIRES_MINUTES} minutes.</p>`,
  });
}

// REGISTER
export async function register({ email, password, fullName }) {
  const normalized = email.trim().toLowerCase();
  const sanitizedFullName = fullName?.trim() || null;
  if (sanitizedFullName && sanitizedFullName.length > 150) {
    const err = new Error("Full name is too long");
    err.status = 400;
    throw err;
  }

  const existing = await db.select().from(users).where(eq(users.email, normalized));
  if (existing.length > 0) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [inserted] = await db
    .insert(users)
    .values({
      fullName: sanitizedFullName,
      email: normalized,
      passwordHash,
      role: "user",
      isVerified: false,
      isActive: true,
    })
    .returning();

  await createAndSendVerificationCode(inserted);
  return { user: publicUser(inserted), requiresVerification: true };
}

export async function loginWithGoogleAccessToken(accessToken) {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = new Error("Google authentication failed");
    err.status = 401;
    throw err;
  }

  const profile = await response.json();
  if (!profile?.email || profile?.email_verified === false) {
    const err = new Error("Google account email is not verified");
    err.status = 400;
    throw err;
  }

  const normalized = profile.email.trim().toLowerCase();
  const fullName = profile.name?.trim() || null;
  const [existing] = await db.select().from(users).where(eq(users.email, normalized)).limit(1);

  if (existing) {
    if (!existing.isActive) {
      const err = new Error("Account is deactivated. Contact support.");
      err.status = 403;
      throw err;
    }

    const updateData = { updatedAt: new Date() };
    if (!existing.isVerified) {
      updateData.isVerified = true;
    }
    if (!existing.fullName && fullName) {
      updateData.fullName = fullName;
    }

    let user = existing;
    if (Object.keys(updateData).length > 1) {
      const [updated] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, existing.id))
        .returning();
      user = updated;
    }

    const { accessToken: newAccessToken, refreshToken } = await issueTokens(user);
    return { user: publicUser(user), accessToken: newAccessToken, refreshToken };
  }

  const passwordHash = await bcrypt.hash(randomUUID(), SALT_ROUNDS);
  const [inserted] = await db
    .insert(users)
    .values({
      fullName,
      email: normalized,
      passwordHash,
      role: "user",
      isVerified: true,
      isActive: true,
    })
    .returning();

  const { accessToken: newAccessToken, refreshToken } = await issueTokens(inserted);
  return { user: publicUser(inserted), accessToken: newAccessToken, refreshToken };
}

// LOGIN
export async function login({ email, password }) {
  const normalized = email.trim().toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, normalized));
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error("Account is deactivated. Contact support.");
    err.status = 403;
    throw err;
  }

  if (!user.isVerified) {
    const err = new Error("Please verify your email before logging in.");
    err.status = 403;
    throw err;
  }

  const { accessToken, refreshToken } = await issueTokens(user);

  return { user: publicUser(user), accessToken, refreshToken };
}

// RESEND VERIFICATION
export async function resendVerificationEmail(email) {
  const normalized = email.trim().toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, normalized));

  if (!user) {
    return { message: "If the account exists, a verification code has been sent." };
  }

  if (user.isVerified) {
    return { message: "Email already verified." };
  }

  await createAndSendVerificationCode(user);
  return { message: "If the account exists, a verification code has been sent." };
}

export async function verifyEmailCode({ email, code }) {
  const normalized = email.trim().toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, normalized));
  if (!user) {
    const err = new Error("Invalid email or code");
    err.status = 400;
    throw err;
  }

  if (user.isVerified) {
    return { message: "Email already verified." };
  }

  const [storedCode] = await db
    .select()
    .from(emailVerificationCodes)
    .where(
      and(
        eq(emailVerificationCodes.userId, user.id),
        gt(emailVerificationCodes.expiresAt, new Date())
      )
    )
    .orderBy(desc(emailVerificationCodes.createdAt))
    .limit(1);

  if (!storedCode) {
    const err = new Error("Verification code has expired. Please request a new code.");
    err.status = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(code, storedCode.codeHash);
  if (!isMatch) {
    const err = new Error("Invalid email or code");
    err.status = 400;
    throw err;
  }

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ isVerified: true, updatedAt: new Date() })
      .where(eq(users.id, user.id));
    await tx.delete(emailVerificationCodes).where(eq(emailVerificationCodes.userId, user.id));
  });

  return { message: "Email verified successfully." };
}

export async function resetPassword(token, newPassword) {
  const [stored] = await db.select().from(resetTokens).where(eq(resetTokens.token, token));

  if (!stored || new Date() > stored.expiresAt) {
    const err = new Error("Invalid or expired reset token");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, stored.userId));
    await tx.delete(resetTokens).where(eq(resetTokens.userId, stored.userId));
    await tx.delete(refreshTokens).where(eq(refreshTokens.userId, stored.userId));
  });

  return { message: "Password reset successful" };
}

// Request password reset
export async function requestPasswordReset(email) {
  const normalized = email.trim().toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, normalized));

  if (!user) {
    return {
      message: "If the account exists, a reset link has been sent.",
    };
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);

  await db.delete(resetTokens).where(eq(resetTokens.userId, user.id));
  await db.insert(resetTokens).values({
    userId: user.id,
    token,
    expiresAt,
  });

  const resetUrl = `${frontendUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    text: `Use this link to reset your password: ${resetUrl}`,
    html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  return { message: "If the account exists, a reset link has been sent." };
}

// LOGOUT
export async function logout(userId) {
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  return { message: "Logged out successfully" };
}

export async function getProfile(userId) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return publicUser(user);
}

export async function listUsers() {
  return db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      isVerified: users.isVerified,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId, role) {
  const allowedRoles = new Set(["user", "admin"]);
  if (!allowedRoles.has(role)) {
    const err = new Error("Invalid role");
    err.status = 400;
    throw err;
  }

  const [updated] = await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  if (!updated) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return publicUser(updated);
}

export async function updateUserFlags(userId, { isActive, isVerified }) {
  const updateData = { updatedAt: new Date() };
  if (typeof isActive === "boolean") {
    updateData.isActive = isActive;
  }
  if (typeof isVerified === "boolean") {
    updateData.isVerified = isVerified;
  }

  if (Object.keys(updateData).length === 1) {
    const err = new Error("No updatable fields provided");
    err.status = 400;
    throw err;
  }

  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning();

  if (!updated) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  if (isActive === false) {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  return publicUser(updated);
}
