import React from "react";
import {
  Box,
  HStack,
  Input,
  InputField,
  Text,
  Pressable,
} from "@gluestack-ui/themed";
import { AntDesign } from "@expo/vector-icons";
import { WorkoutSet as Set } from "@/types/workoutSet";
import { Vibration } from "react-native";

type SetRowProps = {
  index: number;
  set: Set;
  showCheckIcon?: boolean;
  onChange: <K extends keyof Set>(key: K, value: Set[K]) => void;
  editable?: boolean;
};

export default function SetRow({ index, set, onChange, showCheckIcon }: SetRowProps) {
  if (!set) return null;

const isSetFilled = () => {
  if (set.isRangeReps) {
    return !!set.weight && !!set.minReps && !!set.maxReps;
  }
  return !!set.weight && !!set.reps;
};

  const handleCheckPress = () => {
    if (isSetFilled()) {
      const newValue = !set.isCompleted;
      onChange("isCompleted", newValue); // Update parent state
      Vibration.vibrate(60);
    }
  };

  return (
    <Box
      bg={index % 2 !== 0 ? "#1F1F1F" : "transparent"}
      py="$1"
      mb="$1"
    >
      <HStack justifyContent="flex-start" alignItems="center" px="$4">
        {/* Set number */}
        <Box flex={1} mt="$2">
          <Text color="$white">{index + 1}</Text>
        </Box>
 {showCheckIcon && (
    <Box mt="$1" flex={3} alignItems="center">
      <Text color="$coolGray400" fontSize="$xs">
        {set.isRangeReps
          ? set.previousWeight !== undefined &&
            set.previousMinReps !== undefined &&
            set.previousMaxReps !== undefined
            ? `${set.previousWeight} kg x ${set.previousMinReps}–${set.previousMaxReps}`
            : "-"
          : set.previousWeight !== undefined && set.previousReps !== undefined
            ? `${set.previousWeight} kg x ${set.previousReps}`
            : "-"}
      </Text>
    </Box>
  )}


        {/* weight input */}
       <Box flex={showCheckIcon ? 2 : 1}>
          <Input size="sm" borderWidth={0}>
           <InputField
  placeholder="-"
  keyboardType="numeric"
  color="$white"
  value={set.weight ? set.weight.toString() : ""}
onChangeText={(text) =>
  onChange("weight", text ? parseInt(text, 10) : 0)
}
 
/>
          </Input>
        </Box>

        {/* Reps or Rep Range */}
      <Box flex={showCheckIcon ? 4 : 1}>
          <HStack alignItems="center" space="sm">
            {set.isRangeReps ? (
              <HStack space="sm" alignItems="center" flex={1}>
                <Input size="sm" borderWidth={0} w="30%">
                  <InputField
                    placeholder="-"
                    keyboardType="numeric"
                    color="$white"
                    value={set.minReps?.toString() ?? ""}
                    onChangeText={(text) =>
                      onChange("minReps", text ? parseInt(text, 10) || 0 : undefined)
                    }
                  />
                </Input>
                <Text color="$white" >to</Text>
                <Input size="sm" borderWidth={0} w="40%">
                  <InputField
                    placeholder="-"
                    keyboardType="numeric"
                    color="$white"
                    value={set.maxReps?.toString() ?? ""}
                    onChangeText={(text) =>
                      onChange("maxReps", text ? parseInt(text, 10) || 0 : undefined)
                    }
                  />
                </Input>
              </HStack>
            ) : (
                <Input size="sm" borderWidth={0} w="40%">
                  <InputField
                    placeholder="-"
                    keyboardType="numeric"
                    color="$white"
                    value={set.reps?.toString() ?? ""}
                    onChangeText={(text) =>
                      onChange("reps", text ? parseInt(text, 10) || 0 : undefined)
                    }
                  />
                </Input>

            )}

            {/* Check Icon */}
            {showCheckIcon && (
              <Pressable
                onPress={() => {
                  handleCheckPress();
                }}
                disabled={!isSetFilled()}
                ml="$2"
                alignItems="center"
                justifyContent="center"
              >
                <AntDesign
                  name="checkcircle"
                  size={20}
                  color={
                    !isSetFilled()
                      ? "#888"
                      : set.isCompleted
                      ? "#22c55e"
                      : "#888"
                  }
                />
              </Pressable>
            )}
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
}
