import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CustomHeader from "@/components/customheader";
import { useRouter } from "expo-router";

export default function AddExercise() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample list of exercises
  const exercises = [
    { id: "1", name: "Push-up" },
    { id: "2", name: "Squat" },
    { id: "3", name: "Deadlift" },
    { id: "4", name: "Bench Press" },
    { id: "5", name: "Pull-up" },
  ];

  // Filter exercises based on search query
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Search Bar */}
      <View className="p-4">
        <TextInput
          className="w-full p-3 bg-white rounded-md shadow-md"
          placeholder="Search exercises..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="p-4 border-b border-gray-300 bg-white">
            <Text className="text-lg font-semibold">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
