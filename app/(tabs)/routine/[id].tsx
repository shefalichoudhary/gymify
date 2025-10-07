import { Box, Text, VStack, HStack, ScrollView, Pressable } from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import CustomHeader from "@/components/customHeader";
import CustomButton from "@/components/customButton";
import React, { useEffect, useState } from "react";
import { db } from "@/db/db";
import { routines, routineExercises, exercises, routineSets } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

type RoutineWithExercises = {
  id: string;
  name: string;
  createdBy: string;
  exercises: {
    id: string;
    name: string;
    exerciseType?: string | null;
    unit?: string | null;
    repsType?: string | null;
    sets: {
      weight?: number | null;
      reps?: number | null;
      minReps?: number | null;
      maxReps?: number | null;
      duration?: number | null;
      setType?: string | null;
    }[];
  }[];
};

export default function RoutineDetails() {
  const router = useRouter();
  const [routine, setRoutine] = useState<RoutineWithExercises | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchRoutine = async () => {
      if (!routineId) return;

      const routineResult = await db
        .select()
        .from(routines)
        .where(eq(routines.id, routineId))
        .all();

      if (!routineResult.length) return;
      const routineRow = routineResult[0];

      const routineEx = await db
        .select({
          exerciseId: routineExercises.exerciseId,
          unit: routineExercises.unit,
          repsType: routineExercises.repsType,
        })
        .from(routineExercises)
        .where(eq(routineExercises.routineId, routineRow.id))
        .all();

      const exerciseIds = routineEx.map((re) => re.exerciseId);

      const exDetails = exerciseIds.length
        ? await db
            .select({
              id: exercises.id,
              name: exercises.exercise_name,
              exerciseType: exercises.exercise_type,
            })
            .from(exercises)
            .where(inArray(exercises.id, exerciseIds))
            .all()
        : [];

      const setEntries = await db
        .select()
        .from(routineSets)
        .where(eq(routineSets.routineId, routineRow.id))
        .all();

      const exercisesWithSets = exDetails.map((ex) => {
        const matched = routineEx.find((re) => re.exerciseId === ex.id);

        const sets = setEntries
          .filter((s) => s.exerciseId === ex.id)
          .map((s) => ({
            weight: s.weight ?? null,
            reps: s.reps ?? null,
            minReps: s.minReps ?? null,
            maxReps: s.maxReps ?? null,
            duration: s.duration ?? null,
            setType: s.setType ?? null,
          }));

        return {
          ...ex,
          unit: matched?.unit ?? null,
          repsType: matched?.repsType ?? null,
          sets,
        };
      });

      setRoutine({
        id: routineRow.id,
        name: routineRow.name,
        createdBy: routineRow.createdBy ?? "Anonymous",
        exercises: exercisesWithSets,
      });
    };

    fetchRoutine();
  }, [routineId]);

  if (!routine) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$black">
        <Text color="white">Routine not found</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="$black">
      <CustomHeader
        title="Routine"
        left={
          <Pressable onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>
        }
      />

      <Box px="$4" py="$4">
        <Text fontSize="$xl" color="white" fontWeight="$medium" letterSpacing={0.8}>
          {routine.name}
        </Text>
        <Text color="$coolGray400" my="$2" mb="$3" fontSize={"$sm"}>
          Created by {routine.createdBy}
        </Text>

        <CustomButton
          onPress={() =>
            router.push({
              pathname: "/logWorkout",
              params: {
                routineId: routineId,
                routineTitle: routine.name,
              },
            })
          }
          bg="$blue500"
        >
          Start Routine
        </CustomButton>
      </Box>

      <HStack justifyContent="space-between" alignItems="center" pt="$4" px="$5">
        <Text color="$coolGray400" fontWeight={"$small"} fontSize="$md">
          Exercises
        </Text>
        <Pressable
          onPress={() => router.push({ pathname: "/routine/edit/[id]", params: { id: routineId } })}
        >
          <Text color="$blue400" fontWeight={"$small"} fontSize="$md">
            Edit Routine
          </Text>
        </Pressable>
      </HStack>

      <ScrollView py="$2">
        {routine.exercises.length === 0 ? (
          <Text color="$coolGray400" mt="$4" px="$2">
            No exercises in this routine.
          </Text>
        ) : (
          <VStack space="md">
            {routine.exercises.map((exercise, exIndex) => (
              <Box key={exIndex}>
                {/* Exercise header */}
                <HStack alignItems="center" ml="$1" px="$3">
                  <Box
                    w={38}
                    h={38}
                    borderRadius={30}
                    bg="#1F1F1F"
                    mr="$3"
                    justifyContent="center"
                    alignItems="center"
                  />
                  <Text color="$blue500" fontSize="$md" fontWeight="$medium">
                    {exercise.name}
                  </Text>
                </HStack>

                <Box px="$5">
                  <Text color="$coolGray400" mt="$2" mb="$4" fontSize={"$xs"}>
                    {exercise.exerciseType}
                  </Text>
                </Box>

                {/* Label Row */}
                <HStack mb="$1" justifyContent="space-between" px="$6">
                  <Box flex={2}>
                    <Text size="xs" color="$coolGray400" fontWeight="$small">
                      SET
                    </Text>
                  </Box>

                  {exercise.exerciseType === "Duration" ? (
                    <Box flex={4}>
                      <Text size="xs" color="$coolGray400" fontWeight="$small">
                        Duration
                      </Text>
                    </Box>
                  ) : exercise.exerciseType === "Bodyweight" ? (
                    <Box flex={4}>
                      <Text size="xs" color="$coolGray400" fontWeight="$small">
                        Reps
                      </Text>
                    </Box>
                  ) : (
                    <>
                      <Box flex={2}>
                        <Text size="xs" color="$coolGray400" fontWeight="$small">
                          {exercise.unit}
                        </Text>
                      </Box>
                      <Box flex={4}>
                        <Text size="xs" color="$coolGray400" fontWeight="$small">
                          {exercise.repsType}
                        </Text>
                      </Box>
                    </>
                  )}
                </HStack>

                {/* Value Rows */}
                {exercise.sets.map((set, setIndex) => (
                  <Box
                    key={setIndex}
                    bg={setIndex % 2 !== 0 ? "#1F1F1F" : "transparent"}
                    py="$2"
                    borderRadius="$sm"
                  >
                    <HStack justifyContent="space-between" alignItems="center" px="$7">
                      <Box flex={2}>
                        <Text color="$white">
                          {set.setType && set.setType !== "Normal"
                            ? set.setType
                            : `${setIndex + 1}`}
                        </Text>
                      </Box>

                      {exercise.exerciseType === "Duration" ? (
                        <Box flex={4}>
                          <Text color="$white">{set.duration ?? "-"}</Text>
                        </Box>
                      ) : exercise.exerciseType === "Bodyweight" ? (
                        <Box flex={4}>
                          <Text color="$white">{set.reps ?? "-"}</Text>
                        </Box>
                      ) : (
                        <>
                          <Box flex={2}>
                            <Text color="$white">{set.weight ?? "-"}</Text>
                          </Box>
                          <Box flex={4}>
                            <Text color="$white">
                              {exercise.repsType === "rep range"
                                ? `${set.minReps ?? "-"}-${set.maxReps ?? "-"}`
                                : (set.reps ?? "-")}
                            </Text>
                          </Box>
                        </>
                      )}
                    </HStack>
                  </Box>
                ))}
              </Box>
            ))}
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
}
