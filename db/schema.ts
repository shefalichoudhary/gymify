import { sqliteTable, text,integer, } from "drizzle-orm/sqlite-core";
import { InferSelectModel} from "drizzle-orm";
import { sql } from "drizzle-orm";
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
export const routines = sqliteTable("routines", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
  name: text("name").notNull(),
  createdBy: text("created_by"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`), 
});
export const routineExercises = sqliteTable("routine_exercises", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
routineId: text("routine_id").notNull().references(() => routines.id),
exerciseId: text("exercise_id").notNull(), // foreign key to your exercises table
  notes: text("notes"),
});
export const routineSets = sqliteTable("routine_sets", {
 id: text("id").primaryKey().$defaultFn(() => cuid()),
 routineId: text("routine_id").notNull().references(() => routines.id),
   exerciseId: text("exercise_id").notNull().references(() => exercises.id), 
  lbs: integer("lbs").notNull(),
  reps: integer("reps").default(0),
  minReps: integer("min_reps").default(0),
  maxReps: integer("max_reps").default(0),
  restTimer: integer("rest_timer").default(0), // 🕒 rest time per set
});
export const workouts = sqliteTable("workouts", {
 id: text("id").primaryKey().$defaultFn(() => cuid()),
  date: text("date").notNull(),  
  title: text("date").notNull(),    
  duration: integer("duration").notNull(),
  volume: integer("volume").notNull(),
  sets: integer("sets").notNull(),
routineId: text("routine_id").references(() => routines.id)
});
// Types
export type Exercise = InferSelectModel<typeof exercises>;
export type Muscle = InferSelectModel<typeof muscles>;
export type ExerciseMuscle = InferSelectModel<typeof exerciseMuscles>;
export type Routine = InferSelectModel<typeof routines>;
export type RoutineExercise = InferSelectModel<typeof routineExercises>;
export type RoutineSet = InferSelectModel<typeof routineSets>;
export type Workout = InferSelectModel<typeof workouts>;