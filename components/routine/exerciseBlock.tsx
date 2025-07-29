// components/routine/ExerciseBlock.tsx
import { Box, Text, Input, InputField, Pressable, HStack } from "@gluestack-ui/themed";
import { Entypo } from "@expo/vector-icons";
import SetRow from "./setRow";
import AddSetButton from "./addSetButton";
import { Exercise } from "@/db/schema";
import { WorkoutSet as Set } from "@/types/workoutSet";
import React from "react";
type Props = {
  exercise: {
    id: string;
    exercise_name: string;
    exercise_type: string | null;
    equipment: string;
    type: string;
    
  };
data: { notes: string; restTimer: boolean; restTimeInSeconds?: number; sets: Set[],  unit: "lbs" | "kg"; repsType: "reps" | "rep range"; };
 onChange: (
  newData: {
    notes: string;
    restTimer: boolean;
    restTimeInSeconds?: number;
    sets: Set[];
     unit: "lbs" | "kg";
    repsType: "reps" | "rep range"; // Add repsType to the data structure
  }
) => void;
onStartTimer?: () => void; // Optional, if you want to start a timer
  onOpenRepRange: (exerciseId: string, setIndex: number) => void;
  showCheckIcon?: boolean; 
   viewOnly?: boolean;
   onOpenWeight?: (exerciseId: string, ) => void;
onOpenRepsType?: (exerciseId: string) => void; // Optional, if you want to use a ref for the reps type sheet
  onOpenRestTimer: (exerciseId: string) => void;
  onToggleSetComplete: (exerciseId: string, setIndex: number, completed: boolean) => void;
};

export default function ExerciseBlock({ exercise, data, onChange, showCheckIcon, viewOnly , onOpenRestTimer, onOpenWeight,onOpenRepsType,onToggleSetComplete }: Props) {
 const handleSetChange = <T extends keyof Set>(index: number, key: T, value: Set[T]) => {
  const updatedSets = [...data.sets];
  updatedSets[index] = { ...updatedSets[index], [key]: value };
  onChange({ ...data, sets: updatedSets });
};

  const handleAddSet = () => {
    onChange({
      ...data,
      sets: [...data.sets, { weight: 0, reps: 0, isRangeReps: false }],
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
   <Pressable onPress={() => onOpenRestTimer(exercise.id)}>


          <Text size="md" color="$blue500" mb="$4" ml="$2">
            ⏱ Rest Timer: {data.restTimer ? `${data.restTimeInSeconds ?? 60}s` : "OFF"}
          </Text>
        </Pressable>
      )}

     <Pressable>
  <HStack px="$3" alignItems="center">
    <Box flex={1}>
      <Text size="xs" color="$coolGray400" fontWeight="$small">SET</Text>
    </Box>

    {showCheckIcon && (
      <Box flex={3} ml="$4" >
        <Text size="xs"  color="$coolGray400" fontWeight="$small" >PREVIOUS</Text>
      </Box>
    )}
  {!viewOnly && (
   <Pressable flex={showCheckIcon ? 2 : 1}     ml={showCheckIcon ? undefined : "$3"} onPress={() => onOpenWeight?.(exercise.id)}>
  <Text size="xs" color="$coolGray400" fontWeight="$small">
    {data.unit.toUpperCase()}
  </Text>
</Pressable>
    )}
      {!viewOnly && (
    <Pressable flex={showCheckIcon ? 4 : 1} onPress={() => onOpenRepsType?.(exercise.id)}>
      <HStack alignItems="center" space="xs">
        <Text size="xs" color="$coolGray400" fontWeight="$small">{data.repsType.toUpperCase()}</Text>
          <Entypo name="chevron-down" size={12} color="gray" />
      </HStack>
    </Pressable>
        )}

  </HStack>
</Pressable>


      {data.sets.map((set, index) => (
        <SetRow
          key={index}
          index={index}
            set={{ ...set, isRangeReps: data.repsType === "rep range" }}
          showCheckIcon={showCheckIcon}
          editable={!viewOnly}
         onChange={(key, value) => handleSetChange(index, key, value)}
onToggleCheck={(justCompleted) => onToggleSetComplete?.(exercise.id, index, justCompleted)}
        />
      ))}

      {!viewOnly && <AddSetButton onPress={handleAddSet} />}
     
    </Box>
    
  );
}
