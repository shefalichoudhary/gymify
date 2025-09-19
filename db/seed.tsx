import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import seedExercises from "@/db/seedExercises";
import { dbHelper } from "@/db/dbHelper";

export const useSeedExercises = () => {
  useEffect(() => {
    const getInsertId = (result: any): string => {
      if (!result) return Math.random().toString();
      if (Array.isArray(result) && result[0]?.id) return String(result[0].id);
      if (result.insertId) return String(result.insertId);
      return Math.random().toString();
    };

    const seed = async () => {
      try {
        const seeded = await AsyncStorage.getItem("dbSeeded");
        if (seeded) return; // already seeded, skip

        const muscleMap = new Map<string, string>();

        for (const item of seedExercises) {
          try {
            // Skip exercise if already exists
            const existingExercise = await dbHelper.select("exercises", {
              exercise_name: item.exercise_name,
            });
            if (existingExercise.length > 0) continue;

            // Insert exercise
            const insertedExercise = await dbHelper.insert("exercises", {
              exercise_name: item.exercise_name,
              exercise_type: item.exercise_type,
              equipment: item.equipment,
              type: item.type,
            });

            const exerciseId = getInsertId(insertedExercise);

            // Insert muscles
            for (const muscle of item.muscles) {
              let muscleId = muscleMap.get(muscle.name);

              if (!muscleId) {
                const existingMuscle = await dbHelper.select("muscles_targeted", {
                  name: muscle.name,
                });

                if (existingMuscle.length > 0) {
                  muscleId = String(existingMuscle[0]?.id);
                } else {
                  const insertedMuscle = await dbHelper.insert("muscles_targeted", {
                    name: muscle.name,
                  });
                  muscleId = getInsertId(insertedMuscle);
                }

                muscleMap.set(muscle.name, muscleId);
              }

              await dbHelper.insert("exercise_muscles", {
                exercise_id: exerciseId,
                muscle_id: muscleId,
                role: muscle.role,
              });
            }
          } catch (exerciseErr) {
            console.error(`❌ Failed seeding exercise "${item.exercise_name}":`, exerciseErr);
          }
        }

        // Mark as seeded
        await AsyncStorage.setItem("dbSeeded", "true");
        console.log("✅ Exercise seed completed!");
      } catch (err) {
        console.error("❌ Seed failed:", err);
      }
    };

    seed();
  }, []);
};
