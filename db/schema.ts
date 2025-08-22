import { sqliteTable, text,integer, } from "drizzle-orm/sqlite-core";
import { InferSelectModel} from "drizzle-orm";
import { sql } from "drizzle-orm";
import cuid from "cuid";

// Tables
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // hashed
});
export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
  exercise_name: text("exercise_name").notNull(),
exercise_type: text("exercise_type"),
  equipment: text("equipment").notNull(),
  type: text("type").notNull(), 
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
   unit: text("unit").$type<"lbs" | "kg">().notNull().default("kg"),
  repsType: text("reps_type").$type<"reps" | "rep range">().notNull().default("reps"),
    restTimer: integer("rest_timer").default(0), 
});
export const routineSets = sqliteTable("routine_sets", {
 id: text("id").primaryKey().$defaultFn(() => cuid()),
 routineId: text("routine_id").notNull().references(() => routines.id),
   exerciseId: text("exercise_id").notNull().references(() => exercises.id), 
weight: integer("weight").notNull(),
  reps: integer("reps").default(0),
  minReps: integer("min_reps").default(0),
  maxReps: integer("max_reps").default(0),
    duration: integer("duration").default(0),
    setType: text("set_type").$type<"W" | "Normal" | "D" | "F">().notNull().default("Normal"), 
// 🕒 rest time per set
});
export const workouts = sqliteTable("workouts", {
 id: text("id").primaryKey().$defaultFn(() => cuid()),

  routineId: text("routine_id").references(() => routines.id), 
  date: text("date").notNull(),  
  title: text("title").notNull(),    
  duration: integer("duration").notNull(),
  volume: integer("volume").notNull(),
  sets: integer("sets").notNull(),
});
export const workoutExercises = sqliteTable("workout_exercises", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
  workoutId: text("workout_id").notNull().references(() => workouts.id),
  exerciseId: text("exercise_id").notNull().references(() => exercises.id),
  notes: text("notes"),
  unit: text("unit").$type<"lbs" | "kg">().notNull().default("kg"),
  repsType: text("reps_type").$type<"reps" | "rep range">().notNull().default("reps"),
});
export const workoutSets = sqliteTable("workout_sets", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
  workoutId: text("workout_id").notNull().references(() => workouts.id),
  exerciseId: text("exercise_id").notNull().references(() => exercises.id),
  weight: integer("weight").notNull(),
  reps: integer("reps"),
  minReps: integer("min_reps"),
  maxReps: integer("max_reps"),
  isRangeReps: integer("is_range_reps", { mode: "boolean" }).notNull().default(false),
   previousWeight: integer("previous_weight"),
  previousReps: integer("previous_reps"),
  previousMinReps: integer("previous_min_reps"),
  previousMaxReps: integer("previous_max_reps"),
  previousUnit: text("previous_unit").$type<"lbs" | "kg">(),
  previousRepsType: text("previous_reps_type").$type<"reps" | "rep range">(),
    duration: integer("duration").default(0),

});
export const userRoutineWorkout = sqliteTable("user_routine_workout", {
  id: text("id").primaryKey().$defaultFn(() => cuid()),
  userId: text("user_id").notNull().references(() => users.id),

  routineId: text("routine_id").references(() => routines.id),
  workoutId: text("workout_id").references(() => workouts.id),

  // You can also add type: 'routine' | 'workout' if you want to filter
});

// Types
export type Exercise = InferSelectModel<typeof exercises>;
export type Muscle = InferSelectModel<typeof muscles>;
export type ExerciseMuscle = InferSelectModel<typeof exerciseMuscles>;
export type Routine = InferSelectModel<typeof routines>;
export type RoutineExercise = InferSelectModel<typeof routineExercises>;
export type RoutineSet = InferSelectModel<typeof routineSets>;
export type Workout = InferSelectModel<typeof workouts>;