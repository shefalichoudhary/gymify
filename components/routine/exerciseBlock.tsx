// components/routine/ExerciseBlock.tsx
import React from "react";
import { Box, Text, Input, InputField, Pressable, HStack } from "@gluestack-ui/themed";
import { Entypo } from "@expo/vector-icons";
import SetRow from "./setRow";
import AddSetButton from "./addSetButton";
import { Exercise } from "@/db/schema";
import { WorkoutSet as Set } from "@/types/workoutSet";


type Props = {
  exercise: Exercise;
  data: { notes: string; restTimer: boolean; sets: Set[] };
  onChange: (newData: { notes: string; restTimer: boolean; sets: Set[] }) => void;
  onOpenRepRange: (exerciseId: string, setIndex: number) => void;
    onHeaderPress: () => void;
  showCheckIcon?: boolean; 
   viewOnly?: boolean;

};

export default function ExerciseBlock({ exercise, data, onChange, showCheckIcon, viewOnly }: Props) {
 const handleSetChange = <T extends keyof Set>(index: number, key: T, value: Set[T]) => {
  const updatedSets = [...data.sets];
  updatedSets[index] = { ...updatedSets[index], [key]: value };
  onChange({ ...data, sets: updatedSets });
};
  const handleAddSet = () => {
    onChange({
      ...data,
      sets: [...data.sets, { lbs: 0, reps: 0, isRangeReps: false }],
    });
  };

  return (
    <Box w="$full">
      <HStack alignItems="center" ml="$1">
        <Box
          w={42}
          h={42}
          borderRadius={30}
          bg="#1F1F1F"
          mr="$3"
          justifyContent="center"
          alignItems="center"
        >
          {/* Optional icon or initials */}
        </Box>
        <Text color="$blue500" fontSize="$lg" fontWeight="$medium">
          {exercise.exercise_name}
        </Text>
      </HStack>

      {!viewOnly && (
        <Input borderStyle="none" borderWidth={0} size="md" mb="$2">
          <InputField
            placeholder="Add routine notes here"
            value={data.notes}
            onChangeText={(text) => onChange({ ...data, notes: text })}
            color="$white"
            placeholderTextColor="$coolGray400"
          />
        </Input>
      )}

      {!viewOnly && (
        <Pressable onPress={() => onChange({ ...data, restTimer: !data.restTimer })}>
          <Text size="md" color="$blue500" mb="$4" ml="$2">
            ⏱ Rest Timer: {data.restTimer ? "ON" : "OFF"}
          </Text>
        </Pressable>
      )}

     <Pressable>
  <HStack px="$3" alignItems="center">
    <Box flex={1}>
      <Text size="xs" color="$coolGray400" fontWeight="$small">SET</Text>
    </Box>

    {showCheckIcon && (
      <Box flex={3}>
        <Text size="xs" mr="$2" color="$coolGray400" fontWeight="$small">PREVIOUS</Text>
      </Box>
    )}

    <Box flex={2}>
      <Text size="xs" color="$coolGray400" fontWeight="$small">LBS</Text>
    </Box>

    <Box flex={4}>
      <HStack alignItems="center" space="xs">
        <Text size="xs" color="$coolGray400" fontWeight="$small">REPS</Text>
        {!viewOnly && (
          <Entypo name="chevron-down" size={12} color="gray" />
        )}
      </HStack>
    </Box>
  </HStack>
</Pressable>


      {data.sets.map((set, index) => (
        <SetRow
          key={index}
          index={index}
          set={set}
          showCheckIcon={showCheckIcon}
          editable={!viewOnly}
         onChange={(key, value) => handleSetChange(index, key, value)}
        />
      ))}

      {!viewOnly && <AddSetButton onPress={handleAddSet} />}
    </Box>
  );
}
