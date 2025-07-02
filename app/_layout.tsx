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


const MainLayout = () => {
   return (
       <GestureHandlerRootView style={{ flex: 1 }}>
         <GluestackUIProvider config={config} >
           <Slot />
         </GluestackUIProvider>
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
      SplashScreen.hideAsync();
    }
  }, [success, migrationError]);

  if (!isReady || migrationError) {
    return (
      <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
        <Text>
          {migrationError ? "Error initializing database" : "Loading..."}
        </Text>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
      <SQLiteProvider
        databaseName="gymify.db"
        options={{ enableChangeListener: true }}
        useSuspense
      >
       <MainLayout />
      </SQLiteProvider>
    </Suspense>
  );
}
