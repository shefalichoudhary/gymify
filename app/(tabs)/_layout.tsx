import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CustomHeader from "@/components/customHeader";
import { Pressable, Text, Box, HStack } from "@gluestack-ui/themed";
// import { useAuth } from "@/context/AuthContext"; // ✅ make sure you have this

export default function Layout() {
  const router = useRouter();
  // const { isLoggedIn, logout } = useAuth(); // ✅ inside component

  return (
    <Box flex={1} bg="#29282a">
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
                      <HStack space="md">
                        <Pressable onPress={() => router.push("/signIn")}>
                            <Text color="$white"  letterSpacing={0.5} fontWeight="$medium">
                              Login
                            </Text>
                          </Pressable>
                        {/* {isLoggedIn ? (
                          <Pressable onPress={logout}>
                            <Text color="$blue500" fontWeight="$bold">
                              Logout
                            </Text>
                          </Pressable>
                        ) : (
                          <Pressable onPress={() => router.push("/signIn")}>
                            <Text color="$blue500" fontWeight="$bold">
                              Login
                            </Text>
                          </Pressable>
                        )} */}
                      </HStack>
                    }
                  />
                );
              }

              return (
                <CustomHeader
                  left={
                    <Pressable onPress={() => router.back()}>
                      <AntDesign name="arrowleft" size={24} color="white" />
                    </Pressable>
                  }
                  title={route.name.charAt(0).toUpperCase() + route.name.slice(1)}
                  right={
                    <Pressable onPress={() => router.back()}>
                      <AntDesign name="reload1" size={24} color="white" />
                    </Pressable>
                  }
                />
              );
            },

            tabBarStyle: showTabBar
              ? { backgroundColor: "#29282a" }
              : { display: "none" },

            tabBarLabelStyle: {
              fontSize: 10,
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
      </Tabs>
    </Box>
  );
}
