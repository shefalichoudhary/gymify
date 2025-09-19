import { Platform } from "react-native";
import { db } from "./db";
import * as schema from "./schema";

const tableMap: Record<string, any> = {
  users: schema.users,
  exercises: schema.exercises,
  routines: schema.routines,
  routineExercises: schema.routineExercises,
  routineSets: schema.routineSets,
  workouts: schema.workouts,
  workoutExercises: schema.workoutExercises,
  workoutSets: schema.workoutSets,
  muscles: schema.muscles,
  exerciseMuscles: schema.exerciseMuscles,
  userRoutineWorkout: schema.userRoutineWorkout,
};

// Helper to handle both Drizzle (native) and raw SQLite (web)
export const dbHelper = {
  // -----------------------
  // CREATE / INSERT
  // -----------------------
  async insert(table: string, values: Record<string, any>) {
    if (Platform.OS === "web") {
      const columns = Object.keys(values).join(", ");
      const placeholders = Object.keys(values).map(() => "?").join(", ");
      const vals = Object.values(values);
      return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
          tx.executeSql(
            `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
            vals,
            (_: any, result: any) => resolve(result),
            (_: any, error: any) => reject(error)
          );
        });
      });
    } else {
      return await db.insert(tableMap[table]).values(values);
    }
  },

  // -----------------------
  // READ / SELECT
  // -----------------------
  async select(table: string, where?: Record<string, any>) {
    if (Platform.OS === "web") {
      let query = `SELECT * FROM ${table}`;
      let vals: any[] = [];
      if (where) {
        const conditions = Object.keys(where)
          .map((k) => {
            vals.push(where[k]);
            return `${k} = ?`;
          })
          .join(" AND ");
        query += ` WHERE ${conditions}`;
      }
      return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
          tx.executeSql(
            query,
            vals,
            (_: any, result: any) => resolve(result.rows._array),
            (_: any, error: any) => reject(error)
          );
        });
      });
    } else {
      let query = db.select().from(tableMap[table]);
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          query = query.where((tableMap[table] as any)[key], "=", value);
        });
      }
      return await query;
    }
  },

  // -----------------------
  // UPDATE
  // -----------------------
  async update(table: string, values: Record<string, any>, where: Record<string, any>) {
    if (Platform.OS === "web") {
      const setString = Object.keys(values).map((k) => `${k} = ?`).join(", ");
      const setVals = Object.values(values);

      const whereString = Object.keys(where).map((k) => `${k} = ?`).join(" AND ");
      const whereVals = Object.values(where);

      return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
          tx.executeSql(
            `UPDATE ${table} SET ${setString} WHERE ${whereString}`,
            [...setVals, ...whereVals],
            (_: any, result: any) => resolve(result),
            (_: any, error: any) => reject(error)
          );
        });
      });
    } else {
      let query = db.update(tableMap[table]).set(values);
      Object.entries(where).forEach(([key, value]) => {
        query = query.where((tableMap[table] as any)[key], "=", value);
      });
      return await query;
    }
  },

  // -----------------------
  // DELETE
  // -----------------------
  async delete(table: string, where: Record<string, any>) {
    if (Platform.OS === "web") {
      const whereString = Object.keys(where).map((k) => `${k} = ?`).join(" AND ");
      const vals = Object.values(where);
      return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
          tx.executeSql(
            `DELETE FROM ${table} WHERE ${whereString}`,
            vals,
            (_: any, result: any) => resolve(result),
            (_: any, error: any) => reject(error)
          );
        });
      });
    } else {
      let query = db.delete(tableMap[table]);
      Object.entries(where).forEach(([key, value]) => {
        query = query.where((tableMap[table] as any)[key], "=", value);
      });
      return await query;
    }
  },
};
