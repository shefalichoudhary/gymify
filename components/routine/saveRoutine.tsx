// import { db } from "@/db/db";
// import { routines, routineExercises, routineSets } from "@/db/schema";
// import cuid from "cuid";

// export async function SaveRoutine(
//   title: string,
//   exerciseData: any
// ) {
//   const routineId = cuid();

//   await db.insert(routines).values({
//     id: routineId,
//     title,
//     createdAt: new Date().toISOString(),
//   });

//   for (const [exerciseId, data] of Object.entries(exerciseData)) {
//     const routineExerciseId = cuid();

//     await db.insert(routineExercises).values({
//       id: routineExerciseId,
//       routineId,
//       exerciseId,
//       notes: data.notes,
//       restTimer: data.restTimer,
//     });

//     for (const [index, set] of data.sets.entries()) {
//       await db.insert(routineSets).values({
//         id: cuid();
//         routineExerciseId,
//         setOrder: index,
//         reps: parseInt(set.reps),
//         lbs: parseFloat(set.lbs),
//         minReps: set.minReps ?? null,
//         maxReps: set.maxReps ?? null,
//       });
//     }
//   }

//   return routineId;
// }
