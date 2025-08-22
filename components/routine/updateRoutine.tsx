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
  restTimer: number;
  
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

  .set({ notes: data.notes ?? "" ,
      restTimer: data.restTimer ?? 0 ,
  })
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
         weight: set.weight ?? 0, 
  reps: set.reps ?? 0,
  minReps: set.minReps ?? 0,
  maxReps: set.maxReps ?? 0,
  duration: set.duration ?? 0,
      setType: (set.setType as "W" | "Normal" | "D" | "F") ?? "Normal",

      });
    }
  }

  console.log("✅ Routine updated!");
};
