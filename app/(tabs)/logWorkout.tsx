import React, { useEffect, useState, useMemo, useRef, } from "react";
import {
  Box, VStack, HStack, Text, Button, ScrollView,
} from "@gluestack-ui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import CustomHeader from "@/components/customHeader";
import CustomButton from "@/components/customButton";
import ExerciseBlock from "@/components/routine/exerciseBlock";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert } from "react-native";
import { db } from "@/db/db";
import { workouts, exercises, routineExercises } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import RestTimerSheet, { RestTimerSheetRef } from "@/components/routine/bottomSheet/timer";
import WeightSheet ,{WeightSheetRef}from "@/components/routine/bottomSheet/weight";
import RepsTypeSheet,{RepsTypeSheetRef} from "@/components/routine/bottomSheet/repsType";
import * as Haptics from "expo-haptics";
import RestCountdownTimer from "@/components/routine/restCountdownTimer";

type SetItem = {
  weight: number;
  reps: number;
  minReps?: number;
  maxReps?: number;
  isRangeReps?: boolean;
  isCompleted?: boolean;
};
type ExerciseEntry = {
  notes: string;
  restTimer: boolean;
  sets: SetItem[];
  unit: "lbs" | "kg";
  repsType: "reps" | "rep range";
  restTimeInSeconds?: number;
};

type ExerciseData = {
  [exerciseId: string]: ExerciseEntry;
    
};
type ExerciseDetail = {
  id: string;
  name: string;
  equipment?: string;
  type?: string;
};

