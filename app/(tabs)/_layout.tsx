import HomeHeader from "@/components/homeHeader";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{ header: () => <HomeHeader /> }}
      ></Stack.Screen>
    </Stack>
  );
}
