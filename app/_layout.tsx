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
    if (typeof isAuthenticated === "undefined") return;

    const inApp = segments[0] === "(tabs)"; // Checking if inside the app

    if (isAuthenticated && !inApp) {
      // Redirect to home if authenticated and not in the app
      router.replace("/home");
    } else if (isAuthenticated === false) {
      // Redirect to sign-in if not authenticated
      router.replace("/");
    }
  }, [isAuthenticated]);

  return <Slot />;
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
        databaseName="mydatabase.db"
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <AuthProvider>
          <MainLayout></MainLayout>
        </AuthProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
