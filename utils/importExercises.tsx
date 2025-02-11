// import * as FileSystem from "expo-file-system";
// import { Asset } from "expo-asset";
// import Papa from "papaparse";
// import { db } from "../db/db"; // Your Drizzle DB instance
// import { exercises, Exercise } from "../db/schema"; // Import schema type

// const importExercises = async () => {
//   try {
//     // Load the asset from the bundle
//     const asset = Asset.fromModule(require("../assets/exercises.csv"));
//     await asset.downloadAsync(); // Ensure it's downloaded

//     // Get the correct file URI
//     const assetUri = asset.localUri;
//     if (!assetUri) {
//       console.error("Failed to load CSV file.");
//       return;
//     }

//     // Read the CSV file content as a string
//     const fileContent = await FileSystem.readAsStringAsync(assetUri);

//     // Parse CSV using PapaParse
//     const results = Papa.parse<Exercise>(fileContent, {
//       header: true, // Use first row as headers
//       skipEmptyLines: true, // Ignore empty lines
//     });

//     if (results.errors.length > 0) {
//       console.error("CSV Parsing Errors:", results.errors);
//       return;
//     }

//     const parsedData = results.data as Exercise[];

//     // Insert parsed data into SQLite
//     for (const row of parsedData) {
//       if (!row.name || !row.category || !row.equipment || !row.muscle_group) {
//         console.warn("Skipping invalid row:", row);
//         continue;
//       }

//       await db.insert(exercises).values(row);
//     }

//     console.log("Exercises imported successfully!");
//   } catch (error) {
//     console.error("Error importing exercises:", error);
//   }
// };

// export default importExercises;
