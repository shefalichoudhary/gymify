import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});
