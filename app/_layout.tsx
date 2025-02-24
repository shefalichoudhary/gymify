import { Slot, useRouter, useSegments } from "expo-router";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db, expo_sqlite } from "../db/db";
import migrations from "@/drizzle/migrations";
import { AuthProvider, useAuth } from "@/context/authContext";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import * as SplashScreen from "expo-splash-screen";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import "../global.css";
SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated == "undefined") return;

    const inApp = segments[0] == "(tabs)"; // Checking if inside the tabs

    if (isAuthenticated && !inApp) {
      router.replace("/home");
    } else if (isAuthenticated == false) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  const { success, error: migrationError } = useMigrations(db, migrations);
  const [isReady, setIsReady] = useState(false);

  useDrizzleStudio(expo_sqlite);

  useEffect(() => {
    if (migrationError) {
      console.error("Migration error:", migrationError); // Log migration error for debugging
    }

    if (success) {
      console.log("Migrations completed successfully.");
      setIsReady(true);
      SplashScreen.hideAsync();
    }

    if (migrationError || success) {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [success, migrationError]);

  if (!isReady || migrationError) {
    return (
      <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
        <Text>
          {migrationError
            ? `Error initializing database: ${migrationError}`
            : "Loading..."}
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
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