export default function LogWorkoutScreen() {
  const router = useRouter();
const { routineId, routineTitle, addedExerciseIds } = useLocalSearchParams();

const [loading, setLoading] = useState(true);

  const [duration, setDuration] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [exerciseData, setExerciseData] = useState<ExerciseData>({});
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
const [activeRestTimer, setActiveRestTimer] = useState<number | null>(null);
const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetail[]>([]);
const restSheetRef = useRef<RestTimerSheetRef>(null);
const weightSheetRef = useRef<WeightSheetRef>(null);
const repsSheetRef = useRef<RepsTypeSheetRef>(null);
const [loadedExerciseIds, setLoadedExerciseIds] = useState<string[]>([]);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
const { volume: totalVolume, sets: totalSets } = calculateWorkoutStats(exerciseData);
const [restCountdowns, setRestCountdowns] = useState<{ [key: string]: number }>({});



useEffect(() => {
  const interval = setInterval(() => {
    setRestCountdowns((prev) => {
      const updated = { ...prev };

      Object.entries(updated).forEach(([key, timeLeft]) => {
        if (timeLeft > 1) {
          updated[key] = timeLeft - 1;
        } else {
          // timeLeft === 1 or 0, complete
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          delete updated[key];
        }
      });

      return updated;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);


 const handleToggleSetComplete = (
  exerciseId: string,
  setIndex: number,
  justCompleted: boolean
) => {
  setExerciseData((prev) => {
    const updated = { ...prev };
    const sets = updated[exerciseId]?.sets ?? [];

    if (sets[setIndex]) {
      sets[setIndex].isCompleted = justCompleted;

      console.log(`[${new Date().toISOString()}] ✅ Toggled Set - Exercise: ${exerciseId}, Set: ${setIndex}, Completed: ${justCompleted}`);

      const key = `${exerciseId}-${setIndex}`;

      if (justCompleted && updated[exerciseId].restTimer) {
        const restTime = updated[exerciseId].restTimeInSeconds ?? 0;
        setRestCountdowns((prev) => ({
          ...prev,
          [key]: restTime,
        }));
      } else if (!justCompleted) {
        setRestCountdowns((prev) => {
          const updatedCountdowns = { ...prev };
          delete updatedCountdowns[key];
          return updatedCountdowns;
        });
      }
    }

    return updated;
  });

  if (!isWorkoutStarted) {
    setIsWorkoutStarted(true);
  }
};


  // Start time
  useEffect(() => {

  const interval = setInterval(() => {
    setDuration((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);

   
  // Load existing routine data
 useFocusEffect(
  React.useCallback(() => {
    const loadRoutineData = async () => {
  if (!routineId) return;
  setLoading(true);

  try {
    const routineEx = await db
      .select()
      .from(routineExercises)
      .where(eq(routineExercises.routineId, String(routineId)))
      .all();

    const exerciseIds = routineEx.map((re) => String(re.exerciseId));

    // Set placeholders immediately to show UI
    const placeholders: ExerciseData = {};
    exerciseIds.forEach((id) => {
      placeholders[id] = {
       notes: "",
  restTimer: false,
  unit: "kg",
  repsType: "reps",
  sets: [],// Will be filled later
      };
    });

    setExerciseData(placeholders);
    setExerciseDetails(exerciseIds.map((id) => ({ id, name: "Loading...", type: "", equipment: "" })));

    // Fetch details and sets in parallel
    const [routineSetRows, details] = await Promise.all([
      db.query.routineSets.findMany({
        where: (rs, { inArray }) => inArray(rs.exerciseId, exerciseIds),
      }),
      db
        .select({
          id: exercises.id,
          name: exercises.exercise_name,
          equipment: exercises.equipment,
          type: exercises.type,
        })
        .from(exercises)
        .where(inArray(exercises.id, exerciseIds))
        .all(),
    ]);

    // Now update state with real data
    const grouped: ExerciseData = { ...placeholders };

    for (const exerciseId of exerciseIds) {
      const setsForExercise = routineSetRows.filter(
        (set) => String(set.exerciseId) === exerciseId
      );

      grouped[exerciseId] = {
  notes: "",
  restTimer: false,
  unit: "kg",
  repsType: "reps",
  sets: setsForExercise.map((s: any) => ({
    weight: s.weight ?? 0,
    reps: s.reps ?? 0,
    minReps: s.minReps,
    maxReps: s.maxReps,
    isRangeReps: s.isRangeReps ?? false,
    isCompleted: false,
  })),
};
    }
    setExerciseData(grouped);
    setExerciseDetails(details);
    setLoadedExerciseIds(exerciseIds);
  } catch (err) {
    console.error("❌ Error loading routine:", err);
  } finally {
    setLoading(false);
  }
};


    loadRoutineData();
  }, [routineId])
);
useEffect(() => {
  const fetchNewExercises = async () => {
    if (!addedExerciseIds) return;

   let newIds: string[] = [];

try {
  newIds = Array.isArray(addedExerciseIds)
    ? addedExerciseIds
    : JSON.parse(addedExerciseIds);
} catch (err) {
  console.warn("❌ Failed to parse addedExerciseIds", err);
  newIds = [];
}

    const newUniqueIds = newIds.filter((id: string) => !loadedExerciseIds.includes(id));

    if (newUniqueIds.length === 0) return;

    try {
      // Fetch full exercise details
      const details = await db
        .select({
          id: exercises.id,
          name: exercises.exercise_name,
          equipment: exercises.equipment,
          type: exercises.type,
        })
        .from(exercises)
        .where(inArray(exercises.id, newUniqueIds))
        .all();

      // Default ExerciseData values
      const newData: ExerciseData = {};
      for (const id of newUniqueIds) {
        newData[id] = {
          notes: "",
          restTimer: false,
          unit: "kg",
          repsType: "reps",
          sets: [],
        };
      }

      setExerciseData((prev) => ({ ...prev, ...newData }));
      setExerciseDetails((prev) => [...prev, ...details]);
      setLoadedExerciseIds((prev) => [...prev, ...newUniqueIds]);
    } catch (err) {
      console.error("❌ Error loading added exercises", err);
    }
  };

  fetchNewExercises();
}, [addedExerciseIds]);



  const handleFinish = async () => {
    const { volume, sets } = calculateWorkoutStats(exerciseData);
    if (sets === 0) {
      return Alert.alert("No Completed Sets", "Please complete at least one set.");
    }

    try {
      const [workout] = await db.insert(workouts).values({
        date: new Date().toISOString(),
        duration,
        volume,
        sets,
        routineId: String(routineId),
        title: String(routineTitle),
      }).returning();

      setIsWorkoutActive(false);
      router.push({
        pathname: "/saveWorkout",
        params: { id: workout.id, routineId },
      });
    } catch (err) {
      Alert.alert("Save Failed", "Could not save workout.");
    }
  };

const discardRoutineAndReset = () => {
  setExerciseData({});
  setExerciseDetails([]);
    setDuration(0);
     setIsWorkoutStarted(false);
  router.replace("/workout"); // use `replace` to clear this screen from the stack
};


const confirmDiscard = () => {
  Alert.alert(
    "Discard Workout?",
    "This will delete your current progress. Are you sure?",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: discardRoutineAndReset },
    ]
  );
};


const openRestTimer = (exerciseId: string) => {
  setActiveExerciseId(exerciseId);
  restSheetRef.current?.open();
};
const handleRestDurationSelect = (duration: number) => {
  if (!activeExerciseId) return;

  setExerciseData((prev:any) => {
    const updated = { ...prev };
    const exercise = updated[activeExerciseId];

    if (exercise) {
      exercise.restTimer = true;
      exercise.restTimeInSeconds = duration;
    }

    return updated;
  });
  
};
const handleWeightSelect = (unit: string) => {
  if (!activeExerciseId) return;
  setExerciseData((prev:any) => ({
    ...prev,
    [activeExerciseId]: {
      ...prev[activeExerciseId],
      unit,
    },
  }));
};
const handleRepsTypeSelect = (type: "reps" | "rep range") => {
  if (!activeExerciseId) return;
  setExerciseData((prev: any) => ({
    ...prev,
    [activeExerciseId]: {
      ...prev[activeExerciseId],
      repsType: type,
    },
  }));
};

useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      confirmDiscard(); // Show your custom discard alert
      return true; // Block default behavior
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => subscription.remove(); // ✅ correct way to clean up
  }, [])
);
  return (
    <Box flex={1} bg="$black">
      <CustomHeader
        title="Log Workout"
        left="Cancel"
        onPress={confirmDiscard} 
      
        right="Finish"
        onRightButtonPress={handleFinish}
      />

      {/* Stats */}
      <VStack px="$3" py="$5" space="xs" mb="$2" borderBottomWidth={0.2} borderColor="$coolGray400">
        <HStack px="$3" justifyContent="space-between">
          <Text color="$coolGray400" fontSize="$xs">Duration</Text>
          <Text color="$coolGray400" fontSize="$xs">Volume</Text>
          <Text color="$coolGray400" fontSize="$xs">Sets</Text>
        </HStack>
        <HStack px="$6" justifyContent="space-between">
          <Text color="$blue500">{duration}s</Text>
          <Text color="$white">{Math.round(totalVolume)} kg</Text>
          <Text color="$white">{totalSets}</Text>
        </HStack>
      </VStack>

      {/* Body */}
      <ScrollView px="$2" pt="$2">
       {exerciseDetails.map((ex) => {
  const id = String(ex.id);
  const data = exerciseData[id];
  if (!data) return null;

  return (
    <Box key={id} pb="$6">
      <ExerciseBlock
        exercise={{
          id,
          exercise_name: ex.name || "Unknown",
          equipment: ex.equipment ?? "unknown",
          type: ex.type ?? "",
          exercise_type: "Weighted",
        }}
        data={data}
        showCheckIcon={true}
       onChange={(newData) =>
  setExerciseData((prev) => ({
    ...prev,
    [id]: newData as ExerciseEntry,
  }))
}
      onOpenRepsType={(exerciseId) => {
  setActiveExerciseId(exerciseId);
  repsSheetRef.current?.open();
}}
                 onOpenWeight={(exerciseId) => {
  setActiveExerciseId(exerciseId);
  weightSheetRef.current?.open();
  
}}

    onOpenRestTimer={(exerciseId) => openRestTimer(exerciseId)}
  onOpenRepRange={() => handleRepsTypeSelect("rep range")}
   onToggleSetComplete={(exerciseId: string, setIndex: number, justCompleted: boolean) => handleToggleSetComplete(exerciseId, setIndex, justCompleted)} 

      />
    
    </Box>
  );
})}

         {/* Add & Actions */}
        <VStack space="lg">
          <Box >
            <HStack space="lg" alignItems="center">
              <CustomButton
                onPress={() =>
                  router.push({
                    pathname: "/addExercise",
                    params: { from: "logWorkout", routineId },
                  })
                }
                bg="$blue500"
                icon={<Entypo name="plus" size={24} color="white" />}
                iconPosition="left"
              >
                Add Exercise
              </CustomButton>
            </HStack>
          </Box>

          <HStack space="lg" mb="$4" px="$1">
            {/* New Routine Button */}
            <Button
              flex={1}
                 bg="#1F1F1F"
          
              size="md"
              borderRadius="$lg" // adds sufficient rounding
              justifyContent="center" // aligns content to the left
              px="$4"
              py="$1.5"
            onPress={ () => console.log("settings")}
          
            >
              <HStack alignItems="center" space="sm" px="$1">
                <Text color="$white">Settings</Text>
              </HStack>
            </Button>
          
            <Button
                 flex={1}
                       bg="#1F1F1F"
              size="md"
              borderRadius="$lg" // adds sufficient rounding
              justifyContent="flex-start" // aligns content to the left
              px="$4"
              py="$1.5"
              onPress={confirmDiscard}
            >
              <HStack alignItems="center" space="sm">
                <Text color="$red">Discard Workout</Text>
              </HStack>
            </Button>
          </HStack>

          
        </VStack>
      </ScrollView>
      {Object.entries(restCountdowns).map(([key, timeLeft]) => {
  const [exerciseId] = key.split("-");
  const data = exerciseData[exerciseId];
  const totalTime = data?.restTimeInSeconds ?? 0;

  if (typeof timeLeft === "number" && timeLeft > 0) {
    return (
      <RestCountdownTimer
        key={key}
        timeLeft={timeLeft}
        totalTime={totalTime}
        onSkip={() =>
          setRestCountdowns((prev) => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
          })
        }
        onIncrease={() =>
          setRestCountdowns((prev) => ({
            ...prev,
            [key]: (prev[key] || 0) + 10,
          }))
        }
        onDecrease={() =>
          setRestCountdowns((prev) => ({
            ...prev,
            [key]: Math.max((prev[key] || 0) - 10, 0),
          }))
        }
      />
    );
  }

  return null;
})}

  
 <RestTimerSheet
  ref={restSheetRef}
  onSelectDuration={handleRestDurationSelect}
/>
<WeightSheet
  ref={weightSheetRef}
  onSelectWeight={handleWeightSelect}
/>
<RepsTypeSheet
  ref={repsSheetRef}
  onSelectRepsType={handleRepsTypeSelect}
/>
    </Box>
  );
}

const calculateWorkoutStats = (exerciseData: ExerciseData) => {
  let totalVolume = 0;
  let totalSets = 0;

  Object.values(exerciseData).forEach((ex) => {
    ex.sets.forEach((s: SetItem) => {
      if (s.isCompleted) {
        const reps = s.reps ?? ((s.minReps || 0) + (s.maxReps || 0)) / 2;
        totalVolume += s.weight * reps;
        totalSets += 1;
      }
    });
  });

  return {
    volume: Math.round(totalVolume),
    sets: totalSets,
  };
};
