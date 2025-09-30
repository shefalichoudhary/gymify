import { Platform } from "react-native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// Open the SQLite database
const sqlite = openDatabaseSync("Gymify.db");

// Initialize Drizzle with the SQLite database and schema
const db = drizzle(sqlite, { schema });

const expo_sqlite = sqlite;
export { db, expo_sqlite };
