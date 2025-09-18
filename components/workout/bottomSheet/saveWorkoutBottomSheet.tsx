import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Box, Text, HStack, Pressable, VStack } from "@gluestack-ui/themed";
import CustomBottomSheet from "../../routine/bottomSheet/customBottomSheet";

export type SaveWorkoutSheetRef = {
  open: (
    workoutTitle: string,
    addedCount: number,
    onUpdate: () => void,
    onKeepOriginal?: () => void
  ) => void;
  close: () => void;
};

type SaveWorkoutSheetProps = {};

const SaveWorkoutSheet = forwardRef<SaveWorkoutSheetRef, SaveWorkoutSheetProps>((props, ref) => {
  const bottomSheetRef = useRef<any>(null);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [addedCount, setAddedCount] = useState(0);
  const [onUpdate, setOnUpdate] = useState<() => void>(() => () => {});
  const [onKeepOriginal, setOnKeepOriginal] = useState<() => void>(() => () => {});

  useImperativeHandle(ref, () => ({
    open: (title, count, updateCallback, keepOriginalCallback) => {
      setWorkoutTitle(title);
      setAddedCount(count);
      setOnUpdate(() => updateCallback);
      setOnKeepOriginal(() => keepOriginalCallback || (() => bottomSheetRef.current?.close()));
      bottomSheetRef.current?.snapToIndex(0);
    },
    close: () => bottomSheetRef.current?.close(),
  }));

  return (
    <CustomBottomSheet ref={bottomSheetRef} snapPoints={["30%", "32%"]}>
      <VStack flex={1} px="$4" justifyContent="center" space="sm" mb="$6">
        {/* Workout Title */}
        <Text color="$white" fontWeight="$bold" fontSize="$lg" textAlign="center">
          {workoutTitle}
        </Text>

        {/* Message */}
        <Text color="$white" textAlign="center">
          {`You added ${addedCount} ${addedCount > 1 ? "exercises" : "exercise"} to this routine.`}
        </Text>

        {/* Buttons Row */}
       <VStack mt="$4" space="md">
          <Pressable onPress={onKeepOriginal}>
            <Box
              bg="$coolGray600"
              py="$3"
              borderRadius="$md"
              alignItems="center"
            >
              <Text color="$white" fontWeight="$medium">Keep Original Routine</Text>
            </Box>
          </Pressable>

          <Pressable onPress={onUpdate}>
            <Box
              bg="$blue500"
              py="$3"
              borderRadius="$md"
              alignItems="center"
            >
              <Text color="$white" fontWeight="$medium">Update Routine</Text>
            </Box>
          </Pressable>
        </VStack>
      </VStack>
    </CustomBottomSheet>
  );
});
export default SaveWorkoutSheet;
