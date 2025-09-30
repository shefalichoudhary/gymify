import { db } from "./db";
import seedExercises from "./seedExercises";
import { exercises, muscles, exerciseMuscles } from "./schema";
import { eq } from "drizzle-orm";

export const SeedDatabase = async () => {
  for (const exercise of seedExercises) {
    // 1️⃣ Insert exercise
    const insertedExercise = await db
      .insert(exercises)
      .values({
        exercise_name: exercise.exercise_name,
        equipment: exercise.equipment,
        type: exercise.type,
        exercise_type: exercise.exercise_type,
      })
      .returning();

    const exerciseId = insertedExercise[0].id;

    // 2️⃣ Insert muscles (if they don't exist already)
    for (const m of exercise.muscles) {
      let muscleId;

      // Check if muscle exists
      const existingMuscle = await db
        .select()
        .from(muscles)
        .where(eq(muscles.name, m.name));

      if (existingMuscle.length > 0) {
        muscleId = existingMuscle[0].id;
      } else {
        const insertedMuscle = await db
          .insert(muscles)
          .values({ name: m.name })
          .returning();
        muscleId = insertedMuscle[0].id;
      }

      // 3️⃣ Link exercise with muscle
      await db.insert(exerciseMuscles).values({
        exercise_id: exerciseId,
        muscle_id: muscleId,
        role: m.role,
      });
    }
  }

  console.log("✅ Database seeding complete!");
};
