import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CustomHeader from "@/components/customHeader";
import { Pressable, Text, Box, HStack } from "@gluestack-ui/themed";
import { useAuth } from "@/context/authContext";

import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
export default function Layout() {
  const router = useRouter();
    const [reloadKey, setReloadKey] = useState(0);
const { user, logout } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1F1F1F" }} edges={["bottom", "left", "right"]}>
      <Box flex={1} bg="#1F1F1F">
        <Tabs
          screenOptions={({ route }) => {
            const showTabBar = ["home", "workout", "profile"].includes(route.name);

            return {
              header: () => {
                if (route.name === "home") {
                  return (
                    <CustomHeader
                      isHome
                      left={
                        <Pressable onPress={() => router.replace("/")}>
                          <Text
                            color="$white"
                            fontWeight="$xl"
                            fontSize="$lg"
                            $md-fontWeight="$bold"
                            letterSpacing={3}
                          >
                            GYMIFY
                          </Text>
                        </Pressable>
                      }
                       right={
          user ? (
            <Pressable onPress={logout}>
              <Text color="$white" letterSpacing={0.5} fontWeight="$medium">
                Logout
              </Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => router.push("/signIn")}>
              <Text color="$white" letterSpacing={0.5} fontWeight="$medium">
                Login
              </Text>
            </Pressable>
          )
        }
      />
    );
                }

                return (
                  <CustomHeader
                    left={
                      <Pressable onPress={() => router.push("/home")}>
                        <AntDesign name="arrowleft" size={24} color="white" />
                      </Pressable>
                    }
                    title={route.name.charAt(0).toUpperCase() + route.name.slice(1)}
                    right={
                     <Pressable onPress={() => setReloadKey(prev => prev + 1)}>
  <AntDesign name="reload1" size={24} color="white" />
</Pressable>
                    }
                  />
                );
              },

          tabBarStyle: showTabBar
  ? route.name === "home"
    ? {
        backgroundColor: "#1F1F1F",
        borderTopWidth: 0.2,
        borderTopColor: "#1F1F1F", // customize this color as needed
        paddingBottom: 1,
        height: 60,
      }
    : {
        backgroundColor: "#1F1F1F",
        borderTopWidth: 0,
        paddingBottom: 10,
        height: 60,
      }
  : { display: "none" },


              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "600",
              },

              tabBarIcon: ({ color }) => {
                if (route.name === "home")
                  return <AntDesign name="home" size={22} color={color} />;
                if (route.name === "workout")
                  return <FontAwesome6 name="dumbbell" size={22} color={color} />;
                if (route.name === "profile")
                  return <AntDesign name="user" size={22} color={color} />;
                return null;
              },

              tabBarActiveTintColor: "#3b82f8",
              tabBarInactiveTintColor: "gray",
            };
          }}
        >
          {/* your tab screens here */}
  <Tabs.Screen
    name="home"
    options={{ title: "Home" }}
  />
  <Tabs.Screen
    name="workout"
    options={{ title: "Workout" }}
  />
  <Tabs.Screen
    name="profile"
    options={{ title: "Profile" }}
  />
          <Tabs.Screen
          name="createRoutine"
          options={{ title: "CreateRoutine", href: null, headerShown: false }}
        />
        <Tabs.Screen
          name="addExercise"
          options={{ title: "AddExercise", href: null, headerShown: false }}
        />
         <Tabs.Screen
          name="logWorkout"
          options={{ title: "LogWorkout", href: null, headerShown: false }}
        />
        <Tabs.Screen
  name="routine/[id]"
  options={{
    headerShown: false,
    tabBarStyle: { display: "none" },
    href: null, // 👈 this makes sure it's not listed in tabs
  }}
/>
   <Tabs.Screen
  name="routine/edit/[id]"
  options={{
    headerShown: false,
    tabBarStyle: { display: "none" },
    href: null, // 👈 this makes sure it's not listed in tabs
  }}></Tabs.Screen>
   <Tabs.Screen
          name="saveWorkout"
          options={{ title: "SaveWorkout", href: null, headerShown: false }}
        />
       
        </Tabs>
      </Box>
    </SafeAreaView>
  );
}
