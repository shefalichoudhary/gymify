import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  Pressable,
  ScrollView,
 
} from "@gluestack-ui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/db/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import CustomHeader from "@/components/customHeader";
import { routines } from "@/db/schema"; // ✅ import routines
import CustomDialog from "../../components/logWorkoutDialog";

type Workout = {
  id: string;
  title?: string;
  date: string;
  duration: number;
  volume: number;
  sets: number;
  notes?: string | null;
};

const SaveWorkoutScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [workout, setWorkout] = useState<Workout | null>(null);
  const { id, routineId ,addedExerciseCount} = useLocalSearchParams();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    message: "",
    confirmText: "Yes",
    cancelText: "No",
    destructive: false,
    onConfirm: () => {},
    onCancel: () => setDialogVisible(false),
  });

useEffect(() => {
  if (!id) return;

  const fetchWorkout = async () => {
    try {
      const data = await db
        .select()
        .from(workouts)
        .where(eq(workouts.id, String(id)));

      if (data.length > 0) {
        const workoutItem = data[0];
        setWorkout(workoutItem);

        // If title is already saved, use it; else fallback to routine title
      if (workoutItem.title && isNaN(Date.parse(workoutItem.title))) {
  setTitle(workoutItem.title);
} else if (routineId) {
  const routineData = await db
    .select()
    .from(routines)
    .where(eq(routines.id, String(routineId)));

  if (routineData.length > 0) {
    setTitle(routineData[0].name);
  }
}}
    } catch (error) {
      console.error("Error fetching workout/routine:", error);
    }
  };

  fetchWorkout();
}, [id, routineId]);



const count =
  typeof addedExerciseCount === "string"
    ? parseInt(addedExerciseCount, 10)
    : Array.isArray(addedExerciseCount)
    ? parseInt(addedExerciseCount[0], 10)
    : 0;

useEffect(() => {
  if (count > 0) {
    setDialogProps({
      message: `You added ${count} new exercise${count > 1 ? "s" : ""}.\nDo you want to update the routine or keep the original?`,
      confirmText: "Update Routine",
      cancelText: "Keep Original Routine",
      destructive: false,
      onConfirm: async () => {
        setDialogVisible(false);
        router.replace("/home");
      },
      onCancel: () => {
        setDialogVisible(false);
        router.replace("/home");
      },
    });
    setDialogVisible(true);
  }
}, [count]); // ✅ depend on count instead of addedExerciseCount

if (!workout) {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" bg="$black">
      <Text color="white">Loading workout...</Text>
    </Box>
  );
}


  return (
    <Box flex={1} bg="$black">
      <CustomHeader
        title="Save Workout"
        left="Cancel"
        onPress={() => router.replace("/home")}
        right="Save"
      onRightButtonPress={async () => {
  setDialogProps({
    message: "Do you want to add new exercises to this routine?",
    confirmText: "Yes",
    cancelText: "No",
    destructive: false,
    onConfirm: async () => {
      // Save logic here
      await db
        .update(workouts)
        .set({ title })
        .where(eq(workouts.id, String(id)));
      setDialogVisible(false);
      router.replace("/home");
    },
    onCancel: () => setDialogVisible(false),
  });
  setDialogVisible(true);
}}
      />


      <ScrollView px="$4" pt="$4">
  {/* Routine Title Heading */}
  {title ? (
    <Text color="$white" fontSize="$2xl" fontWeight="$bold" mb="$2">
      {title}
    </Text>
  ) : null}

  {/* Stats Row */}
    <VStack  py="$5" space="xs" mb="$2" borderBottomWidth={0.2} borderColor="$coolGray400">
            <HStack px="$3" justifyContent="space-between">
              <Text color="$coolGray400" fontSize="$xs" >Duration</Text>
              <Text color="$coolGray400" fontSize="$xs">Volume</Text>
              <Text color="$coolGray400" fontSize="$xs">Sets</Text>
            </HStack>
            <HStack px="$5" justifyContent="space-between">
<Text color="$blue500" fontSize="$sm">
  {workout.duration < 60
    ? `${workout.duration} sec`
    : `${Math.floor(workout.duration / 60)} min ${workout.duration % 60 || ""}${workout.duration % 60 ? " sec" : ""}`}
</Text>
              <Text color="$white" fontSize="$sm" >{workout.volume} kg</Text>
              <Text color="$white" fontSize="$sm">{workout.sets}</Text>
            </HStack>
          </VStack>
  

  {/* When */}
  <VStack mb="$4" px="$3" py="$1">
  <Text color="$coolGray400"  fontSize={"$sm"}>When</Text>
  <HStack>
    <Text color="$blue500" mr="$1" fontSize={"$sm"}>
      {new Date(workout.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} ,
    </Text>
    <Text color="$blue500" fontSize={"$sm"}>
      {new Date(workout.date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}
    </Text>
  </HStack>
</VStack>


  <Box borderBottomWidth={1} borderColor="$coolGray700" mb="$4"  ></Box>

  <Pressable mb="$4" py="$1.5" px="$3"  onPress={() => console.log("Change visibility")}>
    <HStack justifyContent="space-between">
      <Text color="$white">Visibility</Text>
      <Text color="$coolGray400">Everyone</Text>
    </HStack>
  </Pressable>
  <Box borderBottomWidth={1} borderColor="$coolGray700" mb="$6" />


  <Pressable mb="$6"px="$3"  onPress={() => console.log("Routine Settings")}>
    <Text color="$white">Routine Settings</Text>
  </Pressable>
  <Box borderBottomWidth={1} borderColor="$coolGray700" mb="$4"  ></Box>

  <Pressable onPress={() => router.replace("/workout")}>
    <Text color="$red500" textAlign="center" fontWeight="$medium">
      Discard Workout
    </Text>
  </Pressable>
</ScrollView>
<CustomDialog {...dialogProps} visible={dialogVisible} />
    </Box>
  );
};

export default SaveWorkoutScreen;
