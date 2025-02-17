import * as FileSystem from "expo-file-system";

import { Asset } from "expo-asset";
import { expo_sqlite } from "../db/db";

// Open SQLite database

// Function to copy CSV file from assets to the document directory
const copyCSVToDocuments = async () => {
  try {
    // ✅ Ensure the correct path
    const asset = Asset.fromModule(require("../assets/exercises.csv")); // Adjust if needed

    // ✅ Ensure asset is downloaded
    await asset.downloadAsync();

    // ✅ Check if `localUri` is valid
    if (!asset.localUri) {
      throw new Error("Failed to load asset: exercises.csv");
    }

    const fileUri = `${FileSystem.documentDirectory}exercises.csv`;
    console.log("Trying to read:", fileUri);

    const fileExists = await FileSystem.getInfoAsync(fileUri);
    if (!fileExists.exists) {
      await FileSystem.copyAsync({
        from: asset.localUri, // Guaranteed to be a string now
        to: fileUri,
      });
      console.log("CSV file copied successfully.");
    }

    return fileUri;
  } catch (error) {
    console.error("Error copying CSV file:", error);
  }
};

// Function to read CSV file and insert data into SQLite
const importCSVData = async () => {
  try {
    const fileUri = await copyCSVToDocuments();
    // ✅ Ensure fileUri is a valid string before reading
    if (!fileUri) {
      throw new Error("File URI is undefined. Cannot read CSV.");
    }
    const csvString = await FileSystem.readAsStringAsync(fileUri);

    // Parse CSV data
    const rows = csvString.split("\n").slice(1); // Remove headers
    const insertQueries = rows
      .map((row) => {
        const columns = row.split(",");
        if (columns.length < 6) return null; // Ensure valid row

        const name = columns[1]?.trim();
        const category = columns[2]?.trim();
        const equipment = columns[3]?.trim();
        const primary_muscle = columns[4]?.trim();
        const secondary_muscle = columns[5]?.trim();

        return `INSERT INTO exercises (name, category, equipment, primary_muscle, secondary_muscle) 
                VALUES ('${name}', '${category}', '${equipment}', '${primary_muscle}', '${secondary_muscle}');`;
      })
      .filter(Boolean)
      .join(" ");

    if (insertQueries) {
      expo_sqlite.execSync(insertQueries);
      console.log("CSV data imported successfully");
    }
  } catch (error) {
    console.error("Error importing CSV:", error);
  }
};

export default importCSVData;
