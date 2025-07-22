// components/routine/bottomSheet/restTimer.tsx

import React, { forwardRef, useImperativeHandle, useRef, } from "react";
import { Text, Button, VStack,Box } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBottomSheet from "./customBottomSheet";
import { useFocusEffect } from "@react-navigation/native";

export type RestTimerSheetRef = {
  open: () => void;
  close: () => void;
};

type RestTimerSheetProps = {
  onSelectDuration: (duration: number) => void;
};

const RestTimerSheet = forwardRef<RestTimerSheetRef, RestTimerSheetProps>(
  ({ onSelectDuration }, ref) => {
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
      <CustomBottomSheet ref={bottomSheetRef}  snapPoints={["20%","50%"]}>
        <VStack space="md">
         
          <Box 
                      borderBottomWidth={1}
                      borderColor="$trueGray700"
                      pb="$3"
                      pt="$2"
                      mb="$4"
                    >
                       <Text fontSize="$lg" fontWeight="$bold" textAlign="center" color="white">
             Rest Timer
          </Text>
                    </Box>
          {[5, 15,  30, 60, 90, 120].map((duration) => (
            <Button
              key={duration}
              onPress={() => {
                onSelectDuration(duration);
                bottomSheetRef.current?.close();
              }}
            >
              <Text color="white">{duration} seconds</Text>
            </Button>
          ))}
        </VStack>
      </CustomBottomSheet>
    );
  }
);

export default RestTimerSheet;
