import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  ScrollView,
  SafeAreaView,
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

const MOTIVATIONAL_QUOTES = [
  "Push yourself, because no one else is going to do it for you.",
  "Success starts with self-discipline.",
  "Every workout counts. Keep going!",
  "Small progress is still progress.",
  "Your body can stand almost anything. It’s your mind you have to convince.",
  "Don’t limit your challenges. Challenge your limits.",
  "Sweat is just fat crying.",
  "Take care of your body. It’s the only place you have to live.",
  "Eat for the body you want, not for the body you have.",
  "Consistency is the key to success.",
];

function getRandomQuote() {
  const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[idx];
}

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [quote, setQuote] = useState(getRandomQuote());

  useFocusEffect(
    useCallback(() => {
      const fetchWorkouts = async () => {
        try {
          const allWorkouts = await db.select().from(workoutsTable);

          const workoutsWithExercises: Workout[] = [];

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
              const exerciseVolume = sets.reduce((sum:number, s:any) => sum + (s.weight ?? 0) * (s.reps ?? 1), 0);
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

          // Sort workouts by date descending
          workoutsWithExercises.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setWorkouts(workoutsWithExercises);
         const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
        setQuote(randomQuote);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
      fetchWorkouts();
    }, [])
  );



  // Only show the latest workout
  const latestWorkout = workouts.length > 0 ? workouts[0] : null;

  return (
    <SafeAreaView  bg="#1F1F1F">
      <ScrollView pt="$2"   contentContainerStyle={{ flexGrow: 1 }} >
        <VStack flex={1}  space="md" >
          {/* Latest Workout Card if exists */}
          {latestWorkout && (
            <Box
              key={latestWorkout.id}
              bg="$black"
              borderRadius="$xl"
              p="$4"
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

              {/* Workout Title */}
              <Text color="$white" fontWeight="$bold" fontSize="$lg" mb="$2">
                {latestWorkout.name}
              </Text>

              {/* Stats */}
              <HStack justifyContent="space-between" mb="$3">
                <VStack>
                  <Text color="$coolGray400" fontSize="$xs">Duration</Text>
                  <Text color="$blue500" fontSize="$sm">
                    {latestWorkout.time < 60
                      ? `${latestWorkout.time} sec`
                      : `${Math.floor(latestWorkout.time / 60)} min ${latestWorkout.time % 60 || ""}${latestWorkout.time % 60 ? " sec" : ""}`}
                  </Text>
                </VStack>
                <VStack alignItems="flex-end">
                  <Text color="$coolGray400" fontSize="$xs" mr="$1.5">Volume</Text>
                  <Text color="$white" fontSize="$sm">{latestWorkout.totalVolume}</Text>
                </VStack>
              </HStack>

              {/* Exercises */}
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
          )}

          
          {/* Motivational Quotes Feed */}
          {MOTIVATIONAL_QUOTES.map((quote, idx) => (
            <Box
              key={idx}
              bg="$black"
              borderRadius="$xl"
              p="$4"
              shadowColor="#000"
              shadowOpacity={0.2}
              shadowRadius={8}
            >
              {/* Header with Avatar & Username */}
              <HStack alignItems="center" mb="$3" justifyContent="space-between">
                <HStack alignItems="center" space="xs">
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
                      M
                    </Text>
                  </Box>
                  <VStack>
                    <Text color="$white" fontWeight="$bold" fontSize="$md">
                      MotivationBot
                    </Text>
                    <Text color="$coolGray400" fontSize="$xs">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </VStack>
                </HStack>
              </HStack>

              {/* Quote Title */}
              <Text color="$white" fontWeight="$bold" fontSize="$lg" mb="$2">
                💡 Motivation
              </Text>

              {/* Quote Content */}
              <Text color="$white" fontSize="$sm" fontStyle="italic">
                {quote}
              </Text>
            </Box>
          
   
          ))}
          <Box
  alignItems="center"
  justifyContent="center"
  bg="$black"
  py="$5"
>
  <Text color="$coolGray400" fontSize="$md">
   No more content 😢
  </Text>
</Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}