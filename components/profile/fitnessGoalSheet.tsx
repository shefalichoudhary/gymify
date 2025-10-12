import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { VStack, Box, Text, HStack, Pressable } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBottomSheet from "../customBottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";

export type FitnessGoalSheetRef = {
  open: () => void;
  close: () => void;
};

type FitnessGoalSheetProps = {
  onSelectGoal: (goal: string) => void;
};

const FitnessGoalSheet = forwardRef<FitnessGoalSheetRef, FitnessGoalSheetProps>(
  ({ onSelectGoal }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [selected, setSelected] = useState<string>("");

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.snapToIndex(0),
      close: () => bottomSheetRef.current?.close(),
    }));

    const goals = [
      "Lose Weight",
      "Lose Fat",
      "Build Muscle",
      "Stay Fit",
      "Increase Strength",
      "Improve Endurance",
    ];

    return (
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={["50%", "60%"]}>
        <Box borderBottomWidth={1} borderColor="$trueGray700" pb="$3" pt="$2" mb="$4">
          <Text fontSize="$lg" fontWeight="$bold" textAlign="center" color="white">
            Select Fitness Goal
          </Text>
        </Box>

        <BottomSheetScrollView
          contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <HStack flexWrap="wrap" space="sm">
            {goals.map((goal) => {
              const isActive = selected === goal;
              return (
                <Pressable
                  key={goal}
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setSelected(goal);
                    onSelectGoal(goal);
                    bottomSheetRef.current?.close();
                  }}
                  bg={isActive ? "$primary600" : "#2a2a2a"}
                  px="$4"
                  py="$2"
                  borderRadius="$full"
                  borderWidth={1}
                  borderColor={isActive ? "$primary600" : "$trueGray700"}
                  m="$1"
                >
                  <Text color="white" fontWeight="$medium">
                    {goal}
                  </Text>
                </Pressable>
              );
            })}
          </HStack>
        </BottomSheetScrollView>
      </CustomBottomSheet>
    );
  }
);

export default FitnessGoalSheet;
