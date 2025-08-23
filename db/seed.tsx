import { db } from "@/db/db";
import { Platform } from "react-native";
import { useEffect } from "react";
import { exercises, muscles, exerciseMuscles } from "@/db/schema";
import seedExercises from "@/db/seedExercises";
import { eq } from "drizzle-orm";

export const useSeedExercises = () => {
  useEffect(() => {
    if (Platform.OS === "web") return;

    const seed = async () => {
      console.log("🌱 Seeding database...");

      const muscleMap = new Map<string, string>();

      for (const item of seedExercises) {
        // Skip exercise if already exists
        const existingExercise = await db
          .select()
          .from(exercises)
          .where(eq(exercises.exercise_name, item.exercise_name));

        if (existingExercise.length > 0) continue;

        // Insert exercise
        const [insertedExercise] = await db
          .insert(exercises)
          .values({
            exercise_name: item.exercise_name,
            exercise_type: item.exercise_type,
            equipment: item.equipment,
            type: item.type,
          })
          .returning();

        // Insert muscles
        for (const muscle of item.muscles) {
          let muscleId = muscleMap.get(muscle.name);

          if (!muscleId) {
            const [existingMuscle] = await db
              .select()
              .from(muscles)
              .where(eq(muscles.name, muscle.name));

            if (existingMuscle) {
              muscleId = existingMuscle.id;
            } else {
              const [insertedMuscle] = await db
                .insert(muscles)
                .values({ name: muscle.name })
                .returning();
              muscleId = insertedMuscle.id;
            }

            muscleMap.set(muscle.name, muscleId);
          }

          await db.insert(exerciseMuscles).values({
            exercise_id: insertedExercise.id,
            muscle_id: muscleId,
            role: muscle.role,
          });
        }
      }

      console.log("✅ Seed completed.");
    };

    seed().catch((err) => console.error("❌ Seed failed:", err));
  }, []);
};
