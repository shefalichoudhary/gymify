import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/db/db";
import { exercises } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { Exercise } from "@/db/schema";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import SetTypeModal from "@/components/routine/bottomSheet/set";
import {
  VStack,
  Button,
  Text,
  Input,
  InputField,
  Box,
  HStack,
  ScrollView,
  Pressable,
} from "@gluestack-ui/themed";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Entypo } from "@expo/vector-icons";
import CustomHeader from "@/components/customHeader";
import CustomButton from "@/components/customButton";
import ExerciseBlock from "@/components/routine/exerciseBlock";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SaveRoutine } from "@/components/routine/saveRoutine";

export default function CreateRoutineScreen() {
  const router = useRouter();
  const { selected } = useLocalSearchParams();
  const selectedParam = Array.isArray(selected) ? selected[0] : selected;
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [activeSetIndex, setActiveSetIndex] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseData, setExerciseData] = useState<Record<string, {
    notes: string;
    restTimer: boolean;
    sets: {
      lbs: string;
      reps: string;
      minReps?: number;
      maxReps?: number;
    }[];
  }>>({});
    const [isModalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("Normal");

  

  const sheetRef = useRef<BottomSheetMethods>(null);

  const openBottomSheet = () => {
    sheetRef.current?.expand();
  };

  useEffect(() => {
    const fetchSelectedExercises = async () => {
      if (!selectedParam) return;
      try {
        const selectedIds = JSON.parse(selectedParam) as string[];
        const data = await db
          .select()
          .from(exercises)
          .where(inArray(exercises.id, selectedIds))
          .all();

        setSelectedExercises(data);
        const initialData = data.reduce((acc, exercise) => {
          acc[exercise.id] = {
            notes: "",
            restTimer: false,
            sets: [{ lbs: "", reps: "" }],
          };
          return acc;
        }, {} as Record<string, { notes: string; restTimer: boolean; sets: any[] }>);
        setExerciseData(initialData);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    fetchSelectedExercises();
  }, [selectedParam]);


const handleSave = async () => {
  if (!title.trim()) {
    alert("Please enter a routine title");
    return;
  }

  if (Object.keys(exerciseData).length === 0) {
    alert("Please add at least one exercise");
    return;
  }

  try {
    // if (isLoggedIn) {
    //   await SaveRoutine(title, exerciseData);
    //   router.push("/workout");
    // } else {
      // Save to local storage
      await AsyncStorage.setItem(
        "unsavedRoutine",
        JSON.stringify({ title, exerciseData })
      );
      router.push("/signIn");
    
  } catch (error) {
    console.error("Error saving routine:", error);
    alert("Failed to save routine. Try again.");
  }
};

  const renderAddExerciseButton = () => (
    <HStack space="sm" alignItems="center">
      <CustomButton
        onPress={() => router.push("./addExercise")}
        bg="$blue500"
        icon={<Entypo name="plus" size={24} color="white" />}
        iconPosition="left"
      >
        Add exercise
      </CustomButton>
    </HStack>
  );

  return (
    <Box flex={1} bg="$black">
      <CustomHeader
        title="Create Routine"
        left="Cancel"
        onPress={() => router.back()}
        right="Save"
        onRightButtonPress={handleSave}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Box pt="$6" px="$2">
          <Input variant="underlined" borderBottomWidth={0.5} size="xl">
            <InputField
              placeholder="Routine title"
              value={title}
              onChangeText={setTitle}
              color="$white"
              placeholderTextColor="$coolGray400"
              fontWeight="$medium"
              className="text-2xl pb-5"
            />
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
            <VStack space="md">
              {selectedExercises.map((exercise) => (
                <ExerciseBlock
                  key={exercise.id}
                  exercise={exercise}
                  data={exerciseData[exercise.id]}
                  onChange={(newData) =>
                    setExerciseData({ ...exerciseData, [exercise.id]: newData })
                  }
                  onOpenRepRange={(exerciseId, setIndex) => {
                    setActiveExerciseId(exerciseId);
                    setActiveSetIndex(setIndex);
                    openBottomSheet();
                  }}
                  onHeaderPress={openBottomSheet}
                />
              ))}
              {renderAddExerciseButton()}
            </VStack>
          )}
        </Box>
      </ScrollView>



      <SetTypeModal
        visible={isModalVisible}
        selectedType={selectedType}
        onSelect={(type) => setSelectedType(type)}
        onClose={() => setModalVisible(false)}
      />
    </Box>
  );
}
