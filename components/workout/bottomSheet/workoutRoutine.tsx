 import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    } from "react";
    import { Box, VStack, HStack, Text } from "@gluestack-ui/themed";
    import BottomSheet from "@gorhom/bottom-sheet";
    import { Pressable } from "@/components/ui/pressable";
    import { Feather, MaterialIcons } from "@expo/vector-icons";
    import { useRouter } from "expo-router";
    import { db } from "@/db/db";
    import { eq } from "drizzle-orm";
    import CustomBottomSheet from "@/components/routine/bottomSheet/customBottomSheet";
import { routineExercises, routineSets,routines, } from "@/db/schema"; 

    export type WorkoutRoutineSheetRef = {
    open: (routine: Routine) => void;
    close: () => void;
    };
type SetType = {
  id: string;
  reps: number;
  weight: number;
  unit: string;
  set_type: string;
  rest_timer: number;
  notes?: string;
  completed: boolean;
};
    type Routine = {
    id: string;
    name: string;
    exercises: {
        id: string;
        name: string;
    }[];
    };

    type Props = {
    onRoutineDeleted: (id: string) => void;
    };

    const WorkoutRoutineSheet = forwardRef<WorkoutRoutineSheetRef, Props>(
    ({ onRoutineDeleted }, ref) => {
        const router = useRouter();
        const bottomSheetRef = useRef<BottomSheet>(null);
        const [routine, setRoutine] = useState<Routine | null>(null);

        useImperativeHandle(ref, () => ({
        open: (routine: Routine) => {
            setRoutine(routine); // trigger re-render with routine
            bottomSheetRef.current?.snapToIndex(0);
        },
        close: () => {
            bottomSheetRef.current?.close();
        },
        }));

        const handleDelete = async () => {
        if (!routine) return;

        await db
            .delete(routineExercises)
            .where(eq(routineExercises.routineId, routine.id));
        await db.delete(routines).where(eq(routines.id, routine.id));

        onRoutineDeleted(routine.id);
        bottomSheetRef.current?.close();
        };

const handleDuplicate = async (routineId: string) => {
  const routineWithExercises = await db.query.routines.findFirst({
    where: (r) => eq(r.id, routineId),
    with: {
      routineExercises: {
        with: {
          exercise: true,
          routineSets: true,
        },
      },
    },
  }) as {
    id: string;
    name: string;
    routineExercises: {
      exercise: {
        id: string;
        exercise_name: string;
        equipment: string;
        type: string;
        exercise_type: string | null;
      };
      routineSets: SetType[];
    }[];
  };

  if (!routineWithExercises) return;

  const selectedExercises = routineWithExercises.routineExercises.map((re) => ({
    id: re.exercise.id,
    exercise_name: re.exercise.exercise_name,
    equipment: re.exercise.equipment,
    type: re.exercise.type,
    exercise_type: re.exercise.exercise_type ?? null,
  }));

  const exerciseData = routineWithExercises.routineExercises.reduce((acc, re) => {
    acc[re.exercise.id] = {
      sets: re.routineSets.map((s) => ({
        id: s.id,
        reps: s.reps,
        weight: s.weight,
        unit: s.unit,
        set_type: s.set_type,
        rest_timer: s.rest_timer,
        notes: s.notes ?? "",
        completed: false,
      })),
    };
    return acc;
  }, {} as Record<string, { sets: SetType[] }>);

  router.push({
    pathname: "/createRoutine",
    params: {
      fromDuplicate: "true",
      routineName: routineWithExercises.name,
      selectedExercises: JSON.stringify(selectedExercises),
      exerciseData: JSON.stringify(exerciseData),
    },
  });

  bottomSheetRef.current?.close();
};


        const handleEdit = () => {
        if (!routine) return;
        router.push({ pathname: "/routine/edit/[id]", params: { id: routine.id } });
        bottomSheetRef.current?.close();
        };

        return (
        <CustomBottomSheet ref={bottomSheetRef} snapPoints={["35%"]}>
            <Box >
            {/* Header-style Title */}
            <Box 
                borderBottomWidth={1}
                borderColor="$trueGray700"
                pt="$1"
                pb="$3"
                mb="$4"
            >
                <Text color="$white" fontSize="$lg" fontWeight="$bold" textAlign="center">
                {routine?.name || "Routine Details"}
                </Text>
            </Box>

            <VStack space="md" px="$4" mb="$2">
                <Pressable onPress={() => handleDuplicate(routine?.id || "")}>
                <HStack alignItems="center" space="lg">
                    <Feather name="copy" size={18} color="white" />
                    <Text color="$white">Duplicate Routine</Text>
                </HStack>
                </Pressable>

                <Pressable onPress={handleEdit}>
                                <HStack alignItems="center" space="lg">

                    <Feather name="edit-2" size={18} color="white" />
                    <Text color="$white">Edit Routine</Text>
                </HStack>
                </Pressable>

                <Pressable onPress={handleDelete}>
                <HStack alignItems="center" space="lg">
                        <MaterialIcons name="clear" size={24} color="red" />

                    <Text color="$red500">Delete Routine</Text>
                </HStack>
                </Pressable>
            </VStack>
            </Box>
        </CustomBottomSheet>
        );
    }
    );

    export default WorkoutRoutineSheet