import { db } from "@/db/db";
import { routines, routineExercises, routineSets } from "@/db/schema";
import cuid from "cuid";
import { Exercise } from "@/db/schema";
import { WorkoutSet as Set } from "@/types/workoutSet";

type ExerciseData = Record<
  string,
  {
    notes: string;
    restTimer: number;
    unit: "kg" | "lbs";
    repsType: "reps" | "rep range";
    sets: Set[];
  }
>;

export const saveRoutineToDb = async (
  title: string,
  selectedExercises: Exercise[],
  exerciseData: ExerciseData,
) => {
  const routineId = cuid();

  // Insert into routines
  await db.insert(routines).values({
    id: routineId,
    name: title,
  });

  console.log("✅ Routine inserted:", title);

  // For each selected exercise
  for (const exercise of selectedExercises) {
    const exerciseId = exercise.id;
    const exerciseEntry = exerciseData[exerciseId];
    const routineExerciseId = cuid();

    if (!exerciseEntry) {
      console.warn(`⚠️ No data found for exercise ${exerciseId}`);
      continue;
    }

    const {
      notes,
      restTimer,
      unit = "kg",
      repsType = "reps",
      sets = [],
    } = exerciseEntry;

    // Insert into routineExercises
    await db.insert(routineExercises).values({
      id: routineExerciseId,
      routineId,
      exerciseId,
      notes,
      repsType,
      unit,
       restTimer: restTimer 

    });

    console.log(`📦 Exercise "${exercise.exercise_name}" inserted with ID: ${routineExerciseId}`);

    // Insert sets
    for (const [index, set] of sets.entries()) {
      await db.insert(routineSets).values({
        id: cuid(),
        routineId,
        exerciseId,
        weight: Number(set.weight) || 0,
        reps: set.reps ?? 0,
        minReps: set.minReps ?? 0,
        maxReps: set.maxReps ?? 0,
        duration: set.duration ?? 0,
      setType: (set.setType as "W" | "Normal" | "D" | "F") ?? "Normal",
      });

      console.log(
        `  ➕ Set ${set.setType}: weight=${set.weight}, reps=${set.reps}, min=${set.minReps}, max=${set.maxReps}, unit=${unit}, rest=${restTimer}`
      );
    }
  }

  console.log("✅ Full routine saved to DB.");
  return routineId;
};
