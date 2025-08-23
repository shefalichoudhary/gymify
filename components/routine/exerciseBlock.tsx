import { Box, Text, Input, InputField, Pressable, HStack } from "@gluestack-ui/themed";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import SetRow from "./setRow";
import AddSetButton from "./addSetButton";
import { WorkoutSet as Set } from "@/types/workoutSet";
import React from "react";

type Props = {
  exercise: {
    id: string;
    exercise_name: string;
 exercise_type: string | null; // "Weighted", "Bodyweight", "Duration", etc
    equipment: string;
  };
  data: { notes: string; restTimer: number; sets: Set[]; unit: "lbs" | "kg"; repsType: "reps" | "rep range"; };
  onChange: (
    newData: { notes: string; restTime?: number; sets: Set[]; unit: "lbs" | "kg"; repsType: "reps" | "rep range"; }
  ) => void;
  onStartTimer?: () => void;
  onOpenRepRange: (exerciseId: string, setIndex: number) => void;
  showCheckIcon?: boolean;
  viewOnly?: boolean;
  onOpenWeight?: (exerciseId: string) => void;
  onOpenSetType: (exerciseId: string, setIndex?: number) => void;
  onOpenRepsType?: (exerciseId: string) => void;
  onOpenRestTimer: (exerciseId: string) => void;
  onToggleSetComplete: (exerciseId: string, setIndex: number, completed: boolean) => void;
};

export default function ExerciseBlock({
  exercise,
  data,
  onChange,
  showCheckIcon,
  viewOnly,
  onOpenRestTimer,
  onOpenWeight,
  onOpenRepsType,
  onToggleSetComplete,
  onOpenSetType
}: Props) {
  const handleSetChange = <T extends keyof Set>(index: number, key: T, value: Set[T]) => {
    const updatedSets = [...data.sets];
    updatedSets[index] = { ...updatedSets[index], [key]: value };
    onChange({ ...data, sets: updatedSets });
  };

 const handleAddSet = () => {
  let newSet: Set;

  if (isWeighted) {
    newSet = { weight: 0, reps: 0, isRangeReps: false };
  } else if (isBodyweight) {
    newSet = { reps: 0, isRangeReps: false };
  } else if (isDuration) {
    newSet = { duration: 0 };
  } else {
    newSet = {}; // fallback
  }

  onChange({ ...data, sets: [...data.sets, newSet] });
};
  const isDuration = exercise.exercise_type === "Duration" || exercise.exercise_type === "Yoga";
const isWeighted =
  exercise.exercise_type === "Weighted" ||
  exercise.exercise_type === "Assisted Bodyweight";
  const isBodyweight = exercise.exercise_type === "Bodyweight";

  return (
    <Box w="$full">
      <HStack alignItems="center" ml="$1">
        <Box w={42} h={42} borderRadius={30} bg="#1F1F1F" mr="$3" justifyContent="center" alignItems="center" />
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
            ⏱ Rest Timer: {data.restTimer ? `${data.restTimer}s` : "OFF"}
          </Text>
        </Pressable>
      )}

<Pressable>
  <HStack px="$3" alignItems="center">
    <Box flex={1}>
      <Text size="xs" color="$coolGray400" fontWeight="$small">SET</Text>
    </Box>

    {/* Weighted exercises → show PREVIOUS + KG/LBS + REPS */}
    { showCheckIcon && (
      <Box flex={3} ml="$2">
        <Text size="xs" color="$coolGray400" fontWeight="$small">PREVIOUS</Text>
      </Box>
    )}

    {isWeighted  && !isBodyweight && !viewOnly && (
      <Pressable flex={showCheckIcon ? 2 : 1} onPress={() => onOpenWeight?.(exercise.id)}>
        <Text size="xs" color="$coolGray400" fontWeight="$small">
          {data.unit.toUpperCase()}
        </Text>
      </Pressable>
    )}

  

    {(isWeighted  || isBodyweight) && !viewOnly &&(
  <Pressable
   flex={showCheckIcon ? (isWeighted ? 5 : 5) : 3}
    onPress={() => onOpenRepsType?.(exercise.id)}
  >
    <HStack alignItems="center" space="xs">
      <Text size="xs" color="$coolGray400" fontWeight="$small">
        {data.repsType.toUpperCase()}
      </Text>
      <AntDesign name="caretdown" size={10} color="gray" style={{ marginLeft: 2 }} />
    </HStack>
  </Pressable>
)}

    {/* Duration → show time */}
    {isDuration && (
      <Box flex={showCheckIcon ? 5 : 3} >
        <Text size="xs" color="$coolGray400" fontWeight="$small" >DURATION</Text>
      </Box>
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
          onOpenSetType={onOpenSetType}
          exerciseId={exercise.id}
          exerciseType={exercise.exercise_type ?? undefined}
          onToggleCheck={(justCompleted) => onToggleSetComplete?.(exercise.id, index, justCompleted)}
        />
      ))}

      {!viewOnly && <AddSetButton onPress={handleAddSet} />}
    </Box>
  );
}
