import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CustomHeader from "@/components/customHeader";
import {
  Pressable,
  Text,
  Box,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@gluestack-ui/themed";
import { useAuth } from "@/context/authContext";
import { useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function Layout() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  useEffect(() => {
    router.prefetch("/logWorkout");
    router.prefetch("/workout");
    router.prefetch("/home");
  }, []);
  return (
    <Box flex={1}>
      <Tabs
        screenOptions={({ route }) => {
          const showTabBar = ["home", "workout", "profile"].includes(route.name);
          if (isLargeScreen) {
            return {
              headerShown: false,
              tabBarStyle: { display: "none" },
            };
          }

          return {
            contentStyle: { backgroundColor: "#1F1F1F" },
            lazy: true, // preload all tabs for smoother navigation
            header: () => {
              if (route.name === "home") {
                return (
                  <CustomHeader
                    isHome
                    homeLeft={
                      <Pressable onPress={() => router.navigate("/")}>
                        <Text
                          color="$white"
                          fontWeight="$xl"
                          fontSize="$lg"
                          $md-fontWeight="$medium"
                          letterSpacing={3}
                        >
                          GYMIFY
                        </Text>
                      </Pressable>
                    }
                    right={
                      user ? (
                        <HStack alignItems="center" space="md">
                          <Text
                            color="$white"
                            fontWeight="$medium"
                            fontSize="$md"
                            letterSpacing={1}
                            lineHeight={18}
                          >
                            Hello
                          </Text>
                          <Pressable onPress={() => router.navigate("/profile")}>
                            <LinearGradient
                              colors={["#4facfe", "#00f2fe"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={{
                                borderRadius: 9999,
                                padding: 1,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Avatar bgColor="$black" size="sm" borderWidth={0}>
                                {user.photo ? (
                                  <AvatarImage source={{ uri: user.photo }} alt={user.username} />
                                ) : (
                                  <AvatarFallbackText size="md">
                                    {user.username?.slice(0, 2).toUpperCase()}
                                  </AvatarFallbackText>
                                )}
                              </Avatar>
                            </LinearGradient>
                          </Pressable>
                        </HStack>
                      ) : null
                    }
                  />
                );
              }

              return (
                <CustomHeader title={route.name.charAt(0).toUpperCase() + route.name.slice(1)} />
              );
            },

            tabBarStyle: showTabBar
              ? {
                  backgroundColor: "#1F1F1F",
                  paddingBottom: 8,
                  marginBottom: 3,
                  height: 54,
                  elevation: 0,
                  borderTopWidth: 0,
                  shadowOpacity: 0,
                  shadowOffset: { width: 0, height: 0 },
                }
              : { display: "none" },

            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
            },

            tabBarIcon: ({ color }) => {
              if (route.name === "home") return <AntDesign name="home" size={22} color={color} />;
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
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="workout" options={{ title: "Workout" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />

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
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="saveWorkout"
          options={{ title: "SaveWorkout", href: null, headerShown: false }}
        />
        <Tabs.Screen name="editProfile" options={{ title: "EditProfile", href: null }} />
      </Tabs>
    </Box>
  );
}
