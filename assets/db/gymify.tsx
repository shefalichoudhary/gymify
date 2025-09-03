import * as FileSystem from "expo-file-system";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "../../db/schema";

export const DATABASE_NAME = "Gymify.db";
export const DATABASE_LOCATION = `${FileSystem.documentDirectory}${DATABASE_NAME}`;

export const expo_sqlite = openDatabaseSync(DATABASE_NAME);

export async function setupDatabase() {
  // Check if database already exists
  const dbInfo = await FileSystem.getInfoAsync(DATABASE_LOCATION);
  if (!dbInfo.exists) {
    // Copy prebuilt database from assets
    await FileSystem.copyAsync({
      from: FileSystem.bundleDirectory + `assets/db/${DATABASE_NAME}`,
      to: DATABASE_LOCATION,
    });
    console.log("Database copied from assets!");
  } else {
    console.log("Database already exists.");
  }
}
