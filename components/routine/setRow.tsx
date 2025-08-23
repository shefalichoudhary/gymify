  import React  from "react";
  import { useState, useEffect } from "react";
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
import { eq } from "drizzle-orm";
import { db } from "@/db/db"; // filepath: c:\Users\Elsa\gymify\components\routine\setRow.tsx
import { workoutSets, WorkoutSet } from "@/db/schema";
  type SetRowProps = {
    index: number;
    set: Set;
    exerciseId: string;
    showCheckIcon?: boolean;
    onChange: <K extends keyof Set>(key: K, value: Set[K]) => void;
    editable?: boolean;
    onOpenSetType: (exerciseId: string, setIndex: number) => void;
    onToggleCheck: (completed: boolean) => void;
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
const [previousSets, setPreviousSets] = useState<Record<string, WorkoutSet[]>>({});

useEffect(() => {
  async function fetchHistory() {
    const sets = await getPreviousSets(exerciseId);
    setPreviousSets(prev => ({ ...prev, [exerciseId]: sets }));
  }
  fetchHistory();
}, []);
    const isDuration = exerciseType === "Duration" || exerciseType === "Yoga";
const isWeighted = exerciseType === "Weighted" || exerciseType === "Assisted Bodyweight";
    const isBodyweight = exerciseType === "Bodyweight";

    // --- Validation for check icon
    const isSetFilled = () => {
      if (isDuration) {
        return !!set.duration;
      }
      if (set.isRangeReps) {
        return (isWeighted ? !!set.weight : true) && !!set.minReps && !!set.maxReps;
      }
      return (isWeighted ? !!set.weight : true) && !!set.reps;
    };

    const getPrefillValue = (
      current?: number | string | null,
      previous?: number | string | null
    ) => {
      if (current != null && current !== "") return current.toString();
      if (previous != null && previous !== "") return previous.toString();
      return "";
    };

    const handleCheckPress = () => {
      if (isSetFilled()) {
        const newValue = !set.isCompleted;
        onChange("isCompleted", newValue);
        onToggleCheck(newValue);
        Vibration.vibrate(60);
      }
    };

    const getSetTypeColor = (type?: string) => {
      switch (type) {
        case "W":
          return "#facc15"; // yellow
        case "D":
          return "#3b82f6"; // blue
        case "F":
          return "#ef4444"; // red
        default:
          return "#fff"; // normal
      }
    };
async function getPreviousSets(exerciseId: string) {
  return await db
    .select()
    .from(workoutSets)
    .where(eq(workoutSets.exerciseId, exerciseId))
    .limit(1); // last 5 sets for history
}
    // --- Shared reps input for Weighted & Bodyweight
    const renderRepsInput = () => (
      <Box flex={showCheckIcon ? (isWeighted ? 4 : 4) : 4}>
        <HStack alignItems="center" space="sm">
          {set.isRangeReps ? (
            <HStack alignItems="center" flex={1}>
              <Input size="sm" borderWidth={0} w="44%">
                <InputField
                  placeholder="-"
                  keyboardType="numeric"
                  color="$white"
                  value={getPrefillValue(set.minReps, set.previousMinReps)}
                  onChangeText={(text) =>
                    onChange("minReps", text ? parseInt(text, 10) || 0 : undefined)
                  }
                />
              </Input>
              <Text color="$white">to</Text>
              <Input size="sm" borderWidth={0} w="44%">
                <InputField
                  placeholder="-"
                  keyboardType="numeric"
                  color="$white"
                  value={getPrefillValue(set.maxReps, set.previousMaxReps)}
                  onChangeText={(text) =>
                    onChange("maxReps", text ? parseInt(text, 10) || 0 : undefined)
                  }
                />
              </Input>
            </HStack>
          ) : (
            <Input size="sm" borderWidth={0} w="45%">
              <InputField
                placeholder="-"
                keyboardType="numeric"
                color="$white"
                value={getPrefillValue(set.reps, set.previousReps)}
                onChangeText={(text) =>
                  onChange("reps", text ? parseInt(text, 10) || 0 : undefined)
                }
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
          <Box flex={1} mt="$2">
            <Pressable onPress={() => onOpenSetType(exerciseId, index)}>
              <Text color={getSetTypeColor(set.setType)}>
                {set.setType && set.setType !== "Normal"
                  ? set.setType
                  : `${index + 1}`}
              </Text>
            </Pressable>
          </Box>

          {/* Previous values */}
{/* Previous values */}
{showCheckIcon && (
  <Box mt="$1" flex={3}>
    {Array.from({ length: Math.max(1, previousSets[exerciseId]?.length ?? 1) }).map((_, idx) => {
      const prevSet = previousSets[exerciseId]?.[idx];
      const prevUnit = prevSet?.previousUnit ?? "kg"; // fallback to kg
      const isPrevRangeReps = prevSet?.previousMinReps != null && prevSet?.previousMaxReps != null;

      // Compute display text
      let displayText = "-";
      if (prevSet) {
        if (isDuration) {
          displayText = prevSet.duration != null ? `${prevSet.duration}s` : "-";
        } else if (isPrevRangeReps) {
          displayText = `${prevSet.weight ? `${prevSet.weight} ${prevUnit} x ` : ""}${prevSet.minReps}–${prevSet.maxReps}`;
        } else if (prevSet.reps != null) {
          displayText = `${prevSet.weight ? `${prevSet.weight} ${prevUnit} x ` : ""}${prevSet.reps}`;
        }
      }

      return (
        <Text
          key={idx}
          color="$coolGray400"
          fontSize="$xs"
          textAlign="center"   // center-align the text
          width={60}          // fixed width for all rows (adjust as needed)
        >
          {displayText}
        </Text>
      );
    })}
  </Box>
)}


          {/* Weighted = weight + reps */}
          {isWeighted && (
            <>
              <Box flex={showCheckIcon ? 2 : 2}>
                <Input size="sm" borderWidth={0}>
                  <InputField
                    placeholder="-"
                    keyboardType="numeric"
                    color="$white"
                    value={getPrefillValue(set.weight, set.previousWeight)}
                    onChangeText={(text) =>
                      onChange("weight", text ? parseInt(text, 10) : 0)
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
          <Box flex={showCheckIcon ? 4 : 4} ml="$6">
              <Input size="sm" borderWidth={0}>
                <InputField
                  placeholder="Secs"
                  keyboardType="numeric"
                  color="$white"
                  value={getPrefillValue(set.duration, set.previousDuration)}
                  onChangeText={(text) =>
                    onChange("duration", text ? parseInt(text, 10) || 0 : undefined)
                  }
                />
              </Input>
            </Box>
          )}

          {/* ✅ Check Icon */}
          {showCheckIcon && (
            <Box ml="$3">
              <Pressable
                onPress={handleCheckPress}
                disabled={!isSetFilled()}
                alignItems="center"
                justifyContent="center"
              >
                <AntDesign
                  name="checkcircle"
                  size={22}
                  color={
                    !isSetFilled()
                      ? "#888"
                      : set.isCompleted
                      ? "#22c55e"
                      : "#888"
                  }
                />
              </Pressable>
            </Box>
          )}
        </HStack>
      </Box>
    );
  }
