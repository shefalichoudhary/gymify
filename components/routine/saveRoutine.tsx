// components/routine/saveRoutine.ts

import { db } from "@/db/db"; // use alias if you're using "@/"
import { routines, routineExercises, routineSets } from "@/db/schema";
import cuid from "cuid";
import { Exercise } from "@/db/schema";
import { WorkoutSet as Set } from "@/types/workoutSet"; // ✅ make sure this is correctly typed

type ExerciseData = Record<
  string,
  {
    notes: string;
    restTimer: boolean;
    sets: Set[];
  }
>;

export const saveRoutineToDb = async (
  title: string,
  selectedExercises: Exercise[],
  exerciseData: ExerciseData
) => {
  const routineId = cuid();

  // 1️⃣ Save routine
  await db.insert(routines).values({
    id: routineId,
    name: title,
  });

   console.log("✅ Routine inserted:", title);
 // 2️⃣ For each exercise
  for (const exercise of selectedExercises) {
    const exerciseId = exercise.id;
    const routineExerciseId = cuid();
    const exerciseEntry = exerciseData[exerciseId];

    console.log(`📦 Inserting exercise "${exercise.exercise_name}" with ID: ${routineExerciseId}`);

    await db.insert(routineExercises).values({
      id: routineExerciseId,
      
      routineId,
      exerciseId,
      notes: exerciseEntry?.notes ?? "",
    });

    const sets = exerciseEntry?.sets || [];

    for (const [i, set] of sets.entries()) {
      await db.insert(routineSets).values({
        routineId,
          exerciseId,
        weight: Number(set.weight) || 0,
        reps: Number(set.reps) || 0,
        minReps: set.minReps ?? null,
        maxReps: set.maxReps ?? null,
        restTimer: 0, // or from set if needed
      });

      console.log(
        `  ➕ Set ${i + 1} inserted: weight=${set.weight}, reps=${set.reps}, minReps=${set.minReps}, maxReps=${set.maxReps}`
      );
    }
  }

  console.log("✅ Routine fully saved to DB!");
  return routineId;
};