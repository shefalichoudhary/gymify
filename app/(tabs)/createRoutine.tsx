import React, { useState, useEffect, useRef} from "react";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "@/db/db";

import { exercises , Exercise } from "@/db/schema";
import { inArray } from "drizzle-orm";
import SetTypeModal from "@/components/routine/bottomSheet/set";
import RestTimerSheet  from "@/components/routine/bottomSheet/timer";
import RepsTypeSheet from "@/components/routine/bottomSheet/repsType";

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
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert , Pressable} from "react-native";

import WeightSheet from "@/components/routine/bottomSheet/weight";
import { useExerciseOptionsManager } from "@/hooks/useExerciseOptionsManager";

export default function CreateRoutineScreen() {
  const { selected, name, exercises: exerciseParam } = useLocalSearchParams();
const selectedParam = Array.isArray(selected) ? selected[0] : selected;
const nameParam = Array.isArray(name) ? name[0] : name;
const exerciseListParam = Array.isArray(exerciseParam) ? exerciseParam[0] : exerciseParam;
  const router = useRouter();
  
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
const [title, setTitle] = useState<string>(nameParam || "");
    const [isModalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("Normal");
  const navigation = useNavigation();


const {
  exerciseData,
  setExerciseData,
  restSheetRef,
  weightSheetRef,
  repsSheetRef,
  openRestTimer,
  openWeightSheet,
  openRepsSheet,
  updateRestDuration,
  updateWeightUnit,
  updateRepsType,
} = useExerciseOptionsManager();

 
const discardRoutineAndReset = () => {
  setTitle("");
  setSelectedExercises([]);
  setExerciseData({});
  router.replace("/workout"); // use replace to avoid keeping this screen in stack
};





useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      if (!title && selectedExercises.length === 0) {
        return false; // allow back
      }

      Alert.alert(
        "Discard Routine?",
        "Are you sure you want to discard this routine?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard Routine",
            style: "destructive",
          onPress: discardRoutineAndReset,
          },
        ]
      );
      return true; // block back
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (!title && selectedExercises.length === 0) return;

      e.preventDefault();
      Alert.alert(
        "Discard Routine?",
        "Are you sure you want to discard this routine?",
        [
          { text: "Cancel", style: "cancel", onPress: () => {} },
          {
            text: "Discard Routine",
            style: "destructive",
           onPress: () => discardRoutineAndReset(),
          },
        ]
      );
    });

    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, [title, selectedExercises])
);

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
        const newExercises = data.filter((e) => !existingIds.has(e.id));
        return [...prev, ...newExercises];
      });

      setExerciseData((prev) => {
        const updated = { ...prev };
        data.forEach((exercise) => {
          if (!updated[exercise.id]) {
            updated[exercise.id] = {
              notes: "",
              restTimer: false,
              unit: "kg",
              repsType: "reps",
              sets: [{ weight: undefined, reps: undefined }],
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
    <HStack space="sm" alignItems="center" >
      <CustomButton
        onPress={() =>router.push({
  pathname: "/addExercise",
  params: {
    from: "createRoutine",
  },
})}
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
       onPress={() => {
  Alert.alert(
    "Discard Routine?",
    "Are you sure you want to discard this routine?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Discard Routine",
        style: "destructive",
     onPress: () => discardRoutineAndReset(),
      },
    ]
  );
}}

        right="Save"
        onRightButtonPress={handleSave}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      
        <Box px="$2" py="$2"  >
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
                  onChange={(newData) =>
                    setExerciseData({ ...exerciseData, [exercise.id]: newData })
                  }
                 onOpenRestTimer={openRestTimer}
  onOpenWeight={openWeightSheet}
  onOpenRepsType={openRepsSheet}
  onOpenRepRange={() => {}}
  
                />
              
              ))}
              
              {renderAddExerciseButton()}
             
            </Box>

          )}
        </Box>
       
      </ScrollView>
 <RestTimerSheet ref={restSheetRef} onSelectDuration={updateRestDuration} />
<WeightSheet ref={weightSheetRef} onSelectWeight={(weight) => {
    if (weight === "lbs" || weight === "kg") {
      updateWeightUnit(weight);
    } else {
      console.warn("Invalid unit:", weight);
    }
  }}/>
<RepsTypeSheet ref={repsSheetRef} onSelectRepsType={updateRepsType} />
      <SetTypeModal
        visible={isModalVisible}
        selectedType={selectedType}
        onSelect={(type) => setSelectedType(type)}
        onClose={() => setModalVisible(false)}
      />
    </Box>
  );
}
