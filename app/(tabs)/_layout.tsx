import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HomeHeader from "@/components/homeHeader";
import CustomKeyboard from "@/components/customKeyboard";
import CustomHeader from "@/components/customheader"; // Import Custom Header
import SaveRoutineButton from "@/components/saveRoutineButton";

export default function _layout() {
  const router = useRouter(); // Get router instance

  return (
    <Tabs>
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={26} />
          ),
          header: () => <HomeHeader />,
        }}
      />

      {/* Workout Tab */}
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color }) => (
            <Ionicons name="barbell" size={26} color={color} />
          ),
        }}
      />

      {/* Create Routine Tab */}
      <Tabs.Screen
        name="createRoutine"
        options={{
          href: null, // Hide from bottom tabs
          header: () => (
            <CustomHeader
              title="Create Routine"
              leftLabel="Cancel"
              rightLabel="Save"
              onRightPress={() => <SaveRoutineButton />} // Navigate on save
            />
          ),
        }}
      />

      {/* Add Exercise Tab */}
      <Tabs.Screen
        name="addExercise"
        options={{
          href: null, // Hide from bottom tabs
          header: () => (
            <CustomHeader
              title="Add Exercise"
              leftLabel="Cancel"
              rightLabel="Create"
              onRightPress={() => router.push("/createRoutine")} // Navigate on create
            />
          ),
        }}
      />
    </Tabs>
  );
}
