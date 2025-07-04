import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  ScrollView,
} from "@gluestack-ui/themed";
import { db } from "@/db/db";
import {
  routines,
  exercises,
  routineExercises,
  routineSets,
  workouts as workoutsTable,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

type Workout = {
  id: string;
  name: string;
  createdAt: string;
  totalVolume: string;
  time: number;
  exercises: {
    name: string;
    sets: number;
    image?: any;
  }[];
};

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

 useFocusEffect(
  useCallback(() => {
    const fetchWorkouts = async () => {
      try {
        const allRoutines = await db
          .select()
          .from(routines)
          .orderBy(sql`${routines.createdAt} DESC`);

        const workoutsWithExercises: Workout[] = [];

        for (const routine of allRoutines) {
          const workoutMeta = await db
            .select()
            .from(workoutsTable)
            .where(eq(workoutsTable.routineId, routine.id));

          const duration = workoutMeta[0]?.duration ?? 0;

          const routineExs = await db
            .select()
            .from(routineExercises)
            .where(eq(routineExercises.routineId, routine.id));

          let totalVolume = 0;
          const exerciseList = [];

          for (const rex of routineExs) {
            const ex = await db
              .select()
              .from(exercises)
              .where(eq(exercises.id, rex.exerciseId));

            const sets = await db
              .select()
              .from(routineSets)
              .where(
                and(
                  eq(routineSets.routineId, routine.id),
                  eq(routineSets.exerciseId, rex.exerciseId)
                )
              );

            const totalSets = sets.length;
            const exerciseVolume = sets.reduce((sum, set) => sum + (set.lbs ?? 0), 0);
            totalVolume += exerciseVolume;

            exerciseList.push({
              name: ex[0]?.exercise_name || "Unknown Exercise",
              sets: totalSets,
            });
          }

          workoutsWithExercises.push({
            id: routine.id,
            name: routine.name,
            createdAt: routine.createdAt
              ? new Date(routine.createdAt).toLocaleDateString()
              : "Unknown date",
            totalVolume: `${totalVolume} kg`,
            time: duration,
            exercises: exerciseList,
          });
        }

        setWorkouts(workoutsWithExercises);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };

    fetchWorkouts();
  }, []) // <- wrapped in useCallback correctly
);

  return (
    <Box flex={1} bg="#1F1F1F" py="$3">
      <ScrollView pt="$1">
        <VStack bg="#1F1F1F" >
          {workouts.map((workout) => (
            <Box
              key={workout.id}
              bg="$black"

              p="$4"
              mb="$3"
            >
              <HStack justifyContent="space-between" alignItems="center" mb="$2">
                <HStack alignItems="center" space="sm">
                  <Box width={32} height={32} borderRadius={16} backgroundColor="$coolGray800" />
                  <VStack>
                    <Text color="$white" fontWeight="$bold">hey_shefali</Text>
                    <Text color="$coolGray400" fontSize="$xs">{workout.createdAt}</Text>
                  </VStack>
                </HStack>
              </HStack>

              <Text color="$white" fontWeight="$bold" fontSize="$lg" mb="$1">
                {workout.name}
              </Text>

              <VStack py="$5" space="xs" mb="$2" borderBottomWidth={0.2} borderColor="$coolGray400">
                <HStack px="$3" justifyContent="space-between">
                  <Text color="$coolGray400" fontSize="$xs">Duration</Text>
                  <Text color="$coolGray400" fontSize="$xs">Volume</Text>
                </HStack>
                <HStack px="$5" justifyContent="space-between">
                  <Text color="$blue500" fontSize="$sm">
                    {workout.time < 60
                      ? `${workout.time} sec`
                      : `${Math.floor(workout.time / 60)} min ${workout.time % 60 || ""}${workout.time % 60 ? " sec" : ""}`}
                  </Text>
                  <Text color="$white" fontSize="$sm">{workout.totalVolume}</Text>
                </HStack>
              </VStack>

              <VStack alignItems="center">
  {workout.exercises.map((ex, idx) => (
    <HStack key={idx} alignItems="center" space="md" mb="$2">
      <Text textAlign="center" color="$white">
        {ex.sets} sets {ex.name}
      </Text>
    </HStack>
  ))}
</VStack>
            </Box>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
