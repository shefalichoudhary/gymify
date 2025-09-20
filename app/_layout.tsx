import "react-native-reanimated";
import { router, Slot, useRouter } from "expo-router";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db, expo_sqlite } from "../db/db";
import migrations from "@/drizzle/migrations";
import { useEffect, useRef, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import "../global.css";
import {
  GluestackUIProvider,
  View,
  VStack,
  HStack,
  Text,
  Pressable,
} from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "@/context/authContext";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons,MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/authContext";

SplashScreen.preventAutoHideAsync();

const sidebarLinks = [
  { name: "Home", path: "/home" as const, icon: (props: any) => <Ionicons name="home-outline" {...props} /> },
  { name: "Workout", path: "/workout" as const, icon: (props: any) => <MaterialCommunityIcons name="dumbbell" {...props} /> },
  { name: "Profile", path: "/profile" as const, icon: (props: any) => <Ionicons name="person-outline" {...props} /> },
  { name: "LogWorkout", path: "/logWorkout" as const, icon: (props: any) => <Ionicons name="settings-outline" {...props} /> },
];
const AuthConsumer = () => {
  const { user, logout } = useAuth();

  return user ? (
    // User is logged in → show Logout
    <Pressable onPress={logout}>
    <MaterialIcons name="logout" size={26} color="white" />
    </Pressable>
  ) : (
    // User is not logged in → show Login
    <Pressable onPress={() => router.push("/signIn")}>
      <MaterialCommunityIcons name="login" size={26} color="white" />
    </Pressable>
  );
};
const MainLayout = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <AuthProvider>
          <BottomSheetModalProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#1F1F1F" }}  edges={["bottom", "left", "right"]}>
              <HStack flex={1}>
                {/* Sidebar for large screens */}
                {isLargeScreen && (
                  <VStack
                    w="25%"
                    bg="$black"
                    p="$4"
                    borderRightWidth={1}
                    borderColor="$gray700"
                    justifyContent="space-between"
                  >
                    <VStack space="lg">
                      <Text color="$white" fontWeight="$bold" fontSize="$lg" mb="$2">
                        Navigation
                      </Text>

                      {sidebarLinks.map((link, idx) => {
                        const Icon = link.icon;
                        return (
                          <Pressable
                            key={idx}
                           onPress={() => router.push(link.path )}
                            borderRadius="$md"
                            p="$3"
                            flexDirection="row"
                            alignItems="center"
                            bg="$gray800"
                            mb="$2"
                          >
                            <Icon size={20} color="white" />
                            <Text color="$white" fontSize="$sm" ml="$3">
                              {link.name}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </VStack>

                    <VStack mt="auto" pt="$4" borderTopWidth={1} borderColor="$gray700">
                      <HStack alignItems="center" justifyContent="space-between">
                        <HStack alignItems="center">
                          <View
                            w={40}
                            h={40}
                            borderRadius={20}
                            bg="$gray600"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Text color="$white" fontWeight="$bold">
                              U
                            </Text>
                          </View>
                          <VStack ml="$2">
                            <Text color="$white" fontWeight="$bold" fontSize="$sm">
                              Unknown User
                            </Text>
                          </VStack>
                        </HStack>

                      <AuthConsumer/>
                      </HStack>
                    </VStack>
                  </VStack>
                )}

                {/* Main content */}
                <View style={{ flex: 1 }}>
                  <Slot />
                </View>
              </HStack>
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

  useDrizzleStudio(expo_sqlite);

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

  return <MainLayout />;
}
