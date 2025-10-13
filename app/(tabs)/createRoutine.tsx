import React, { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "@/db/db";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { exercises, Exercise, routines, routineSets, routineExercises } from "@/db/schema";
import { inArray, eq } from "drizzle-orm";
import SetTypeModal from "@/components/routine/bottomSheet/set";
import RestTimerSheet from "@/components/routine/bottomSheet/timer";
import RepsTypeSheet from "@/components/routine/bottomSheet/repsType";
import {
  VStack,
  Text,
  Input,
  InputField,
  Box,
  HStack,
  ScrollView,
  SafeAreaView,
} from "@gluestack-ui/themed";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import CustomHeader from "@/components/customHeader";
import CustomButton from "@/components/customButton";
import ExerciseBlock from "@/components/routine/exerciseBlock";
import { saveRoutineToDb } from "@/components/routine/saveRoutine";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WeightSheet from "@/components/routine/bottomSheet/weight";
import { useExerciseOptionsManager } from "@/hooks/useExerciseOptionsManager";

type PrefillExercise = Exercise & {
  rest_timer?: number;

  sets: {
    id: string;
    reps?: number;
    weight?: number;
    unit?: string;
    set_type?: string;
    notes?: string;
    completed?: boolean;
  }[];
};

type PrefillRoutine = {
  name: string;
  exercises: PrefillExercise[];
};

export default function CreateRoutineScreen() {
  const { showDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { selected, name, exercises: exerciseParam } = useLocalSearchParams();
  const selectedParam = Array.isArray(selected) ? selected[0] : selected;
  const nameParam = Array.isArray(name) ? name[0] : name;
  const exerciseListParam = Array.isArray(exerciseParam) ? exerciseParam[0] : exerciseParam;
  const router = useRouter();
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [title, setTitle] = useState<string>(nameParam || "");
  const { id, duplicate } = useLocalSearchParams();
  const [prefillData, setPrefillData] = useState<PrefillRoutine | null>(null);
  const [hasPrefilled, setHasPrefilled] = useState(false);
  const {
    activeExerciseId,
    activeSetIndex,
    exerciseData,
    setExerciseData,
    restSheetRef,
    weightSheetRef,
    repsSheetRef,
    setTypeSheetRef,
    openRestTimer,
    openWeightSheet,
    openRepsSheet,
    openSetTypeSheet,
    updateRestDuration,
    updateWeightUnit,
    updateRepsType,
    updateSetType,
  } = useExerciseOptionsManager();

  useEffect(() => {
    const fetchRoutineData = async () => {
      if (hasPrefilled || !id || duplicate !== "true") return;

      const [routine] = await db
        .select()
        .from(routines)
        .where(eq(routines.id, id as string));
      if (!routine) return;

      const exerciseLinks = await db
        .select()
        .from(routineExercises)
        .where(eq(routineExercises.routineId, id as string));

      const exerciseIds = exerciseLinks.map((e: any) => e.exerciseId);
      const exerciseDetails = await db
        .select()
        .from(exercises)
        .where(inArray(exercises.id, exerciseIds));

      const sets = await db
        .select()
        .from(routineSets)
        .where(eq(routineSets.routineId, id as string));

      const setsByExercise = exerciseLinks.map((link: any) => ({
        exerciseId: link.exerciseId,
        sets: sets.filter((s: any) => s.exerciseId === link.exerciseId),
        restTimer: link.restTimer ?? 0, // ✅ GET rest_timer here
      }));

      setPrefillData({
        name: `${routine.name} (Copy)`,
        exercises: exerciseDetails.map((ex: any) => {
          const matched = setsByExercise.find((s: any) => s.exerciseId === ex.id);
          return {
            ...ex,
            rest_timer: matched?.restTimer ?? 0,

            sets: (matched?.sets || []).map((s: any) => ({
              id: s.id,
              reps: s.reps ?? 0,
              weight: s.weight ?? 0,
              unit: "kg",
              set_type: s.setType ?? "Normal",
              notes: "",
              completed: false,
            })),
          };
        }),
      });

      setHasPrefilled(true);
    };

    fetchRoutineData();
  }, [id, duplicate, hasPrefilled]);

  useEffect(() => {
    if (!prefillData) return;

    // 1. Set the title
    setTitle(prefillData.name);

    // 2. Set selected exercises
    setSelectedExercises(prefillData.exercises);

    // 3. Build and set exerciseData
    const structuredData = prefillData.exercises.reduce(
      (acc, ex) => {
        acc[ex.id] = {
          notes: "",
          restTimer: ex.rest_timer ?? 0,
          unit: ex.sets?.[0]?.unit || "kg",
          repsType: "reps",
          sets: ex.sets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            completed: set.completed ?? false,
            setType: set.set_type || "Normal",
          })),
        };
        return acc;
      },
      {} as Record<string, any>
    );

    setExerciseData(structuredData);
  }, [prefillData]);

  const discardRoutineAndReset = () => {
    setTitle("");
    setSelectedExercises([]);
    setExerciseData({});
    router.replace("/workout"); // use replace to avoid keeping this screen in stack
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        showDialog({
          message: "Are you sure you want to discard ?",
          confirmText: "Discard",
          cancelText: "Cancel",
          destructive: true,
          onConfirm: discardRoutineAndReset,
        });
        return true; // block default behavior
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );
  const handleBackPress = () => {
    setTitle("");
    setSelectedExercises([]);
    setExerciseData({});
    router.replace("/workout");
  };

  useEffect(() => {
    const fetchSelectedExercises = async () => {
      const raw = selectedParam || exerciseListParam;
      if (!raw) return;

      try {
        const selectedIds = JSON.parse(raw) as string[];
        const data = await db
          .select()
          .from(exercises)
          .where(inArray(exercises.id, selectedIds))
          .all();

        setSelectedExercises((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          const newExercises = data.filter((e: any) => !existingIds.has(e.id));
          return [...prev, ...newExercises];
        });

        setExerciseData((prev) => {
          const updated = { ...prev };
          data.forEach((exercise: any) => {
            if (!updated[exercise.id]) {
              updated[exercise.id] = {
                notes: "",
                restTimer: 0,
                unit: "kg",
                repsType: "reps",

                sets: [{ weight: undefined, reps: undefined, setType: "Normal" }],
              };
            }
          });
          return updated;
        });
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchSelectedExercises();
  }, [selectedParam, exerciseListParam]);

  useEffect(() => {
    const restoreRoutine = async () => {
      const raw = await AsyncStorage.getItem("unsavedRoutine");
      if (!raw) return;

      try {
        const { title, selectedExercises, exerciseData } = JSON.parse(raw);
        if (title) setTitle(title);
        if (selectedExercises) setSelectedExercises(selectedExercises);
        if (exerciseData) setExerciseData(exerciseData);

        await AsyncStorage.removeItem("unsavedRoutine");
      } catch (err) {
        console.error("❌ Failed to restore unsaved routine:", err);
      }
    };

    restoreRoutine();
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a routine title");
      return;
    }

    if (Object.keys(exerciseData).length === 0) {
      alert("Please add at least one exercise");
      return;
    }

    //       if (!user) {
    //         Alert.alert(
    //           "Login Required",
    //           "Please log in to save your routine.",
    //     [
    //           { text: "Cancel", style: "cancel" },
    //           {
    //             text: "Login",
    //             onPress: async() => {
    //               await AsyncStorage.setItem("unsavedRoutine", JSON.stringify({
    //       title,
    //       selectedExercises,
    //       exerciseData,
    //     }));

    //               router.push({
    //                 pathname: "/signIn",
    //                 params: {
    //       redirectTo: "/createRoutine",
    //       title,
    //       exercises: JSON.stringify(selectedExercises),
    //       data: JSON.stringify(exerciseData),
    //     },
    //               });
    //             },
    //           },
    //         ]
    //         );
    //         return;
    //       }
    //  console.log("💾 Saving Routine Data:", {
    //     title,
    //     selectedExercises,
    //     exerciseData,
    //   });

    // Already logged in
    await saveRoutineToDb(title, selectedExercises, exerciseData);
    router.push("/workout");
  };

  const renderAddExerciseButton = () => (
    <HStack space="sm" alignItems="center">
      <CustomButton
        onPress={() =>
          router.push({
            pathname: "/addExercise",
            params: {
              from: "createRoutine",
            },
          })
        }
        bg="$blue500"
        icon={<Entypo name="plus" size={24} color="white" />}
        iconPosition="left"
      >
        Add exercise
      </CustomButton>
    </HStack>
  );

  return (
    <SafeAreaView flex={1} bg="$black">
      <CustomHeader
        title="Create Routine"
        onPress={handleBackPress}
        right="Save"
        onRightButtonPress={handleSave}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Box px="$2" py="$2">
          <Input variant="underlined" borderBottomWidth={0.5} size="md">
            <InputField
              placeholder="Routine title"
              value={title}
              onChangeText={setTitle}
              color="$white"
              placeholderTextColor="$coolGray400"
              fontWeight="$small"
              className="text-xl  px-2"
            />
            {title.length > 0 && (
              <Pressable onPress={() => setTitle("")}>
                <Box
                  bg="$white"
                  p={5} // adjust for size
                  borderRadius={999} // full circle
                  alignItems="center"
                  justifyContent="center"
                >
                  <MaterialIcons name="clear" size={10} color="black" />
                </Box>
              </Pressable>
            )}
          </Input>
        </Box>

        <Box pt={selectedExercises.length === 0 ? "$24" : "$6"} px="$2">
          {selectedExercises.length === 0 ? (
            <VStack alignItems="center" space="3xl">
              <FontAwesome6 name="dumbbell" size={36} color="gray" />
              <Text px="$4" textAlign="center" color="$coolGray400" fontSize="$md">
                Get started by adding an exercise to your routine.
              </Text>
              {renderAddExerciseButton()}
            </VStack>
          ) : (
            <Box w="$full">
              {selectedExercises.map((exercise) => (
                <ExerciseBlock
                  key={exercise.id}
                  exercise={exercise}
                  data={exerciseData[exercise.id]}
                  onChange={(newData: any) =>
                    setExerciseData({ ...exerciseData, [exercise.id]: newData })
                  }
                  onOpenRestTimer={openRestTimer}
                  onOpenWeight={openWeightSheet}
                  onOpenRepsType={openRepsSheet}
                  onOpenSetType={(exerciseId, setIndex) => {
                    if (setIndex === undefined) return; // or handle default
                    openSetTypeSheet(exerciseId, setIndex);
                  }}
                  onOpenRepRange={() => {}}
                  onToggleSetComplete={() => {}}
                />
              ))}

              {renderAddExerciseButton()}
            </Box>
          )}
        </Box>
      </ScrollView>
      <RestTimerSheet ref={restSheetRef} onSelectDuration={updateRestDuration} />
      <WeightSheet
        ref={weightSheetRef}
        onSelectWeight={(weight) => {
          if (weight === "lbs" || weight === "kg") {
            updateWeightUnit(weight);
          }
        }}
      />
      <RepsTypeSheet ref={repsSheetRef} onSelectRepsType={updateRepsType} />
      <SetTypeModal
        ref={setTypeSheetRef}
        selectedType={
          exerciseData[activeExerciseId ?? ""]?.sets?.[activeSetIndex ?? 0]?.setType || "Normal"
        }
        onSelect={(type) => {
          updateSetType(type);
          setTypeSheetRef.current?.close();
        }}
      />
      <ConfirmDialogComponent />
    </SafeAreaView>
  );
}
