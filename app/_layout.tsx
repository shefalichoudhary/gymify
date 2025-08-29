import "react-native-gesture-handler";
import "react-native-reanimated";
import "@/global.css";
import { Slot, } from "expo-router";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db, expo_sqlite } from "../db/db";
import migrations from "@/drizzle/migrations";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import * as SplashScreen from "expo-splash-screen";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import "../global.css";
SplashScreen.preventAutoHideAsync();
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "@/context/authContext"; 
const MainLayout = () => {
   return (
 <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <GluestackUIProvider config={config}>
          <AuthProvider>
            <Slot />
          </AuthProvider>
        </GluestackUIProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
   );
};

export default function RootLayout() {
  const { success, error: migrationError } = useMigrations(db, migrations);
  const [isReady, setIsReady] = useState(false);

  useDrizzleStudio(expo_sqlite);
  console.log("DB Initialized:", db);

useEffect(() => {
  if (migrationError) {
    console.error("Migration error:", migrationError);
  } else if (success) {
    console.log("Migration Success:", success);
    setIsReady(true);

    SplashScreen.hideAsync().catch(() => {}); // hide only after DB and app ready
  }
}, [success, migrationError]);  

if (!isReady || migrationError) {
  return null; // keep splash visible
}

  return (
    <Suspense >
      <SQLiteProvider
        databaseName="Gymify.db"
        options={{ enableChangeListener: true }}
      >
       <MainLayout />

      </SQLiteProvider>
    </Suspense>
  );
}
