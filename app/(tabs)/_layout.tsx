import HomeHeader from "@/components/homeHeader";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "@/components/customheader";
import { useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter(); 

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          header: () => <HomeHeader />, 
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" size={size} color={color} /> 
          ),
        }}
      />

      <Tabs.Screen
        name="createRoutine"
        options={{
          href: null,
          header: () => (
            <CustomHeader
              title="Create Routine"
              leftLabel="Cancel"
              rightLabel="Save"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="addExercise"
        options={{
          href: null, 
          header: () => {
            return (
              <CustomHeader
                title="Add Exercise"
                leftLabel="Cancel"
                rightLabel="Create"
                onRightPress={() => router.push("/home")} 
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
