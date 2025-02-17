import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";
import importCSVData from "@/utils/importExercises";

export const DATABASE_NAME = "gymify.db";

export const expo_sqlite = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expo_sqlite, { schema });

// Function to create table
const createExerciseTable = () => {
  try {
    expo_sqlite.execSync(
      `CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        equipment TEXT,
       primary_muscle TEXT  NOT NULL  DEFAULT 'Unknown',
        secondary_muscle TEXT NOT NULL '
      );`
    );
    console.log("Exercise table created");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
const initDB = async () => {
  createExerciseTable();
  await importCSVData();
};

export default initDB;
