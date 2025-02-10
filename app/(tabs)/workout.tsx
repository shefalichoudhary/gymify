import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Use router for navigation
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Workout() {
  const router = useRouter();

  return (
    <View className="flex-1 p-6">
      <Text className="text-2xl font-bold text-center mb-4">Routines</Text>

      <TouchableOpacity
        onPress={() => router.push("/createRoutine")}
        className="bg-zinc-900 rounded-xl justify-center items-center p-4 w-full mt-4 flex-row space-x-3"
      >
        <FontAwesome6 name="clipboard-list" size={24} color="white" />
        <Text className="font-bold text-white tracking-wider ml-4">
          New Routine
        </Text>
      </TouchableOpacity>
    </View>
  );
}
