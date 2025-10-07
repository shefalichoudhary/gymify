import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Text, Box, HStack, Pressable, VStack } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBottomSheet from "./customBottomSheet";
import { useFocusEffect } from "expo-router";

export type RepsTypeSheetRef = {
  open: () => void;
  close: () => void;
};

type RepsTypeSheetProps = {
  onSelectRepsType: (repsType: "reps" | "rep range") => void;
};

const options = [
  { label: "Reps", value: "reps" },
  { label: "Rep Range", value: "rep range" },
];

const RepsTypeSheet = forwardRef<RepsTypeSheetRef, RepsTypeSheetProps>(
  ({ onSelectRepsType }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [selected, setSelected] = useState<"reps" | "rep range" | null>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.snapToIndex(1);
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    useFocusEffect(
      React.useCallback(() => {
        bottomSheetRef.current?.close();
        return () => {
          bottomSheetRef.current?.close();
        };
      }, [])
    );

    return (
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={["20%", "20%"]}>
        <Box borderBottomWidth={1} borderColor="$trueGray700" pb="$3" pt="$2" mb="$4">
          <Text fontSize="$lg" fontWeight="$bold" textAlign="center" color="white">
            Repetition Options
          </Text>
        </Box>
        <HStack flexWrap="wrap" space="sm" px="$2">
          {options.map((opt) => {
            const isActive = selected === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  setSelected(opt.value as "reps" | "rep range");
                  onSelectRepsType(opt.value as "reps" | "rep range");
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
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </HStack>
      </CustomBottomSheet>
    );
  }
);

export default RepsTypeSheet;
