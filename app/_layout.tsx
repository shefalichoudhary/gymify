import "react-native-reanimated";
import { Slot } from "expo-router";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db, expo_sqlite } from "../db/db";   // 👈 global singleton db
import migrations from "@/drizzle/migrations";
import { useEffect, useRef, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import "../global.css";
import { GluestackUIProvider, View } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "@/context/authContext"; 
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}
    >
        <GluestackUIProvider config={config}>
          <AuthProvider>
               <BottomSheetModalProvider>

          <SafeAreaView
              style={{ flex: 1, backgroundColor: "#1F1F1F" }}
              edges={["bottom", "left", "right"]} // ✅ global safe area
            >
              <Slot />
            </SafeAreaView>
               </BottomSheetModalProvider>

          </AuthProvider>
        </GluestackUIProvider>
    </GestureHandlerRootView>
  );
};

export default function RootLayout() {
  const { success, error: migrationError } = useMigrations(db, migrations);
  const [appReady, setAppReady] = useState(false);

  useDrizzleStudio(expo_sqlite); // optional debugger

  const hasHiddenSplash = useRef(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const prepare = async () => {
      if (hasHiddenSplash.current) return;

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

    if ((success || migrationError) && !hasHiddenSplash.current) {
      prepare();
    }

    // 🚨 fallback to avoid infinite splash
    timeout = setTimeout(async () => {
      if (!hasHiddenSplash.current) {
        console.warn("Migrations stuck — forcing splash hide.");
        await SplashScreen.hideAsync();
        setAppReady(true);
        hasHiddenSplash.current = true;
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (!appReady) {
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

  // ✅ No <SQLiteProvider> needed here
  return <MainLayout />;
}
