import { useState, useEffect } from "react";
import {
  View,
  TextInput,

} from "react-native";
import { useRouter } from "expo-router";



export default function AddExercise() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [exerciseList, setExerciseList] = useState([]);

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
    </View>
  );
}
