import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HomeHeader from "@/components/homeHeader";
import CustomKeyboard from "@/components/customKeyboard";

export default function _layout() {
  return (
    <CustomKeyboard>
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
        <Tabs.Screen
          name="createRoutine"
          options={{ href: null, header: () => <HomeHeader /> }}
        />
      </Tabs>
    </CustomKeyboard>
  );
}
