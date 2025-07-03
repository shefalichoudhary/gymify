import React, { useState, useEffect,useRef } from "react";
import { Box, Button } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import CustomHeader from "@/components/customHeader";
import { db } from "@/db/db";
import { exercises, Exercise } from "@/db/schema";
import ExerciseList from "@/components/addExercise/exerciseList";
import ExerciseSearchbar from "@/components/addExercise/exerciseSearchbar";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import ExerciseFilterDrawer from "@/components/addExercise/exerciseFilterDrawer";
import CustomButton from "@/components/customButton";

export default function AddExercise() {
  const router = useRouter();

  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [filteredList, setFilteredList] = useState<Exercise[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const fetchExercises = async () => {
    const data = await db.select().from(exercises).all();
    setExerciseList(data);
    setFilteredList(data);
  };

 const handleCreate = () => {
  router.push({
    pathname: "/createRoutine",
    params: { selected: JSON.stringify(selectedIds) },
  });
};

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (!query.trim()) return setFilteredList(exerciseList);
    const filtered = exerciseList.filter((e) =>
      e.exercise_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredList(filtered);
  }, [query, exerciseList]);

  return (
    <Box flex={1} bg="$black">
      <CustomHeader
        title="Add Exercise"
        left="Cancel"
        right="Create"
        onPress={() => router.back()}
        onRightButtonPress={handleCreate}
      />

      <ExerciseSearchbar query={query} setQuery={setQuery} />
 <ExerciseFilterDrawer/>
      <ExerciseList
        data={filteredList}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
      />
      {selectedIds.length > 0 && (
  <Box
    position="absolute"
    bottom={16}
    left={0}
    right={0}
    px="$4"
  >
    <CustomButton
      bg="$blue500"
      borderRadius="$lg"
      size="lg"
      onPress={handleCreate}
    >
      Add {selectedIds.length} Exercise{selectedIds.length > 1 ? "s" : ""}
    </CustomButton>
  </Box>
)}
    </Box>
  );
}
