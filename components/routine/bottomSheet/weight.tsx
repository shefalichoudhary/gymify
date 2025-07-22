// components/routine/bottomSheet/restTimer.tsx

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Text, Button, VStack ,Box} from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBottomSheet from "./customBottomSheet";
import { useFocusEffect } from "expo-router";

export type WeightSheetRef = {
  open: () => void;
  close: () => void;
};

type WeightSheetProps = {
  onSelectWeight: (weight: string) => void;
};

const WeightSheet = forwardRef<WeightSheetRef, WeightSheetProps>(
  ({ onSelectWeight }, ref) => {
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
      <CustomBottomSheet ref={bottomSheetRef}  snapPoints={["20%", "25%"]}>
        <VStack space="md">
          <Box 
            borderBottomWidth={1}
            borderColor="$trueGray700"
            pb="$3"
            pt="$2"
            mb="$4"
          >
            <Text fontSize="$lg" fontWeight="$bold" textAlign="center" color="$white">
              Weight Units
            </Text>
          </Box>
          {["lbs", "kg"].map((weight: string) => (
            <Button
              key={weight}
              onPress={() => {
                onSelectWeight(weight);
                bottomSheetRef.current?.close();
              }}
            >
              <Text color="white">{weight}</Text>
            </Button>
          ))}
        </VStack>
      </CustomBottomSheet>
    );
  }
);

export default WeightSheet;
