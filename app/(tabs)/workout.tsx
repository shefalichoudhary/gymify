 import React,{useEffect,useRef,useState} from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ScrollView,
} from '@gluestack-ui/themed';
import { Vibration } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

import { Feather,FontAwesome6 ,AntDesign } from '@expo/vector-icons';
import CustomButton from '@/components/customButton';
import { db } from "@/db/db";
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
 import { routines, routineExercises, exercises } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import WorkoutRoutineSheet,{WorkoutRoutineSheetRef} from '@/components/workout/bottomSheet/workoutRoutine';

const sheetRef = useRef<WorkoutRoutineSheetRef>(null);

type RoutineWithExercises = {
  id: string;
  name: string;
  exercises: {
    id: string;
    name: string;
  }[];
};

export default function WorkoutScreen() {
  const router = useRouter();

const [routineList, setRoutineList] = React.useState<RoutineWithExercises[]>([]);

useFocusEffect(
  useCallback(() => {
    const loadRoutinesWithExercises = async () => {
      try {
        const routineData = await db.select().from(routines).all();
        const routinesWithExercises: RoutineWithExercises[] = [];

        for (const routine of routineData) {
          const routineEx = await db
            .select()
            .from(routineExercises)
            .where(eq(routineExercises.routineId, routine.id))
            .all();

          const exerciseIds = routineEx.map((re) => re.exerciseId);

          const exDetails =
            exerciseIds.length > 0
              ? await db
                  .select({ id: exercises.id, name: exercises.exercise_name })
                  .from(exercises)
                  .where(inArray(exercises.id, exerciseIds))
                  .all()
              : [];

          routinesWithExercises.push({
            id: routine.id,
            name: routine.name,
            exercises: exDetails,
          });
        }

        setRoutineList(routinesWithExercises);
      } catch (err) {
        console.error("❌ Error loading routines:", err);
      }
    };

    loadRoutinesWithExercises();
  }, []) // empty dep array ensures it runs on every focus
);



  return (
    <Box flex={1} bg="$black" pt="$5" py="$6">
     

        {/* Routines */}
        <Box px="$3">

        <HStack justifyContent="space-between" alignItems="center" mb="$6">
          <Text color="$white" fontWeight="$semibold" fontSize="$lg">Routines</Text>
<Feather name="folder-plus" size={24} color="white" />
        </HStack>
<HStack space="lg" mb="$4" px="$1">
  {/* New Routine Button */}
  <Button
    flex={1}
       bg="#1F1F1F"

    size="md"
    borderRadius="$lg" // adds sufficient rounding
    justifyContent="flex-start" // aligns content to the left
    px="$4"
    py="$1.5"
  onPress={() => router.push("/createRoutine")}

  >
    <HStack alignItems="center" space="sm" px="$1">
      <FontAwesome6 name="clipboard-list" size={22}  color="white" />
      <Text color="$white">New Routine</Text>
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
  onPress={() => router.push("/addExercise")}

  >
    <HStack alignItems="center" space="sm">
      <AntDesign name="search1" size={24} color="white" />
      <Text color="$white">Explore</Text>
    </HStack>
  </Button>
</HStack>
        </Box>

        <Box px="$5">
       {routineList.length > 0 && (
  <HStack alignItems="center" mb="$3" space="md">
    <AntDesign name="caretdown" size={12} color="#a1a1aa" />
    <Text color="$coolGray400" letterSpacing={0.5}>
      My Routines ({routineList.reduce((count, routine) => count + routine.exercises.length, 0)})
    </Text>
  </HStack>
)}
  </Box>


    <DraggableFlatList
  data={routineList}
   onDragEnd={({ data }) => {
    setRoutineList(data);
    Vibration.vibrate(30); // Vibrate after drag ends
  }}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
  renderItem={({ item, drag, isActive }: RenderItemParams<RoutineWithExercises>) => (
    <Box
      bg="#1F1F1F"
      p="$4"
      mb="$4"
      rounded="$xl"
      style={{
        opacity: isActive ? 0.9 : 1,
        transform: [{ scale: isActive ? 1.02 : 1 }],
      }}
     
    >
      <Pressable
  onLongPress={() => {
    Vibration.vibrate(50); // 50ms vibration
    drag(); // Start dragging
  }}
    onPress={() => {
    router.push({
      pathname: "/routine/[id]",
      params: { id: item.id },
    });
  }}
>
       <HStack justifyContent="space-between" alignItems="center">
  <Text color="$white" fontSize="$lg" fontWeight="$semibold">
    {item.name}
  </Text>
   <Pressable
  onPress={() => {
    sheetRef.current?.open(item);
  }}
>
    <Feather name="more-horizontal" size={22} color="white" />
  </Pressable>
</HStack>
        <Text color="$coolGray400" fontSize="$sm" mt="$0.5" mb="$4">
          {item.exercises.length > 0
            ? item.exercises.map((ex) => ex.name).join(", ")
            : "No exercises added"}
        </Text>
      </Pressable>

      <CustomButton
        onPress={() =>
          router.push({
            pathname: "/logWorkout",
            params: {
              routineId: item.id,
              routineTitle: item.name,
            },
          })
        }
        bg="$blue500"
      >
        Start Routine
      </CustomButton>
    </Box>
  )}
/>
<WorkoutRoutineSheet
  ref={sheetRef}
  onRoutineDeleted={(id) => {
    setRoutineList((prev) => prev.filter((r) => r.id !== id));
  }}
/>

    </Box>
  );
}