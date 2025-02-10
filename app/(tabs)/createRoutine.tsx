import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
export default function CreateRoutine() {
  const [routineTitle, setRoutineTitle] = useState("");

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
        <TouchableOpacity
          onPress={() => console.log("Add Exercise Pressed")}
          className="bg-blue-600 rounded-xl justify-center items-center p-4 w-full mt-4 flex-row space-x-3"
        >
          <FontAwesome6 name="plus" size={20} color="white" />
          <Text className="font-bold text-white tracking-wider">
            Add Exercise
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingScrollView>
  );
}
