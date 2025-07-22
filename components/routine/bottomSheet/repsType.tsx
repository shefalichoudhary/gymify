// components/routine/bottomSheet/restTimer.tsx

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Text, Button, VStack,Box } from "@gluestack-ui/themed";
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

const RepsTypeSheet = forwardRef<RepsTypeSheetRef, RepsTypeSheetProps>(
  ({ onSelectRepsType }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

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
          bottomSheetRef.current?.close(); // Just in case on blur
        };
      }, [])
    );

    return (
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={["20%","25%"]}>
        <VStack space="md">
             <Box 
                                borderBottomWidth={1}
                                borderColor="$trueGray700"
                                pb="$3"
                                pt="$2"
                                mb="$4"
                              >
<Text fontSize="$lg" fontWeight="$bold" textAlign="center" color="white">
            Repetition Options
          </Text>
                              </Box>
          
          {["reps", "rep range"].map((reps: string) => (
            <Button
              key={reps}
              onPress={() => {
                onSelectRepsType(reps === "reps" ? "reps" : "rep range");
                bottomSheetRef.current?.close();
              }}
            >
              <Text color="white">{reps}</Text>
            </Button>
          ))}
        </VStack>
      </CustomBottomSheet>
    );
  }
);

export default RepsTypeSheet;
