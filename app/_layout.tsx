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
  Box,
} from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "@/context/authContext";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons,MaterialIcons ,FontAwesome6} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/authContext";
import { useSegments } from "expo-router"; 
import { usePathname } from "expo-router";
  import { ClerkProvider,ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
SplashScreen.preventAutoHideAsync();

const sidebarLinks = [
  { name: "Home", path: "/home" as const, icon: (props: any) => <Ionicons name="home-outline" {...props} /> },
  { name: "Workout", path: "/workout" as const, icon: (props: any) => <MaterialCommunityIcons name="dumbbell" {...props} /> },
  { name: "Profile", path: "/profile" as const, icon: (props: any) => <Ionicons name="person-outline" {...props} /> },
  { name: "Create Routine", path: "/createRoutine" as const, icon: (props: any) =>       <FontAwesome6 name="clipboard-list"   {...props} />
 },
];
 const AuthConsumer = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <VStack pt="$4" borderTopWidth={1} borderColor="$gray700">
      <HStack alignItems="center" justifyContent="space-between">
        <HStack alignItems="center">
          <Box
            w={40}
            h={40}
            borderRadius={20}
            bg="$black"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="$white" fontWeight="$bold">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </Text>
          </Box>
          <VStack ml="$2">
            <Text color="$white" fontWeight="$bold" fontSize="$sm">
              {user?.username || "Unknown User"}
            </Text>
           
          </VStack>
        </HStack>

        {/* Login/Logout button */}
        {user ? (
          <Pressable onPress={logout}>
            <MaterialIcons name="logout" size={26} color="white" />
          </Pressable>
        ) : (
          <Pressable onPress={() => router.push("/signIn")}>
            <MaterialCommunityIcons name="login" size={26} color="white" />
          </Pressable>
        )}
      </HStack>
    </VStack>
  );
};
const MainLayout = () => {
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 768;
  const router = useRouter();
    const segments = useSegments();
 const pathname = usePathname();
  const segs = segments as string[];
const hideSidebar =
  segs.length === 0 || // index
  segs[0] === "(auth)" ||
  segs[0] === "signIn" ||
  segs[0] === "signUp" ||

  segs[0] === "forgotPassword";
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
            <ClerkProvider  publishableKey={publishableKey}tokenCache={tokenCache}>
<ClerkLoaded>
<AuthProvider>


          <BottomSheetModalProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#1F1F1F" }}  edges={["bottom", "left", "right"]}>
              <HStack flex={1}>
                {/* Sidebar for large screens */}
                {isLargeScreen && !hideSidebar && (
  <VStack
      w={280} // fixed width in px, won't shrink/stretch
      h="$full"
      bg="#1F1F1F"
      py="$4"
      px="$2"
      borderRightWidth={1}
      borderColor="$coolgray"
      justifyContent="space-between"
      mr="$2"
    >
    {/* --- Header Section --- */}
    <VStack space="md" mb="$4">
      <Pressable onPress={() => router.navigate("/")}>
        <Text
          color="$white"
          fontWeight="$bold"
          fontSize="$xl"
          letterSpacing={2}
          px="$1.5"
        >
          GYMIFY
        </Text>
      </Pressable>
      <Box borderBottomWidth={1} borderColor="gray" />
    </VStack>

    {/* --- Navigation Links --- */}
    <VStack space="xs" flex={1} 
    >
      {sidebarLinks.map((link, idx) => {
        const Icon = link.icon;
       const isActive = pathname === link.path;

        return (
          <Pressable
            key={idx}
            onPress={() => router.push(link.path)}
            borderRadius="$lg"
            p="$3"
            flexDirection="row"
            alignItems="center"
            mb="$1"
            bg={isActive ? "$gray800" : "transparent"}
            $hover-bg="$black"

            
          >
            <Icon
              size={20}
              color={isActive ? "#3b82f6" : "white"} // active blue, otherwise white
            />
            <Text
       
          letterSpacing={0.4}

              color={isActive ? "#3b82f6" : "$white"}
              fontSize="$md"
              ml="$3"

            >
              {link.name}
            </Text>
          </Pressable>
        );
      })}
    </VStack>

    {/* --- User Section --- */}

        <AuthConsumer />
     
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

        </ClerkLoaded>
            </ClerkProvider>

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
