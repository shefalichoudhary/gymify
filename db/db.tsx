import { Platform } from "react-native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";
import AsyncStorage from "@react-native-async-storage/async-storage";

let db: any;
let expo_sqlite: any;

if (Platform.OS === "web") {
  // Web fallback
  db = {
    select: async (table: string) => {
      const raw = await AsyncStorage.getItem(table);
      return raw ? JSON.parse(raw) : [];
    },
    insert: async (table: string, data: any) => {
      const raw = await AsyncStorage.getItem(table);
      const arr = raw ? JSON.parse(raw) : [];
      const id = Math.random().toString();
      arr.push({ id, ...data });
      await AsyncStorage.setItem(table, JSON.stringify(arr));
      return { insertId: id };
    },
    update: async () => {
      console.warn("Update not implemented on web yet");
    },
    delete: async () => {
      console.warn("Delete not implemented on web yet");
    },
  };
  expo_sqlite = null;
} else {
  const sqlite = openDatabaseSync("Gymify.db");
  db = drizzle(sqlite, { schema });
  expo_sqlite = sqlite;
}

export { db, expo_sqlite };
