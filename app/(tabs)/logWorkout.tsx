import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ScrollView,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";
import CustomButton from "@/components/customButton";
import ExerciseBlock from "@/components/routine/exerciseBlock";
import { workouts } from "@/db/schema"; // ✅ import workouts table
import { db } from "@/db/db";
import CustomHeader from "@/components/customHeader";
import { useLocalSearchParams } from "expo-router";

// inside the component

import { Alert } from "react-native";
type SetItem = {
  lbs: number;
  reps: number;
  minReps?: number;
  maxReps?: number;
  isRangeReps?: boolean;
  previousLbs?: number;
  previousReps?: number;
  previousMinReps?: number;
  previousMaxReps?: number;
    isCompleted?: boolean; 
};

type ExerciseEntry = {
  notes: string;
  restTimer: boolean;
  sets: SetItem[];
};
type ExerciseData = {
  [exerciseId: string]: ExerciseEntry;
};
export default function LogWorkoutScreen() {
const { routineId, routineTitle } = useLocalSearchParams();

  const router = useRouter();
  const [duration, setDuration] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const [exerciseData, setExerciseData] = useState<ExerciseData>({
  "1": {
    notes: "",
    restTimer: false,
    sets: [
      {
        lbs: 10,
        reps: 5,
        isRangeReps: false,
        previousLbs: 8,
        previousReps: 6,
      },
      {
        lbs: 12,
        reps: 5,
        isRangeReps: false,
        previousLbs: 10,
        previousReps: 5,
      },
    ],
  },
});


  const totalVolume = Object.values(exerciseData).reduce((total, ex) => {
    return (
      total +
      ex.sets.reduce((sum, s) => {
        const reps = s.reps ?? ((s.minReps || 0) + (s.maxReps || 0)) / 2;
        return sum + s.lbs * reps;
      }, 0)
    );
  }, 0);

 const totalSets = Object.values(exerciseData).reduce((total, ex) => {
  return (
    total +
    ex.sets.filter((s) => s.isCompleted).length
  );
}, 0);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive]);
  useEffect(() => {
  setIsWorkoutActive(true);
}, []);

  return (
    <Box flex={1} bg="$black">
        <CustomHeader
  title="Log Workout"
  left="Cancel"
  onPress={() => router.push("/home")}
    right="Finish"

 onRightButtonPress={async () => {
  const { volume, sets } = calculateWorkoutStats(exerciseData);

  if (sets === 0) {
    Alert.alert(
      "No Completed Sets",
      "Your workout has no set values. Please complete at least one set.",
      [{ text: "OK" }]
    );
    return;
  }

  try {
    const insertedWorkout = await db.insert(workouts).values({
      date: new Date().toISOString(),
      duration,
      volume,
      sets,
      routineId: routineId ? String(routineId) : undefined,
      title: routineTitle ? String(routineTitle) : "", // ✅ use routine title
    }).returning();

    const workoutId = insertedWorkout[0]?.id;

    setIsWorkoutActive(false);
  router.push({
      pathname: "/saveWorkout",
      params: {
        id: workoutId,
        routineId,
      },
    });
  } catch (error) {
    console.error("Error saving workout:", error);
    Alert.alert("Save Failed", "There was an error saving your workout.");
  }
}}
/>

        {/* Stats */}
        <VStack px="$3" py="$5" space="xs" mb="$2" borderBottomWidth={0.2} borderColor="$coolGray400">
          <HStack px="$3" justifyContent="space-between">
            <Text color="$coolGray400" fontSize="$xs">Duration</Text>
            <Text color="$coolGray400" fontSize="$xs">Volume</Text>
            <Text color="$coolGray400" fontSize="$xs">Sets</Text>
          </HStack>
          <HStack px="$6" justifyContent="space-between">
            <Text color="$blue500" fontSize="$sm">{duration}s</Text>
            <Text color="$white" fontSize="$sm" ml="$1">{Math.round(totalVolume)} kg</Text>
            <Text color="$white" fontSize="$sm">{totalSets}</Text>
          </HStack>
        </VStack>

        {/* Body */}
        <ScrollView px="$2" pt="$2">
          {Object.entries(exerciseData).map(([id, data]) => (
            <ExerciseBlock
              key={id}
exercise={{
  id,
  exercise_name: "Bench Press (Dumbbell)",
  exercise_type: "Weighted",
  equipment: "Dumbbell",
  type: "Push",
}}// Replace with real data
showCheckIcon={true}
              data={data}
              onChange={(newData) =>
                setExerciseData((prev) => ({ ...prev, [id]: newData }))
              }
              onOpenRepRange={() => {}}
              onHeaderPress={() => {}}
            />
          ))}

          {/* Actions */}
          <VStack space="md" >
            <Box  mt="$6">
              <HStack space="lg" alignItems="center">
                <CustomButton
                  onPress={() => router.push("./addExercise")}
                  bg="$blue500"
                  icon={<Entypo name="plus" size={24} color="white" />}
                  iconPosition="left"
                >
                  Add exercise
                </CustomButton>
              </HStack>
            </Box>

            <HStack space="md" mb="$4" px="$2">
              <Button
                flex={1}
                bg="#29282a"
                alignItems="center"
                justifyContent="center"
                size="md"
                borderRadius="$lg"
                px="$4"
                onPress={() => router.push("/createRoutine")}
              >
                <Text textAlign="center" color="$white" fontWeight="$medium">
                  Settings
                </Text>
              </Button>

              <Button
                flex={1}
                bg="#1F1F1F"
                size="md"
                borderRadius="$lg"
                justifyContent="center"
                alignItems="center"
                px="$4"
              >
                <Text color="$red">Discard Workout</Text>
              </Button>
            </HStack>
          </VStack>
        </ScrollView>
      </Box>
  );
}
const calculateWorkoutStats = (exerciseData: ExerciseData) => {
  let totalVolume = 0;
  let totalSets = 0;

  Object.values(exerciseData).forEach((ex) => {
    ex.sets.forEach((s:any) => {
      const reps = s.reps ?? ((s.minReps || 0) + (s.maxReps || 0)) / 2;
      totalVolume += s.lbs * reps;

      if (s.isCompleted) {
        totalSets += 1;
      }
    });
  });

  return {
    volume: Math.round(totalVolume),
    sets: totalSets,
  };
};
