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
  unit: "lbs" | "kg";
  repsType: "reps" | "rep range";
  sets: Set[];
};

type ExerciseMap = Record<string, ExerciseUpdateData>;

export const updateRoutineInDb = async (
  routineId: string,
  newTitle: string,
  exerciseData: ExerciseMap
) => {
  console.log("🔹 Updating routine:", routineId);
  console.log("New title:", newTitle);
  console.log("New exercise data:", exerciseData);

  // 1️⃣ Update routine title
  await db.update(routines)
    .set({ name: newTitle })
    .where(eq(routines.id, routineId));

  for (const [exerciseId, data] of Object.entries(exerciseData)) {
    // 2️⃣ Check if exercise exists in routineExercises
    const existingRoutineEx = await db
      .select()
      .from(routineExercises)
      .where(
        and(
          eq(routineExercises.routineId, routineId),
          eq(routineExercises.exerciseId, exerciseId)
        )
      )
      .get();

    if (!existingRoutineEx) {
      await db.insert(routineExercises).values({
        routineId,
        exerciseId,
        notes: data.notes ?? "",
        restTimer: data.restTimer ?? 0,
        unit: data.unit ?? "kg",
        repsType: data.repsType ?? "reps",
      });
    } else {
      await db.update(routineExercises)
        .set({
          notes: data.notes ?? "",
          restTimer: data.restTimer ?? 0,
          unit: data.unit ?? "kg",
          repsType: data.repsType ?? "reps",
        })
        .where(
          and(
            eq(routineExercises.routineId, routineId),
            eq(routineExercises.exerciseId, exerciseId)
          )
        );
    }

    // 3️⃣ DELETE old sets for this exercise
    await db.delete(routineSets)
      .where(
        and(
          eq(routineSets.routineId, routineId),
          eq(routineSets.exerciseId, exerciseId)
        )
      );

    // 4️⃣ Insert new sets
    for (let i = 0; i < data.sets.length; i++) {
      const newSet = data.sets[i];
      await db.insert(routineSets).values({
        routineId,
        exerciseId,
        weight: newSet.weight ?? 0,
        reps: newSet.reps ?? 0,
        minReps: newSet.minReps ?? 0,
        maxReps: newSet.maxReps ?? 0,
        duration: newSet.duration ?? 0,
        setType: (newSet.setType as "W" | "Normal" | "D" | "F") ?? "Normal",
      });
    }
  }

  console.log("✅ Routine updated and old sets deleted!");
};
