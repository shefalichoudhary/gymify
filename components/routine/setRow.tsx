// components/routine/SetRow.tsx
import React,{useState} from "react";
import { Box, HStack, Input, InputField, Text,Pressable } from "@gluestack-ui/themed";
import { AntDesign } from "@expo/vector-icons";
import { WorkoutSet as Set } from "@/types/workoutSet";




type SetRowProps = {
  index: number;
  set: Set;
   showCheckIcon?: boolean; 
  onChange: <K extends keyof Set>(key: K, value: Set[K]) => void;
    editable?: boolean; 
};

export default function SetRow({ index, set, onChange,showCheckIcon }: SetRowProps) {
  if (!set) return null; 
const [isManuallyCompleted, setIsManuallyCompleted] = useState(set.isCompleted || false);

  const isSetFilled = () => {
    if (set.isRangeReps) {
      return !!set.lbs && !!set.minReps && !!set.maxReps;
    }
    return !!set.lbs && !!set.reps;
  };

const handleCheckPress = () => {
  if (isSetFilled()) {
    const newValue = !isManuallyCompleted;
    setIsManuallyCompleted(newValue);
    onChange("isCompleted", newValue); // ✅ pass up to parent
  }
};

  return (
      <Box
      bg={index % 2 !== 0 ? "#1F1F1F" : "transparent"}
      py="$1"
      mb="$1"
    >
      <HStack justifyContent="flex-start" alignItems="center"  px="$4">
        {/* Set number */}
        <Box flex={1} mt="$2">
          <Text color="$white">{index + 1}</Text>
        </Box>

{showCheckIcon && (
  <Box mt="$1" flex={3}>
    <Text color="$coolGray400" fontSize="$xs">
      {set.isRangeReps
      ? `${set.previousLbs ?? "-"} kg x ${set.previousMinReps ?? "-"}–${set.previousMaxReps ?? "-"}`
        : `${set.previousLbs ?? "-"} kg x ${set.previousReps ?? "-"}`}
    </Text>
  </Box>
)}



      {/* LBS input */}
      <Box flex={2}>
        <Input size="sm" borderWidth={0}>
          <InputField
            placeholder="-"
            keyboardType="numeric"
            color="$white"
            value={set.lbs.toString()}
            onChangeText={(text) =>
              onChange("lbs", text ? parseFloat(text) || 0 : 0)
            }
          />
        </Input>
      </Box>

      {/* Reps or Rep Range */}
      {/* Reps or Rep Range + Icon */}
<Box flex={4}>
  <HStack alignItems="center" space="sm">
    {/* Reps or Range */}
    {set.isRangeReps ? (
      <HStack space="sm" alignItems="center" flex={1}>
        <Input size="sm" borderWidth={0} w="40%">
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
        <Text color="$white">to</Text>
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
      <Input size="sm" borderWidth={0} flex={1}>
        <InputField
          placeholder="-"
          keyboardType="numeric"
          color="$white"
          value={set.reps.toString()}
          onChangeText={(text) =>
            onChange("reps", text ? parseInt(text, 10) || 0 : 0)
          }
        />
      </Input>
    )}
   

    {/* Check Icon */}
    {showCheckIcon && (
      <Pressable
        onPress={handleCheckPress}
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
              : isManuallyCompleted
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
