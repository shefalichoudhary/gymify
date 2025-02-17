import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").default("").notNull(),
});

// Define the 'exercises' table schema
export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  equipment: text("equipment").notNull(),
  primary_muscle: text("primary_muscle").notNull().default(""),
 secondary_muscle: text("secondary_muscle").notNull().default(""),

});

// Type inference for inserting exercises
export type Exercise = typeof exercises.$inferInsert;

