import React,{useEffect} from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ScrollView,
} from '@gluestack-ui/themed';

import { Feather,FontAwesome6 ,AntDesign } from '@expo/vector-icons';
import CustomButton from '@/components/customButton';
import { db } from "@/db/db";
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
 import { routines, routineExercises, exercises } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
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

useEffect(() => {
  const loadRoutinesWithExercises = async () => {
    try {
      const routineData = await db.select().from(routines).all();
console.log("🧠 All routines:", routineData);
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
}, []);




  return (
    <Box flex={1} bg="$black" pt="$5">
     

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

     <ScrollView px="$4">
<HStack alignItems="center" mb="$3" space="sm">
  {/* Dropdown Icon on the left */}
  <AntDesign name="caretdown" size={14} color="#a1a1aa" />

  {/* Label with count */}
  <Text color="$coolGray400" letterSpacing={0.5}>
    My Routines ({routineList.reduce((count, routine) => count + routine.exercises.length, 0)})
  </Text>
</HStack>

  <VStack space="lg">
    {routineList.length === 0 ? (
      <Text color="$coolGray400">No routines found.</Text>
    ) : (
      routineList.map((routine) => (
        <Box key={routine.id} bg="#1F1F1F" p="$4" rounded="$xl">
          {/* Pressable title navigates to details */}
         <Pressable onPress={() => router.push({ pathname: "/routine/[id]", params: { id: routine.id } })}>
            <Text color="$white" fontSize="$lg" fontWeight="$semibold">
              {routine.name}
            </Text>

            <Text color="$coolGray400" fontSize="$sm" mt="$0.5" mb="$4">
              {routine.exercises.length > 0
                ? routine.exercises.map((ex) => ex.name).join(", ")
                : "No exercises added"}
            </Text>
          </Pressable>

          {/* Single Start Routine Button */}
          <CustomButton
            onPress={() => router.push({
  pathname: "/logWorkout",
  params: {
    routineId: routine.id,
    routineTitle: routine.name,
  }
})
            }
            bg="$blue500"
          >
            Start Routine
          </CustomButton>
        </Box>
      ))
    )}
  </VStack>
</ScrollView>


    </Box>
  );
}
