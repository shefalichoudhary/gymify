// components/routine/ExerciseBlock.tsx
import React from "react";
import { Box, Text, Input, InputField, Pressable, HStack } from "@gluestack-ui/themed";
import { Entypo } from "@expo/vector-icons";
import SetRow from "./setRow";
import AddSetButton from "./addSetButton";
import { Exercise } from "@/db/schema";

type Set = {
  lbs: string;
  reps: string;
  minReps?: number;
  maxReps?: number;
};

type Props = {
  exercise: Exercise;
  data: { notes: string; restTimer: boolean; sets: Set[] };
  onChange: (newData: { notes: string; restTimer: boolean; sets: Set[] }) => void;
  onOpenRepRange: (exerciseId: string, setIndex: number) => void;
    onHeaderPress: () => void;
};

export default function ExerciseBlock({ exercise, data, onChange, onOpenRepRange }: Props) {
  const handleSetChange = <T extends keyof Set>(index: number, key: T, value: Set[T]) => {
    const updatedSets = [...data.sets];
    updatedSets[index][key] = value;
    onChange({ ...data, sets: updatedSets });
  };

  const handleAddSet = () => {
    onChange({ ...data, sets: [...data.sets, { lbs: "", reps: "" }] });
  };

  return (
    <Box w="$full">
      <Text color="$blue500" fontWeight="bold" size="xl" pb="$2" ml="$1">
        {exercise.exercise_name}
      </Text>

      <Input borderStyle="none" borderWidth={0} size="md" mb="$4">
        <InputField
          placeholder="Add routine notes here"
          value={data.notes}
          onChangeText={(text) => onChange({ ...data, notes: text })}
          color="$white"
          placeholderTextColor="$coolGray400"
        />
      </Input>

      <Pressable onPress={() => onChange({ ...data, restTimer: !data.restTimer })}>
        <Text color="$blue500" mb="$4" ml="$1">
          ⏱ Rest Timer: {data.restTimer ? "ON" : "OFF"}
        </Text>
      </Pressable>

     <Pressable >
     <HStack mb="$1" p="$3" alignItems="center">
       <Box flex={1}>
         <Text color="$coolGray400" fontWeight="$medium">SET</Text>
       </Box>
       <Box flex={1}>
         <Text color="$coolGray400" fontWeight="$medium">LBS</Text>
       </Box>
       <Box flex={3}>
         <HStack alignItems="center" space="xs">
           <Text color="$coolGray400" fontWeight="$medium">REPS</Text>
           <Entypo name="chevron-down" size={16} color="gray" />
         </HStack>
       </Box>
     </HStack>
     
     </Pressable>

      {data.sets.map((set, index) => (
        <SetRow
          key={index}
          index={index}
          set={set}
          onChange={(key, value) => handleSetChange(index, key, value)}
        />
      ))}

      <AddSetButton onPress={handleAddSet} />
    </Box>
  );
}
