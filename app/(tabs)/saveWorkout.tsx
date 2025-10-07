import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Text,
  ScrollView,
  Pressable,
  HStack,
  VStack,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/db/db";
import { workouts, routines } from "@/db/schema";
import { eq } from "drizzle-orm";
import CustomHeader from "@/components/customHeader";
import SaveWorkoutSheet, {
  SaveWorkoutSheetRef,
} from "@/components/workout/bottomSheet/saveWorkoutBottomSheet";
import { MaterialIcons } from "@expo/vector-icons";
import { updateRoutineInDb } from "@/components/routine/updateRoutine";

const SaveWorkoutScreen = () => {
  const router = useRouter();
  const { id, routineId, addedExerciseCount, addedSetsCount } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [workout, setWorkout] = useState<any>(null);
  const saveSheetRef = useRef<SaveWorkoutSheetRef>(null);

  // Fetch workout & routine title
  useEffect(() => {
    if (!id) return;
    const fetchWorkout = async () => {
      const data = await db
        .select()
        .from(workouts)
        .where(eq(workouts.id, String(id)));
      if (data.length > 0) {
        const workoutItem = data[0];
        setWorkout(workoutItem);
        if (workoutItem.title && isNaN(Date.parse(workoutItem.title))) {
          setTitle(workoutItem.title);
        } else if (routineId) {
          const routineData = await db
            .select()
            .from(routines)
            .where(eq(routines.id, String(routineId)));
          if (routineData.length > 0) setTitle(routineData[0].name);
        }
      }
    };
    fetchWorkout();
  }, [id, routineId]);

  // Parse counts
  const exerciseCount =
    typeof addedExerciseCount === "string"
      ? parseInt(addedExerciseCount, 10)
      : Array.isArray(addedExerciseCount)
        ? parseInt(addedExerciseCount[0], 10)
        : 0;

  const setsCount =
    typeof addedSetsCount === "string"
      ? parseInt(addedSetsCount, 10)
      : Array.isArray(addedSetsCount)
        ? parseInt(addedSetsCount[0], 10)
        : 0;

  // Show bottom sheet if exercises/sets added
  useEffect(() => {
    if (exerciseCount > 0 || setsCount > 0) {
      saveSheetRef.current?.open(
        title,
        exerciseCount + setsCount,
        () => router.replace("/home"),
        () => router.replace("/home")
      );
    }
  }, [exerciseCount, setsCount, title]);

  if (!workout)
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$black">
        <Text color="white">Loading workout...</Text>
      </Box>
    );

  return (
    <Box flex={1} bg="$black">
      <CustomHeader
        right="Save"
        onRightButtonPress={async () => {
          const workoutId = Array.isArray(id) ? id[0] : id;
          if (!workoutId) return;

          try {
            // 1️⃣ Update workout title in DB
            await db.update(workouts).set({ title }).where(eq(workouts.id, workoutId));

            // 2️⃣ Update local state so UI reflects change
            setWorkout((prev: any) => (prev ? { ...prev, title } : prev));

            // 3️⃣ Open save bottom sheet with updated title
            saveSheetRef.current?.open(
              title,
              (exerciseCount || 0) + (setsCount || 0),
              async () => {
                saveSheetRef.current?.close();
                router.replace("/home");
              },
              async () => {
                saveSheetRef.current?.close();
                router.replace("/home");
              }
            );
          } catch (err) {
            console.error("❌ Failed to save workout title:", err);
          }
        }}
      />

      <ScrollView px="$2" pt="$4">
        {/* Editable Routine Title */}
        <Box mb="$4">
          <HStack alignItems="center" borderBottomWidth={0} bg="$black">
            <Input flex={1} borderWidth={0} size="xl">
              <InputField
                placeholder="Routine title"
                value={title}
                onChangeText={setTitle}
                color="$white"
                placeholderTextColor="$coolGray400"
                fontWeight="$small"
                className="text-2xl px-2"
              />
            </Input>

            {title.length > 0 && (
              <Pressable ml="$2" onPress={() => setTitle("")}>
                <Box
                  bg="$white"
                  p={2} // adjust size
                  borderRadius={999} // full circle
                  alignItems="center"
                  justifyContent="center"
                >
                  <MaterialIcons name="clear" size={16} color="black" />
                </Box>
              </Pressable>
            )}
          </HStack>
        </Box>

        {/* Stats Row */}
        <VStack py="$5" space="xs" mb="$2" borderBottomWidth={0.2} borderColor="$coolGray400">
          <HStack px="$3" justifyContent="space-between">
            <Text color="$coolGray400" fontSize="$xs">
              Duration
            </Text>
            <Text color="$coolGray400" fontSize="$xs">
              Volume
            </Text>
            <Text color="$coolGray400" fontSize="$xs">
              Sets
            </Text>
          </HStack>
          <HStack px="$4" justifyContent="space-between">
            <Text color="$blue500" fontSize="$sm">
              {workout.duration < 60
                ? `${workout.duration} sec`
                : `${Math.floor(workout.duration / 60)} min ${workout.duration % 60 ? (workout.duration % 60) + " sec" : ""}`}
            </Text>
            <Text color="$white" fontSize="$sm" mr="$4">
              {workout.volume} kg
            </Text>
            <Text color="$white" fontSize="$sm">
              {workout.sets}
            </Text>
          </HStack>
        </VStack>

        {/* When */}
        <VStack mb="$4" px="$3" py="$1">
          <Text color="$coolGray400" fontSize="$sm">
            When
          </Text>
          <HStack>
            <Text color="$blue500" mr="$1" fontSize="$sm">
              {new Date(workout.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              ,
            </Text>
            <Text color="$blue500" fontSize="$sm">
              {new Date(workout.date).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
          </HStack>
        </VStack>

        <Box borderBottomWidth={1} borderColor="$coolGray700" mb="$4" />

        <Pressable mb="$4" py="$1.5" px="$3" onPress={() => console.log("Change visibility")}>
          <HStack justifyContent="space-between">
            <Text color="$white">Visibility</Text>
            <Text color="$coolGray400">Everyone</Text>
          </HStack>
        </Pressable>
        <Box borderBottomWidth={1} borderColor="$coolGray700" mb="$6" />

        <Pressable mb="$6" px="$3" onPress={() => console.log("Routine Settings")}>
          <Text color="$white">Routine Settings</Text>
        </Pressable>
        <Box borderBottomWidth={1} borderColor="$coolGray700" mb="$4" />

        <Pressable onPress={() => router.replace("/workout")}>
          <Text color="$red500" textAlign="center" fontWeight="$medium">
            Discard Workout
          </Text>
        </Pressable>
      </ScrollView>

      <SaveWorkoutSheet ref={saveSheetRef} />
    </Box>
  );
};

export default SaveWorkoutScreen;
