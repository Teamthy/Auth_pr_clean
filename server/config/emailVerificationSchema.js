import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./usersSchema.js";

export const emailVerificationCodes = pgTable("email_verification_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  codeHash: varchar("code_hash", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
