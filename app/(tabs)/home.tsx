import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  ScrollView,
} from "@gluestack-ui/themed";
import { db } from "@/db/db";
import {
  exercises,
  workoutExercises,
  workoutSets,
  workouts as workoutsTable,
} from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { useFocusEffect } from "expo-router";
type Workout = {
  id: string;
  name: string;
  createdAt: string;
  totalVolume: string;
  time: number;
  exercises: {
    name: string;
    sets: number;
    totalWeight: number;
  }[];
};


export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
useFocusEffect(
  useCallback(() => {
    const fetchWorkouts = async () => {
      try {
        const allWorkouts = await db.select().from(workoutsTable);

        const workoutsWithExercises: Workout[] = []; // ✅ Initialize array

        for (const w of allWorkouts) {
          const wExercises = await db
            .select()
            .from(workoutExercises)
            .where(eq(workoutExercises.workoutId, w.id));

          const exerciseList = [];
          let totalVolume = 0;

          for (const we of wExercises) {
            const ex = await db.select().from(exercises).where(eq(exercises.id, we.exerciseId));
            const sets = await db
              .select()
              .from(workoutSets)
              .where(
                and(
                  eq(workoutSets.workoutId, w.id),
                  eq(workoutSets.exerciseId, we.exerciseId)
                )
              );

            const setsCount = sets.length;
            const exerciseVolume = sets.reduce((sum, s) => sum + (s.weight ?? 0) * (s.reps ?? 1), 0);
            totalVolume += exerciseVolume;

            exerciseList.push({
              name: ex[0]?.exercise_name || "Unknown Exercise",
              sets: setsCount,
              totalWeight: exerciseVolume,
            });
          }

          workoutsWithExercises.push({
            id: w.id,
            name: w.title,
            createdAt: w.date,
            totalVolume: `${totalVolume} kg`,
            time: w.duration,
            exercises: exerciseList,
          });
        }

        setWorkouts(workoutsWithExercises); // ✅ Update state
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };

    fetchWorkouts();
  }, [])
);
return (
   <Box flex={1} bg="#1F1F1F">
      <ScrollView pt="$2" contentContainerStyle={{ flexGrow: 1 }}>
        <VStack flex={1} pb="$4" px="$4" space="md">
          {workouts.length > 0 ? (
            workouts.map((workout) => (
              <Box
                key={workout.id}
                bg="$black"
                borderRadius="$xl"
                p="$4"
                mb="$2"
                shadowColor="#000"
                shadowOpacity={0.2}
                shadowRadius={8}
              >
                {/* Header with Avatar & Username */}
                <HStack alignItems="center" mb="$3" justifyContent="space-between">
                  <HStack alignItems="center" space="sm">
                   <Box
                                      w={40}
                                      h={40}
                                      borderRadius={30}
                                      bg="#1F1F1F"
                                      mr="$2"
                                      justifyContent="center"
                                      alignItems="center"
                                    >
                      <Text color="$white" fontWeight="$bold" fontSize="$md">
                        U
                      </Text>
                    </Box>
                    <VStack>
                      <Text color="$white" fontWeight="$bold" fontSize="$md">
                        unknown
                      </Text>
                   <Text color="$coolGray400" fontSize="$xs"> {new Date(workout.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", })} </Text>
                    </VStack>
                  </HStack>
                </HStack>

                {/* Workout Title */}
                <Text color="$white" fontWeight="$bold" fontSize="$lg" mb="$2">
                  {workout.name}
                </Text>

                {/* Stats */}
                <HStack justifyContent="space-between" mb="$3">
                  <VStack>
                    <Text color="$coolGray400" fontSize="$xs">Duration</Text>
                    <Text color="$blue500" fontSize="$sm">
                      {workout.time < 60
                        ? `${workout.time} sec`
                        : `${Math.floor(workout.time / 60)} min ${workout.time % 60 || ""}${workout.time % 60 ? " sec" : ""}`}
                    </Text>
                  </VStack>
                  <VStack alignItems="flex-end" >
                    <Text color="$coolGray400" fontSize="$xs" mr="$1.5">Volume</Text>
                    <Text color="$white" fontSize="$sm">{workout.totalVolume}</Text>
                  </VStack>
                </HStack>

                {/* Exercises */}
                <VStack space="sm">
                  {workout.exercises.map((ex, idx) => (
                    <HStack
                      key={idx}
                      justifyContent="space-between"
                      alignItems="center"
                      bg="$gray700"
                      p="$1"
                      borderRadius="$md"
                    >
                      <Text color="$white" fontSize="$sm" mr="$1">
                        {ex.name}
                      </Text>
                      <Text color="$blue500" fontSize="$sm">
                        {ex.sets} sets
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            ))
          ) : (
            <VStack flex={1} alignItems="center" justifyContent="center" space="lg" px="$6" mt="$20">
              <Box
                width={140}
                height={140}
                borderRadius={70}
                bgColor="rgba(255,255,255,0.05)"
                alignItems="center"
                justifyContent="center"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
              >
                <Text fontSize="$5xl">🏋️</Text>
              </Box>
              <Text fontSize="$xl" fontWeight="$bold" color="$white" textAlign="center">
                No Workouts Yet
              </Text>
              <Text fontSize="$sm" color="$white" textAlign="center" maxWidth={280}>
                Your completed workouts will show up here once you start logging. Time to get moving!
              </Text>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}