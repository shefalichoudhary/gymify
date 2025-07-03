import { db } from "@/db/db";
import {
  routines,
  routineExercises,
  routineSets,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { WorkoutSet as Set } from "@/types/workoutSet";


type ExerciseUpdateData = {
  notes: string;
  restTimer: boolean;
  sets: Set[];
};

type ExerciseMap = Record<string, ExerciseUpdateData>;

export const updateRoutineInDb = async (
  routineId: string,
  newTitle: string,
  exerciseData: ExerciseMap
) => {
  // Update routine title
  await db.update(routines)
    .set({ name: newTitle })
    .where(eq(routines.id, routineId));

  for (const [exerciseId, data] of Object.entries(exerciseData)) {
    // Update notes (assuming only 1 entry per exercise per routine)
await db.update(routineExercises)
  .set({ notes: data.notes })
  .where(
    and(
      eq(routineExercises.routineId, routineId),
      eq(routineExercises.exerciseId, exerciseId)
    )
  );

    // Delete old sets for this exercise in this routine
await db.delete(routineSets)
  .where(
    and(
      eq(routineSets.routineId, routineId),
      eq(routineSets.exerciseId, exerciseId)
    )
  );

    // Insert updated sets
    for (const set of data.sets) {
      await db.insert(routineSets).values({
        routineId,
        exerciseId,
        lbs: set.lbs,
        reps: set.reps,
        minReps: set.minReps ?? null,
        maxReps: set.maxReps ?? null,
        restTimer: data.restTimer ? 60 : 0, // example timer value
      });
    }
  }

  console.log("✅ Routine updated!");
};
