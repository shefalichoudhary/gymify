// components/routine/SetRow.tsx
import React from "react";
import { Box, HStack, Input, InputField, Text } from "@gluestack-ui/themed";

type Set = {
  lbs: string;
  reps: string;
  minReps?: number;
  maxReps?: number;
};

type SetRowProps = {
  index: number;
  set: Set;
  onChange: (key: keyof Set, value: string | number | undefined) => void;
};

export default function SetRow({ index, set, onChange }: SetRowProps) {
  const isRange = set.minReps !== undefined || set.maxReps !== undefined;

  return (
    <HStack
      justifyContent="flex-start"
      bg={index % 2 === 0 ? "" : "#29282a"}
      p="$2"
      rounded="$md"
      mb="$1"
      ml="$1"
    >
      <Box flex={1}>
        <Text color="$white">{index + 1}</Text>
      </Box>
      <Box flex={1}>
        <Input size="sm" borderWidth={0}>
          <InputField
            placeholder="-"
            color="$white"
            value={set.lbs}
            onChangeText={(text) => onChange("lbs", text)}
          />
        </Input>
      </Box>
      <Box flex={3}>
        {isRange ? (
          <HStack space="sm" alignItems="center">
            <Input size="sm" borderWidth={0} w="45%">
              <InputField
                placeholder="-"
                keyboardType="numeric"
                color="$white"
                value={set.minReps !== undefined ? String(set.minReps) : ""}
                onChangeText={(text) =>
                  onChange("minReps", text ? parseInt(text, 10) : undefined)
                }
              />
            </Input>
            <Text color="$white">to</Text>
            <Input size="sm" borderWidth={0} w="45%">
              <InputField
                placeholder="-"
                keyboardType="numeric"
                color="$white"
                value={set.maxReps !== undefined ? String(set.maxReps) : ""}
                onChangeText={(text) =>
                  onChange("maxReps", text ? parseInt(text, 10) : undefined)
                }
              />
            </Input>
          </HStack>
        ) : (
          <Input size="sm" borderWidth={0}>
            <InputField
              placeholder="-"
              color="$white"
              value={set.reps}
              onChangeText={(text) => onChange("reps", text)}
            />
          </Input>
        )}
      </Box>
    </HStack>
  );
}
