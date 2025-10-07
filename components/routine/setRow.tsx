import React, { useState, useEffect, useRef } from "react";
import { Box, HStack, Input, InputField, Text, Pressable } from "@gluestack-ui/themed";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { WorkoutSet as Set } from "@/types/workoutSet";
import { Vibration } from "react-native";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { workoutSets } from "@/db/schema";
import { getExerciseTypeFlags } from "@/utils/exerciseType";
import DurationTimer, { DurationTimerRef } from "@/utils/durationTimer";
type SetRowProps = {
  index: number;
  set: Set;
  exerciseId: string;
  showCheckIcon?: boolean;
  onChange: <K extends keyof Set>(key: K, value: Set[K]) => void;
  editable?: boolean;
  onOpenSetType: (exerciseId: string, setIndex: number) => void;
  onToggleCheck: (completed: boolean) => void;
  onShowDialog?: (message: string) => void;
  exerciseType?: "Weighted" | "Bodyweight" | "Duration" | "Yoga" | string | null;
};

export default function SetRow({
  index,
  set,
  onChange,
  showCheckIcon,
  onToggleCheck,
  onOpenSetType,
  exerciseId,
  exerciseType,
}: SetRowProps) {
  if (!set) return null;

  const [previousValues, setPreviousValues] = useState<{
    weight?: number;
    reps?: number;
    minReps?: number;
    maxReps?: number;
    duration?: number;
  }>({});

  const { isDuration, isWeighted, isBodyweight } = getExerciseTypeFlags(exerciseType ?? null);
  const durationTimerRef = useRef<DurationTimerRef>(null);

  useEffect(() => {
    async function fetchHistory() {
      const sets = await getPreviousSets(exerciseId);
      if (sets.length > 0) {
        const lastSet = sets[0];
        setPreviousValues({
          weight: lastSet.weight ?? undefined,
          reps: lastSet.reps ?? undefined,
          minReps: lastSet.minReps ?? undefined,
          maxReps: lastSet.maxReps ?? undefined,
          duration: lastSet.duration ?? undefined,
        });
      }
    }
    fetchHistory();
  }, [exerciseId]);

  const handleCheckPress = () => {
    if (!set.isCompleted) {
      durationTimerRef.current?.stopTimer();
    }
    const newValue = !set.isCompleted;
    onChange("isCompleted", newValue);
    onToggleCheck(newValue);
    Vibration.vibrate([0, 200, 100, 200], false);
  };

  const formatTime = (secs?: number) => {
    if (secs == null) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getSetTypeColor = (type?: string) => {
    switch (type) {
      case "W":
        return "#facc15";
      case "D":
        return "#3b82f6";
      case "F":
        return "#ef4444";
      default:
        return "#fff";
    }
  };
  const placeholderWeight = set.weight ?? set.previousWeight ?? previousValues.weight;

  const placeholderReps = set.reps ?? set.previousReps ?? previousValues.reps;

  const placeholderMinReps = set.minReps ?? set.previousMinReps ?? previousValues.minReps;

  const placeholderMaxReps = set.maxReps ?? set.previousMaxReps ?? previousValues.maxReps;

  const placeholderDuration = set.duration ?? set.previousDuration ?? previousValues.duration;

  async function getPreviousSets(exerciseId: string) {
    return await db
      .select()
      .from(workoutSets)
      .where(eq(workoutSets.exerciseId, exerciseId))
      .limit(1);
  }

  // --- Shared reps input for Weighted & Bodyweight
  const renderRepsInput = () => (
    <Box flex={showCheckIcon ? 6 : 4}>
      <HStack alignItems="center" space="sm" ml="$4">
        {set.isRangeReps ? (
          <HStack alignItems="center" flex={1}>
            <Input size="sm" borderWidth={0} w="25%">
              <InputField
                placeholder={placeholderMinReps?.toString() ?? "-"}
                keyboardType="numeric"
                color="$white"
                value={set.minReps != null ? set.minReps.toString() : undefined}
                onChangeText={(text) =>
                  onChange("minReps", text ? parseInt(text, 10) || 0 : undefined)
                }
              />
            </Input>
            <Text color="$white">to</Text>
            <Input size="sm" borderWidth={0} w="30%">
              <InputField
                placeholder={placeholderMaxReps?.toString() ?? "-"}
                keyboardType="numeric"
                color="$white"
                value={set.maxReps != null ? set.maxReps.toString() : undefined}
                onChangeText={(text) =>
                  onChange("maxReps", text ? parseInt(text, 10) || 0 : undefined)
                }
              />
            </Input>
          </HStack>
        ) : (
          <Input size="sm" borderWidth={0} w="32%" ml="$2">
            <InputField
              placeholder={placeholderReps?.toString() ?? "-"}
              keyboardType="numeric"
              color="$white"
              value={set.reps != null ? set.reps.toString() : undefined}
              onChangeText={(text) => onChange("reps", text ? parseInt(text, 10) || 0 : undefined)}
            />
          </Input>
        )}
      </HStack>
    </Box>
  );

  return (
    <Box bg={index % 2 !== 0 ? "#1F1F1F" : "transparent"} py="$1" mb="$1">
      <HStack justifyContent="flex-start" alignItems="center" px="$4">
        {/* Set number / type */}
        <Box flex={showCheckIcon ? 2 : 1} mt="$2">
          <Pressable onPress={() => onOpenSetType(exerciseId, index)}>
            <Text color={getSetTypeColor(set.setType)}>
              {set.setType && set.setType !== "Normal" ? set.setType : `${index + 1}`}
            </Text>
          </Pressable>
        </Box>

        {/* Weighted = weight + reps */}
        {isWeighted && (
          <>
            <Box flex={showCheckIcon ? 2 : 1}>
              <Input size="sm" borderWidth={0}>
                <InputField
                  placeholderTextColor={"$coolGray400"}
                  placeholder={placeholderWeight?.toString() ?? "-"}
                  keyboardType="numeric"
                  color="$white"
                  value={set.weight != null ? set.weight.toString() : undefined}
                  onChangeText={(text) =>
                    onChange("weight", text ? parseInt(text, 10) || 0 : undefined)
                  }
                />
              </Input>
            </Box>
            {renderRepsInput()}
          </>
        )}

        {/* Bodyweight = just reps */}
        {isBodyweight && renderRepsInput()}

        {/* Duration = secs */}
        {isDuration && (
          <Box flex={6} position="relative">
            {!set.isCompleted && showCheckIcon && (
              <Box
                position="absolute"
                left={38}
                top={0}
                bottom={0}
                justifyContent="center"
                zIndex={1}
              >
                <DurationTimer
                  ref={durationTimerRef}
                  duration={set.duration ?? 0} // parent-controlled
                  onChange={(val) => onChange("duration", val)}
                />
              </Box>
            )}

            <Box alignItems="center">
              <Input size="sm" borderWidth={0} w={100}>
                <InputField
                  placeholder={
                    placeholderDuration != null ? formatTime(placeholderDuration) : "00:00"
                  }
                  keyboardType="numeric"
                  color="$white"
                  textAlign="center"
                  value={set.duration != null ? formatTime(set.duration) : undefined}
                  onChangeText={(text) => {
                    const parts = text.split(":");
                    let val: number | undefined;
                    if (parts.length === 2) {
                      val = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
                    } else {
                      val = text ? parseInt(text, 10) || 0 : undefined;
                    }
                    onChange("duration", val ?? 0);
                  }}
                />
              </Input>
            </Box>
          </Box>
        )}

        {/* ✅ Check Icon */}
        {showCheckIcon && (
          <Box ml="$3">
            <Pressable onPress={handleCheckPress} alignItems="center" justifyContent="center">
              <AntDesign
                name="checkcircle"
                size={28}
                color={set.isCompleted ? "#22c55e" : "#888"}
              />
            </Pressable>
          </Box>
        )}
      </HStack>
    </Box>
  );
}
