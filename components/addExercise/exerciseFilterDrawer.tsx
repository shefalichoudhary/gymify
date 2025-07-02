import React, { useRef, useMemo, useCallback } from "react";
import { HStack, Button, Text } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";

export default function ExerciseFilterDrawer() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%"], []);

  const openSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <>
      <HStack space="md" mb="$4" px="$4" justifyContent="space-between">
        <Button onPress={openSheet} flex={1} bg="#29282a" borderRadius="$lg" px="$4">
          <Text color="$white">All Equipment</Text>
        </Button>
        <Button onPress={openSheet} flex={1} bg="#29282a" borderRadius="$lg" px="$4">
          <Text color="$white" fontWeight="$medium">All Muscles</Text>
        </Button>
      </HStack>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "#1a1a1a" }}
        handleIndicatorStyle={{ backgroundColor: "#888" }}
      >
        <Text px="$4" py="$4" color="$white">
          Equipment Filter Options Go Here...
        </Text>
      </BottomSheet>
    </>
  );
}
