import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Text, Box, HStack, Pressable } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBottomSheet from "../../customBottomSheet";
import { useFocusEffect } from "@react-navigation/native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";

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
    const [selected, setSelected] = useState<number | null>(null);

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.snapToIndex(1),
      close: () => bottomSheetRef.current?.close(),
    }));

    useFocusEffect(
      React.useCallback(() => {
        bottomSheetRef.current?.close();
        return () => {
          bottomSheetRef.current?.close();
        };
      }, [])
    );

    const options = [
      { label: "Off", value: 0 },
      { label: "5s", value: 5 },

      { label: "10s", value: 10 },

      { label: "30s", value: 30 },
      { label: "45s", value: 45 },
      { label: "1 min", value: 60 },
      { label: "1.5 min", value: 90 },
      { label: "2 min", value: 120 },
    ];

    return (
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={["30%", "32%"]}>
        {/* Fixed Header */}
        <Box borderBottomWidth={1} borderColor="$trueGray700" pb="$3" mb="$4">
          <Text fontSize="$lg" fontWeight="$bold" textAlign="center" color="white">
            Rest Timer
          </Text>
        </Box>

        {/* Scrollable List */}
        <BottomSheetScrollView
          contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <HStack flexWrap="wrap" space="sm">
            {options.map((opt) => {
              const isActive = selected === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setSelected(opt.value);
                    onSelectDuration(opt.value);
                    bottomSheetRef.current?.close();
                  }}
                  bg={isActive ? "$primary600" : "#2a2a2a"}
                  px="$4"
                  py="$1.5"
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
        </BottomSheetScrollView>
      </CustomBottomSheet>
    );
  }
);

export default RestTimerSheet;
