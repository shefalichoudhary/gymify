import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Text, Box, HStack, Pressable } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBottomSheet from "./customBottomSheet";
import * as Haptics from "expo-haptics";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

export type SetTypeSheetRef = {
  open: () => void;
  close: () => void;
};

interface SetType {
  key: "W" | "Normal" | "D" | "F" | "REMOVE";
  label: string;
  icon: React.ReactNode;
}

interface Props {
  selectedType: string;
  onSelect: (type: SetType["key"]) => void;
}

const setTypes: SetType[] = [
  { key: "W", label: "Warm-Up Set", icon: <Text color="$yellow400">W</Text> },
  { key: "Normal", label: "Normal Set", icon: <Text color="$white">N</Text> },
  { key: "D", label: "Drop Set", icon: <Text color="$blue400">D</Text> },
  { key: "F", label: "Failure", icon: <Text color="$red500">F</Text> },
  { key: "REMOVE", label: "Remove Set", icon: <Ionicons name="close" size={20} color="red" /> }, // ❌
];

const SetTypeSheet = forwardRef<SetTypeSheetRef, Props>(({ selectedType, onSelect }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selected, setSelected] = useState<string>(selectedType);

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(1),
    close: () => bottomSheetRef.current?.close(),
  }));

  return (
    <CustomBottomSheet ref={bottomSheetRef} snapPoints={["20%", "35%"]}>
      <Box borderBottomWidth={1} borderColor="$trueGray700" pb="$3" pt="$2" mb="$4">
        <Text fontSize="$lg" fontWeight="$bold" textAlign="center" color="white">
          Select Set Type
        </Text>
      </Box>

      <BottomSheetScrollView contentContainerStyle={{ padding: 12, paddingBottom: 30 }}>
        <HStack flexWrap="wrap" space="sm">
          {setTypes.map((type) => {
            const isActive = selected === type.key;
            return (
              <Pressable
                key={type.key}
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setSelected(type.key);
                  onSelect(type.key);
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
                <HStack alignItems="center" space="sm">
                  {type.icon}
                  <Text fontWeight="$medium" color={isActive ? "white" : "$trueGray400"}>
                    {type.label}
                  </Text>
                </HStack>
              </Pressable>
            );
          })}
        </HStack>
      </BottomSheetScrollView>
    </CustomBottomSheet>
  );
});

export default SetTypeSheet;
