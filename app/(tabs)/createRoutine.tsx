import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { useRouter } from "expo-router"; // Use router for navigation
import CustomButton from "@/components/customeButton";

export default function CreateRoutine() {
  const [routineTitle, setRoutineTitle] = useState("");
  const router = useRouter();

  return (
    <KeyboardAvoidingScrollView>
      <View className="flex-1 p-6">
        {/* Routine Title Input */}
        <Text className="text-2xl font-bold mb-4">Create Routine</Text>
        <TextInput
          placeholder="Enter Routine Title"
          value={routineTitle}
          onChangeText={setRoutineTitle}
          className="border border-gray-300 rounded-lg p-3 text-lg"
        />

        {/* Add Exercise Button */}
        <CustomButton
          onPress={() => router.push("/addExercise")}
          text="Add Exercise"
          icon="plus"
        />
      </View>
    </KeyboardAvoidingScrollView>
  );
}
