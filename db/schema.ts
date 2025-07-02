import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferSelectModel} from "drizzle-orm";
import cuid from "cuid";

// Tables
export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
  exercise_name: text("exercise_name").notNull(),
exercise_type: text("exercise_type"),
  equipment: text("equipment").notNull(),
  type: text("type").notNull(), // e.g., "Compound", "Isolation
});

export const muscles = sqliteTable("muscles_targeted", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
  name: text("name").notNull(),
});

export const exerciseMuscles = sqliteTable("exercise_muscles", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
  exercise_id: text("exercise_id").notNull().references(() => exercises.id),
  muscle_id: text("muscle_id").notNull().references(() => muscles.id),
  role: text("role").notNull(),
});

// Types
export type Exercise = InferSelectModel<typeof exercises>       // SELECT type

export type Muscle = InferSelectModel<typeof muscles> 

export type ExerciseMuscle = InferSelectModel<typeof exerciseMuscles> 
