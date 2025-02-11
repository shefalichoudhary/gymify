import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Use router for navigation
import CustomButton from "@/components/customeButton";
export default function Workout() {
  const router = useRouter();

  return (
    <View className="flex-1 p-6">
      <Text className="text-2xl font-bold text-center mb-4">Routines</Text>

      <CustomButton
        onPress={() => router.push("/createRoutine")}
        text="New Routine"
        icon="clipboard-list"
        bgColor="bg-zinc-900"
      />
    </View>
  );
}
