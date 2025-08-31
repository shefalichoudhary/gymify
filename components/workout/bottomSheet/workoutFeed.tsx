"use client";

import { db } from "@/db/db";
import {
  exercises,
  workoutExercises,
  workoutSets,
  workouts as workoutsTable,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Box, Text, VStack, HStack } from "@gluestack-ui/themed";
import React from "react";

async function getWorkouts() {
  const allWorkouts = await db.select().from(workoutsTable);
  const workoutsWithExercises = [];

  for (const w of allWorkouts) {
    const wExercises = await db
      .select()
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, w.id));

    const exerciseList = [];
    let totalVolume = 0;

    for (const we of wExercises) {
      const ex = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, we.exerciseId));

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
      const exerciseVolume = sets.reduce(
        (sum, s) => sum + (s.weight ?? 0) * (s.reps ?? 1),
        0
      );
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

  workoutsWithExercises.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return workoutsWithExercises;
}

export default function WorkoutFeed() {
  // ⚡ This will suspend until data is ready (because SQLiteProvider usesSuspense = true)
  const workouts = React.use(getWorkouts()); // experimental API (Suspense for data fetching)

  const latestWorkout = workouts.length > 0 ? workouts[0] : null;

  if (!latestWorkout) {
    return (
      <Box bg="$black" borderRadius="$xl" p="$4">
        <Text color="$coolGray400">No workouts yet</Text>
      </Box>
    );
  }

  return (
    <Box
      key={latestWorkout.id}
      bg="$black"
      borderRadius="$xl"
      p="$4"
      shadowColor="#000"
      shadowOpacity={0.2}
      shadowRadius={8}
    >
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
            <Text color="$coolGray400" fontSize="$xs">
              {new Date(latestWorkout.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </VStack>
        </HStack>
      </HStack>

      <Text color="$white" fontWeight="$bold" fontSize="$lg" mb="$2">
        {latestWorkout.name}
      </Text>

      <HStack justifyContent="space-between" mb="$3">
        <VStack>
          <Text color="$coolGray400" fontSize="$xs">
            Duration
          </Text>
          <Text color="$blue500" fontSize="$sm">
            {latestWorkout.time < 60
              ? `${latestWorkout.time} sec`
              : `${Math.floor(latestWorkout.time / 60)} min ${
                  latestWorkout.time % 60 || ""
                }${latestWorkout.time % 60 ? " sec" : ""}`}
          </Text>
        </VStack>
        <VStack alignItems="flex-end">
          <Text color="$coolGray400" fontSize="$xs" mr="$1.5">
            Volume
          </Text>
          <Text color="$white" fontSize="$sm">
            {latestWorkout.totalVolume}
          </Text>
        </VStack>
      </HStack>

      <VStack space="sm">
        {latestWorkout.exercises.map((ex, idx) => (
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
  );
}
