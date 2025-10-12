import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export async function exportDatabase() {
  try {
    const dbPath = `${FileSystem.documentDirectory}SQLite/Gymify.db`;

    // Ensure DB exists
    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    if (!dbInfo.exists) {
      console.error("❌ Database file not found!");
      return;
    }

    // Share the DB file
    await Sharing.shareAsync(dbPath);
    console.log("✅ Database shared successfully!");
  } catch (error) {
    console.error("❌ Error exporting database:", error);
  }
}
