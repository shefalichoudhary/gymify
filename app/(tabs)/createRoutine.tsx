import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/db/db";
import { exercises , Exercise } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import SetTypeModal from "@/components/routine/bottomSheet/set";
import {
  VStack,
  Text,
  Input,
  InputField,
  Box,
  HStack,
  ScrollView,
} from "@gluestack-ui/themed";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import CustomHeader from "@/components/customHeader";
import CustomButton from "@/components/customButton";
import ExerciseBlock from "@/components/routine/exerciseBlock";
  import { saveRoutineToDb } from "@/components/routine/saveRoutine";
import { Pressable } from "react-native";


export default function CreateRoutineScreen() {
  const router = useRouter();
  const { selected } = useLocalSearchParams();
  const selectedParam = Array.isArray(selected) ? selected[0] : selected;
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [activeSetIndex, setActiveSetIndex] = useState<number | null>(null);
  const [title, setTitle] = useState<string >("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseData, setExerciseData] = useState<Record<string, {
    notes: string;
    restTimer: boolean;
    sets: {
      lbs: number;
      reps: number;
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

 
     await saveRoutineToDb(title, selectedExercises, exerciseData);
console.log("✅ Routine saved to SQLite DB");
router.push("/workout");
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
        onPress={() => router.push("/workout")}
        right="Save"
        onRightButtonPress={handleSave}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Box pt="$6" px="$2">
          <Input variant="underlined" borderBottomWidth={0.5} size="xl">
            <InputField
              placeholder="Routine title"
              value={title}
              onChangeText={setTitle}
              color="$white"
              placeholderTextColor="$coolGray400"
              fontWeight="$small"
              className="text-2xl pb-5 px-2"
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
