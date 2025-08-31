import "react-native-reanimated";
import { Slot, } from "expo-router";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db, expo_sqlite } from "../db/db";
import migrations from "@/drizzle/migrations";
import { Suspense, useEffect, useRef, useState } from "react";
import { SQLiteProvider } from "expo-sqlite";
import * as SplashScreen from "expo-splash-screen";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import "../global.css";
import { GluestackUIProvider, View } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "@/context/authContext"; 
import { ActivityIndicator } from "react-native";
SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
   return (
 <GestureHandlerRootView style={{ flex: 1,  }}>
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
  const [appReady, setAppReady] = useState(false);

  useDrizzleStudio(expo_sqlite);

  const hasHiddenSplash = useRef(false);

  useEffect(() => {
    const prepare = async () => {
      if (hasHiddenSplash.current) return; // already handled

      if (migrationError) {
        console.error("Migration error:", migrationError);
        await SplashScreen.hideAsync();
        setAppReady(true);
        hasHiddenSplash.current = true;
      } else if (success) {
        console.log("Migration Success:", success);
        await SplashScreen.hideAsync();
        setAppReady(true);
        hasHiddenSplash.current = true;
      }
    };

    // only run once when migrations finish
    if ((success || migrationError) && !hasHiddenSplash.current) {
      prepare();
    }
  }, [success, migrationError]);

   if (!appReady) {
    // temporary fallback before splash hides
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  return (
    <SQLiteProvider
      databaseName="Gymify.db"
      options={{ enableChangeListener: true }}
    >
      <MainLayout />
    </SQLiteProvider>
  );
}
