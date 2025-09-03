import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Button, HStack, Text, Pressable } from "@gluestack-ui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import CustomHeader from "@/components/customHeader";
import ExerciseList from "@/components/addExercise/exerciseList";
import ExerciseSearchbar from "@/components/addExercise/exerciseSearchbar";
import ExerciseFilterDrawer, { ExerciseFilterDrawerRef } from "@/components/addExercise/exerciseFilterDrawer";
import CustomButton from "@/components/customButton";

import { db } from "@/db/db";
import { exercises, Exercise, exerciseMuscles, muscles } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { MaterialIcons } from "@expo/vector-icons";

export default function AddExercise() {
  const router = useRouter();
const { from, routineId: rawId, routineTitle } = useLocalSearchParams();
const routineId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [filteredList, setFilteredList] = useState<Exercise[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>(null);
  const [muscleList, setMuscleList] = useState<{ id: string; name: string }[]>([]);

  const filterRef = useRef<ExerciseFilterDrawerRef>(null);

 const handleCreate = () => {
  if (from === "logWorkout") {
    router.push({
      pathname: "/logWorkout",
       params: {
        id: routineId,
        addedExerciseIds: JSON.stringify(selectedIds),
      },
    });
  } else if (from === "editRoutine") {
    router.push({
      pathname: "/routine/edit/[id]",
      params: {
        id: routineId,
        addedExerciseIds: JSON.stringify(selectedIds),
      },
    });
  } else {
    router.push({
      pathname: "/createRoutine",
      params: {
        selected: JSON.stringify(selectedIds),
      },
    });
  }
};



  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Initial load
  useEffect(() => {
    const fetchAllExercises = async () => {
      const data = await db.select().from(exercises).all();
      setExerciseList(data);
      setFilteredList(data);
    };
    fetchAllExercises();
  }, []);

  // Reset filters on screen focus
  useFocusEffect(
    useCallback(() => {
      setSelectedIds([]);
      setQuery("");
      setFilteredList(exerciseList);
    }, [exerciseList])
  );

  // Filter by search query
  useEffect(() => {
    if (!query.trim()) return setFilteredList(exerciseList);
    const filtered = exerciseList.filter((e) =>
      e.exercise_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredList(filtered);
  }, [query, exerciseList]);

  // Filter by equipment/muscle
  useEffect(() => {
    const fetchFilteredExercises = async () => {
      let matchingIds: string[] | undefined;

      if (selectedMuscleId) {
        const muscleLinks = await db
          .select()
          .from(exerciseMuscles)
          .where(inArray(exerciseMuscles.muscle_id, [selectedMuscleId]));
        matchingIds = muscleLinks.map((m) => m.exercise_id);
      }

      const filtered = await db.query.exercises.findMany({
        where: (ex, { eq, inArray, and }) =>
          and(
            selectedEquipment ? eq(ex.equipment, selectedEquipment) : undefined,
            matchingIds ? inArray(ex.id, matchingIds) : undefined
          ),
      });

      setExerciseList(filtered);
    };

    fetchFilteredExercises();
  }, [selectedEquipment, selectedMuscleId]);

  // Fetch available muscles for label lookup
  useEffect(() => {
    const fetchMuscles = async () => {
      const muscleLinks = await db.select().from(exerciseMuscles).all();
      const uniqueIds = [...new Set(muscleLinks.map((em) => em.muscle_id))];
      const musclesData = await db.select().from(muscles).where(inArray(muscles.id, uniqueIds));
      setMuscleList(musclesData);
    };
    fetchMuscles();
  }, []);

  return (
    <Box flex={1} bg="$black">
      <CustomHeader
        title="Add Exercise"
        left="Cancel"
        right="Create"
      onPress={() => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/home"); // or default landing
  }
}}
        onRightButtonPress={handleCreate}
      />

      <ExerciseSearchbar query={query} setQuery={setQuery} />

      <HStack space="xs" mb="$4" px="$4" alignItems="center">
  <Button
    onPress={() => filterRef.current?.open("equipment")}
    flex={1}
    bg={selectedEquipment ? "$blue500" : "#29282a"}
    borderRadius="$lg"
    px="$4"
  >
    <Text color="$white">
      {selectedEquipment ?? "All Equipment"}
    </Text>
  </Button>

  <Button
    onPress={() => filterRef.current?.open("muscle")}
    flex={1}
    bg={selectedMuscleId ? "$blue500" : "#29282a"}
    borderRadius="$lg"
    px="$4"
  >
    <Text color="$white">
      {selectedMuscleId
        ? muscleList.find((m) => m.id === selectedMuscleId)?.name ?? "Selected"
        : "All Muscles"}
    </Text>
  </Button>

  {(selectedEquipment || selectedMuscleId) && (
    <Pressable
      onPress={() => {
        setSelectedEquipment(null);
        setSelectedMuscleId(null);
      }}
      hitSlop={10}
    >
      <Box
       bg="$white"
    p={4} // adjust for size
    borderRadius={999} // full circle
    alignItems="center"
    justifyContent="center"
      >
        <MaterialIcons name="clear" size={14} color="black" />
      </Box>
    </Pressable>
  )}
</HStack>


      <ExerciseList
        data={filteredList}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
      />

      {selectedIds.length > 0 && (
        <Box position="absolute" bottom={16} left={0} right={0} px="$4">
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

      <ExerciseFilterDrawer
        ref={filterRef}
        selectedEquipment={selectedEquipment}
        selectedMuscle={selectedMuscleId}
        onSelectEquipment={setSelectedEquipment}
        onSelectMuscle={setSelectedMuscleId}
      />
    </Box>
  );
}