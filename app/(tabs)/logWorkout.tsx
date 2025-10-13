import React, { useEffect, useState } from "react";
import { Box, VStack, HStack, Text, Button, ScrollView, SafeAreaView } from "@gluestack-ui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import CustomHeader from "@/components/customHeader";
import CustomButton from "@/components/customButton";
import ExerciseBlock from "@/components/routine/exerciseBlock";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert } from "react-native";
import { db } from "@/db/db";
import {
  workouts,
  exercises,
  routineExercises,
  workoutExercises,
  workoutSets,
  routines,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import RestTimerSheet from "@/components/routine/bottomSheet/timer";
import WeightSheet from "@/components/routine/bottomSheet/weight";
import RepsTypeSheet from "@/components/routine/bottomSheet/repsType";
import SetTypeModal from "@/components/routine/bottomSheet/set";
import * as Haptics from "expo-haptics";
import RestCountdownTimer from "@/components/routine/restCountdownTimer";
import { useExerciseOptionsManager } from "@/hooks/useExerciseOptionsManager";
import cuid from "cuid";
import CustomDialog from "@/components/workout/logWorkoutDialog";

type SetItem = {
  weight?: number;
  reps?: number | null;
  minReps?: number;
  maxReps?: number;
  isRangeReps?: boolean;

  // Previous values for prefill
  previousWeight?: number;
  previousReps?: number;
  previousMinReps?: number;
  previousMaxReps?: number;
  previousUnit?: "kg" | "lbs";
  previousRepsType?: "reps" | "rep range";
  previousDuration?: number;

  // Set metadata
  isCompleted?: boolean;
  setType?: "W" | "Normal" | "D" | "F" | string;
  unit?: "kg" | "lbs";
  repsType?: "reps" | "rep range";
  duration?: number;
};
type ExerciseEntry = {
  notes: string;
  restTimer: number;
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
  exercise_type: string | null;
};

export default function LogWorkoutScreen() {
  const router = useRouter();
  const { routineId, routineTitle, addedExerciseIds } = useLocalSearchParams();
  const {
    activeExerciseId,
    restSheetRef,
    weightSheetRef,
    repsSheetRef,
    setTypeSheetRef,
    activeSetIndex,
    openRestTimer,
    openWeightSheet,
    openRepsSheet,
    openSetTypeSheet,
  } = useExerciseOptionsManager();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    message: "",
    confirmText: "OK",
    cancelText: undefined,
    destructive: false,
    onConfirm: () => setDialogVisible(false),
    onCancel: () => setDialogVisible(false),
  });
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [exerciseData, setExerciseData] = useState<ExerciseData>({});
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetail[]>([]);

  const [loadedExerciseIds, setLoadedExerciseIds] = useState<string[]>([]);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const { volume: totalVolume, sets: totalSets } = calculateWorkoutStats(exerciseData);
  const [restCountdowns, setRestCountdowns] = useState<{ [key: string]: number }>({});
  const handleRestDurationSelect = (duration: number) => {
    if (!activeExerciseId) return;

    setExerciseData((prev: any) => {
      const updated = { ...prev };
      const exercise = updated[activeExerciseId];

      if (exercise) {
        exercise.restTimer = duration;
        exercise.restTimeInSeconds = duration;
      }

      return updated;
    });
  };
  const handleWeightSelect = (unit: string) => {
    if (!activeExerciseId) return;
    setExerciseData((prev: any) => ({
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
  const handleSetTypeSelect = (
    type: "W" | "Normal" | "D" | "F" | "REMOVE",
    exerciseId?: string,
    setIndex?: number
  ) => {
    const exId = exerciseId ?? activeExerciseId;
    const idx = setIndex ?? activeSetIndex;
    if (!exId || idx === null) return;

    setExerciseData((prev) => {
      const updated = { ...prev };
      const sets = [...updated[exId].sets];

      if (type === "REMOVE") {
        // 🗑 remove the set
        sets.splice(idx, 1);
      } else {
        // ✅ update set type
        sets[idx] = { ...sets[idx], setType: type };
      }

      updated[exId].sets = sets;
      return updated;
    });
  };

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
        // Toggle completed
        sets[setIndex].isCompleted = justCompleted;

        // If checking, fill empty fields from previous values
        if (justCompleted) {
          sets[setIndex].weight = sets[setIndex].weight ?? sets[setIndex].previousWeight ?? 0;

          sets[setIndex].reps = sets[setIndex].reps ?? sets[setIndex].previousReps ?? 0;

          sets[setIndex].minReps = sets[setIndex].minReps ?? sets[setIndex].previousMinReps ?? 0;

          sets[setIndex].maxReps = sets[setIndex].maxReps ?? sets[setIndex].previousMaxReps ?? 0;

          sets[setIndex].duration = sets[setIndex].duration ?? sets[setIndex].previousDuration ?? 0;

          sets[setIndex].unit = sets[setIndex].unit ?? sets[setIndex].previousUnit ?? "kg";

          sets[setIndex].repsType =
            sets[setIndex].repsType ?? sets[setIndex].previousRepsType ?? "reps";
        }

        const key = `${exerciseId}-${setIndex}`;

        if (justCompleted && updated[exerciseId].restTimer) {
          const restTime =
            updated[exerciseId].restTimeInSeconds ?? updated[exerciseId].restTimer ?? 0;

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
            .select({
              id: routineExercises.id,
              exerciseId: routineExercises.exerciseId,
              notes: routineExercises.notes,
              repsType: routineExercises.repsType,
              unit: routineExercises.unit,
              restTimer: routineExercises.restTimer,
            })
            .from(routineExercises)
            .where(eq(routineExercises.routineId, String(routineId)))
            .all();

          const exerciseIds = routineEx.map((re: any) => String(re.exerciseId));

          // Set placeholders immediately to show UI
          const placeholders: ExerciseData = {};
          for (const entry of routineEx) {
            const id = String(entry.exerciseId);
            placeholders[id] = {
              notes: entry.notes ?? "",
              restTimer: entry.restTimer ?? 0,
              unit: entry.unit ?? "kg",
              repsType: entry.repsType ?? "reps",
              sets: [],
            };
          }

          setExerciseData(placeholders);
          setExerciseDetails(
            exerciseIds.map((id: any) => ({
              id,
              name: "Loading...",
              type: "",
              equipment: "",
              exercise_type: null,
            }))
          );

          // Fetch details and sets in parallel
          const [routineSetRows, details] = await Promise.all([
            db.query.routineSets.findMany({
              where: (rs: any, { inArray }: any) => inArray(rs.exerciseId, exerciseIds),
            }),
            db
              .select({
                id: exercises.id,
                name: exercises.exercise_name,
                equipment: exercises.equipment,
                type: exercises.type,
                exercise_type: exercises.exercise_type,
              })
              .from(exercises)
              .where(inArray(exercises.id, exerciseIds))
              .all(),
          ]);

          // Now update state with real data
          const grouped: ExerciseData = { ...placeholders };

          for (const exerciseId of exerciseIds) {
            const setsForExercise = routineSetRows.filter(
              (set: any) => String(set.exerciseId) === exerciseId
            );

            const routineEntry = routineEx.find((re: any) => String(re.exerciseId) === exerciseId);

            grouped[exerciseId] = {
              notes: routineEntry?.notes ?? "",
              unit: routineEntry?.unit ?? "kg",
              repsType: routineEntry?.repsType ?? "reps",
              restTimer: routineEntry?.restTimer ?? 0,
              restTimeInSeconds: routineEntry?.restTimer ?? 0,
              sets: setsForExercise.map((s: any) => ({
                weight: s.weight ?? 0,
                rest_timer: s.restTimer ?? "off",
                reps: s.reps ?? 0,
                minReps: s.minReps,
                maxReps: s.maxReps,
                setType: s.setType ?? "normal",
                isRangeReps: s.isRangeReps ?? false,
                duration: s.duration ?? 0,
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
        newIds = Array.isArray(addedExerciseIds) ? addedExerciseIds : JSON.parse(addedExerciseIds);
      } catch (err) {
        console.warn("❌ Failed to parse addedExerciseIds", err);
        newIds = [];
      }

      const newUniqueIds = newIds.filter((id: string) => !loadedExerciseIds.includes(id));

      if (newUniqueIds.length === 0) return;

      try {
        // Fetch full exercise details
        const details = (
          await db
            .select({
              id: exercises.id,
              name: exercises.exercise_name,
              equipment: exercises.equipment,
              type: exercises.type,
              exercise_type: exercises.exercise_type,
            })
            .from(exercises)
            .where(inArray(exercises.id, newUniqueIds))
            .all()
        ).map((ex: any) => ({
          ...ex,
          exercise_type: ex.exercise_type ?? null,
        }));

        // Default ExerciseData values
        const newData: ExerciseData = {};
        for (const id of newUniqueIds) {
          newData[id] = {
            notes: "",
            restTimer: 0,
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

  function getRoutineId(id: string | string[] | undefined): string | undefined {
    if (!id) return undefined;
    return Array.isArray(id) ? id[0] : id;
  }

  const saveWorkout = async (updateRoutine: boolean) => {
    const { volume, sets } = calculateWorkoutStats(exerciseData);

    let titleToUse = "Workout";

    if (routineId) {
      try {
        const routine = await db
          .select({ title: routines.name })
          .from(routines)
          .where(eq(routines.id, String(routineId)))
          .get();

        if (routine?.title) titleToUse = routine.title;
      } catch (err) {
        console.warn("Could not fetch routine title:", err);
      }
    } else if (routineTitle) {
      titleToUse = String(routineTitle);
    }

    try {
      // Insert workout
      const normalizedRoutineId = getRoutineId(routineId);

      const [workout] = await db
        .insert(workouts)
        .values({
          routineId: normalizedRoutineId, // string or undefined
          date: new Date().toISOString(), // string
          title: titleToUse ? titleToUse : "Workout", // string
          duration: Number(duration), // number
          volume: Number(volume),
          sets: Number(sets), // number
        })
        .returning();

      for (const [exerciseId, exData] of Object.entries(exerciseData)) {
        const workoutExerciseId = cuid();
        await db.insert(workoutExercises).values({
          id: workoutExerciseId,
          workoutId: workout.id,
          exerciseId,
          notes: exData.notes,
          unit: exData.unit,
          repsType: exData.repsType,
          restTimer: exData.restTimer,
        });
        for (const set of exData.sets) {
          await db.insert(workoutSets).values({
            id: cuid(),
            workoutId: workout.id,
            exerciseId,
            weight: set.weight ?? 0,
            reps: set.reps ?? 0,
            minReps: set.minReps ?? 0,
            maxReps: set.maxReps ?? 0,
            duration: set.duration ?? 0,
            setType: (set.setType as "W" | "Normal" | "D" | "F") ?? "Normal",
            previousWeight: set.previousWeight ?? null,
            previousReps: set.previousReps ?? null,
            previousMinReps: set.previousMinReps ?? null,
            previousMaxReps: set.previousMaxReps ?? null,
            previousUnit: set.previousUnit ?? null,
            previousRepsType: set.previousRepsType ?? null,
            previousDuration: set.previousDuration ?? null,
          });
        }
      }

      setIsWorkoutActive(false);

      router.replace({
        pathname: "/saveWorkout",
        params: {
          id: workout.id,
          routineId,
          addedExerciseCount: String(Object.keys(exerciseData).length),
        },
      });
    } catch (err) {
      Alert.alert("Save Failed", "Could not save workout.");
    }
  };

  const handleFinish = () => {
    const { sets } = calculateWorkoutStats(exerciseData);

    if (sets === 0) {
      setDialogProps({
        message: "No Completed Sets. Please complete at least one set.",
        confirmText: "OK",
        cancelText: undefined,
        destructive: false,
        onConfirm: () => setDialogVisible(false),
        onCancel: () => setDialogVisible(false),
      });
      setDialogVisible(true);
    } else {
      // Directly save and navigate, no dialog
      saveWorkout(true);
    }
  };

  const discardRoutineAndReset = () => {
    // Reset any temporary workout state if needed
    setExerciseData({});
    setExerciseDetails([]);
    setLoadedExerciseIds([]);
    setIsWorkoutStarted(false);
    setDuration(0);
    setRestCountdowns({});

    // Navigate back to the workout page
    router.replace("/workout");
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Directly navigate to the workout page
        setDialogProps({
          message: "Are you sure you want to discard this workout? All progress will be lost.",
          confirmText: "Discard",
          cancelText: undefined,
          destructive: true,
          onConfirm: () => {
            setDialogVisible(false);
            discardRoutineAndReset();
          },
          onCancel: () => setDialogVisible(false),
        });
        setDialogVisible(true);
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => subscription.remove(); // cleanup
    }, [router])
  );
  const handleBackPress = () => {
    // Clear workout state
    setExerciseData({});
    setExerciseDetails([]);
    setLoadedExerciseIds([]);
    setIsWorkoutStarted(false);
    setDuration(0);
    setRestCountdowns({});

    // Navigate back
    router.replace("/workout");
  };
  return (
    <SafeAreaView flex={1} bg="$black">
      <CustomHeader
        title="Log Workout"
        right="Finish"
        onPress={handleBackPress}
        onRightButtonPress={handleFinish}
      />

      {/* Stats */}
      <VStack px="$3" py="$5" space="xs" mb="$2" borderBottomWidth={0.2} borderColor="$coolGray400">
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
        <HStack px="$5" justifyContent="space-between">
          <Text color="$blue500" fontSize="$sm">
            {duration}s
          </Text>
          <Text color="$white" fontSize="$sm">
            {Math.round(totalVolume)} kg
          </Text>
          <Text color="$white" fontSize="$sm">
            {totalSets}
          </Text>
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
                  exercise_type: ex.exercise_type ?? "Weighted",
                }}
                data={data}
                showCheckIcon={true}
                onChange={(newData) =>
                  setExerciseData((prev) => ({
                    ...prev,
                    [id]: newData as ExerciseEntry,
                  }))
                }
                onOpenRestTimer={openRestTimer}
                onOpenWeight={openWeightSheet}
                onOpenRepsType={openRepsSheet}
                onOpenSetType={(exerciseId, setIndex) => {
                  if (setIndex === undefined) return; // or handle default
                  openSetTypeSheet(exerciseId, setIndex);
                }}
                onOpenRepRange={() => {}}
                onToggleSetComplete={(
                  exerciseId: string,
                  setIndex: number,
                  justCompleted: boolean
                ) => handleToggleSetComplete(exerciseId, setIndex, justCompleted)}
              />
            </Box>
          );
        })}

        {/* Add & Actions */}
        <VStack space="lg">
          <Box>
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
              onPress={() => console.log("settings")}
            >
              <HStack alignItems="center" space="sm" px="$1">
                <Text color="$white">Settings</Text>
              </HStack>
            </Button>

            <Button
              flex={1}
              bg="#1F1F1F"
              size="md"
              borderRadius="$lg"
              justifyContent="flex-start"
              px="$4"
              py="$1.5"
              onPress={() => {
                setDialogProps({
                  message:
                    "Are you sure you want to discard this workout? All progress will be lost.",
                  confirmText: "Discard",
                  cancelText: undefined,
                  destructive: true,
                  onConfirm: () => {
                    setDialogVisible(false);
                    discardRoutineAndReset();
                  },
                  onCancel: () => setDialogVisible(false),
                });
                setDialogVisible(true);
              }}
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
      <RestTimerSheet ref={restSheetRef} onSelectDuration={handleRestDurationSelect} />
      <WeightSheet ref={weightSheetRef} onSelectWeight={handleWeightSelect} />
      <RepsTypeSheet ref={repsSheetRef} onSelectRepsType={handleRepsTypeSelect} />
      <SetTypeModal
        ref={setTypeSheetRef}
        selectedType={
          exerciseData[activeExerciseId ?? ""]?.sets?.[activeSetIndex ?? 0]?.setType || "Normal"
        }
        onSelect={(type: any) => {
          handleSetTypeSelect(type, activeExerciseId!, activeSetIndex!); // explicitly pass IDs
          setTypeSheetRef.current?.close();
        }}
      />
      <CustomDialog {...dialogProps} visible={dialogVisible} />
    </SafeAreaView>
  );
}

const calculateWorkoutStats = (exerciseData: ExerciseData) => {
  let totalVolume = 0;
  let totalSets = 0;

  Object.values(exerciseData).forEach((ex) => {
    ex.sets.forEach((s: SetItem) => {
      if (s.isCompleted) {
        const weight = Number(s.weight) || 0;
        let reps = 0;

        if (s.reps != null) {
          reps = Number(s.reps) || 0;
        } else if (s.minReps != null || s.maxReps != null) {
          reps = ((Number(s.minReps) || 0) + (Number(s.maxReps) || 0)) / 2;
        }

        totalVolume += weight * reps;
        totalSets += 1;
      }
    });
  });

  return {
    volume: Math.round(totalVolume),
    sets: totalSets,
  };
};
