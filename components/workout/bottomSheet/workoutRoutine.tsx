import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Box, VStack, HStack, Text } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import { Pressable } from "@/components/ui/pressable";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import CustomBottomSheet from "@/components/routine/bottomSheet/customBottomSheet";
import { routineExercises, routines } from "@/db/schema";
import ConfirmDialog from "@/components/confirmDialog"; // 👈 import confirm dialog

export type WorkoutRoutineSheetRef = {
  open: (routine: Routine) => void;
  close: () => void;
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
  onSheetChange?: (open: boolean) => void;
};

const WorkoutRoutineSheet = forwardRef<WorkoutRoutineSheetRef, Props>(
  ({ onRoutineDeleted, onSheetChange }, ref) => {
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [showConfirm, setShowConfirm] = useState(false); // 👈 confirm dialog state

    useImperativeHandle(ref, () => ({
      open: (routine: Routine) => {
        setRoutine(routine);
        bottomSheetRef.current?.snapToIndex(0);
        onSheetChange?.(true);
      },
      close: () => {
        bottomSheetRef.current?.close();
        onSheetChange?.(false);
      },
    }));

    const handleDeleteConfirmed = async () => {
      if (!routine) return;

      // delete exercises first
      await db.delete(routineExercises).where(eq(routineExercises.routineId, routine.id));

      // delete routine
      await db.delete(routines).where(eq(routines.id, routine.id));

      onRoutineDeleted(routine.id);

      setShowConfirm(false);
      bottomSheetRef.current?.close();
    };

    const handleDuplicate = () => {
      if (!routine) return;
      router.push({
        pathname: "/createRoutine",
        params: { id: routine.id, duplicate: "true" },
      });
      bottomSheetRef.current?.close();
    };

    const handleEdit = () => {
      if (!routine) return;
      router.push({
        pathname: "/routine/edit/[id]",
        params: { id: routine.id },
      });
      bottomSheetRef.current?.close();
    };

    return (
      <>
        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={["35%"]}
          onChange={(index: number) => onSheetChange?.(index >= 0)}
        >
          <Box>
            {/* Header */}
            <Box borderBottomWidth={1} borderColor="$trueGray700" pt="$2" pb="$3" mb="$4">
              <Text color="$white" fontSize="$lg" fontWeight="$bold" textAlign="center">
                {routine?.name || "Routine Details"}
              </Text>
            </Box>

            <VStack space="xl" px="$6">
              {/* Duplicate */}
              <Pressable onPress={handleDuplicate}>
                <HStack alignItems="center" space="lg">
                  <Feather name="copy" size={18} color="white" />
                  <Text color="$white">Duplicate Routine</Text>
                </HStack>
              </Pressable>

              {/* Edit */}
              <Pressable onPress={handleEdit}>
                <HStack alignItems="center" space="lg">
                  <Feather name="edit-2" size={18} color="white" />
                  <Text color="$white">Edit Routine</Text>
                </HStack>
              </Pressable>

              {/* Delete */}
              <Pressable
                onPress={() => {
                  bottomSheetRef.current?.close();
                  // wait a bit for sheet close animation before showing dialog
                  setTimeout(() => setShowConfirm(true), 100);
                }}
              >
                <HStack alignItems="center" space="lg">
                  <MaterialIcons name="clear" size={24} color="red" />
                  <Text color="$red500">Delete Routine</Text>
                </HStack>
              </Pressable>
            </VStack>
          </Box>
        </CustomBottomSheet>

        {/* ConfirmDialog for delete */}
        <ConfirmDialog
          visible={showConfirm}
          message={`Are you sure you want to delete "${routine?.name}" routine.`}
          confirmText="Delete"
          cancelText="Cancel"
          destructive
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setShowConfirm(false)}
        />
      </>
    );
  }
);

export default WorkoutRoutineSheet;
