import React  from "react";
  import { useState, useEffect,useRef

   } from "react";
  import {
    Box,
    HStack,
    Input,
    InputField,
    Text,
    Pressable,
  } from "@gluestack-ui/themed";
  import { AntDesign,
    Ionicons } from "@expo/vector-icons";
  import { WorkoutSet as Set } from "@/types/workoutSet";
  import { Vibration } from "react-native";
import { eq } from "drizzle-orm";
import { db } from "@/db/db"; // filepath: c:\Users\Elsa\gymify\components\routine\setRow.tsx
import { workoutSets, WorkoutSet } from "@/db/schema";
import CustomDialog from "../logWorkoutDialog";
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
const [previousSets, setPreviousSets] = useState<Record<string, WorkoutSet[]>>({});
const intervalRef = useRef<number | null>(null);
const [timerRunning, setTimerRunning] = useState(false);
const [timeLeft, setTimeLeft] = useState<number | undefined>(set.duration || 0);

useEffect(() => {
  if (timerRunning) {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newVal = (prev || 0) + 1; // ⬅️ increment
        onChange("duration", newVal);
        return newVal;
      });
    }, 1000);
  }

  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [timerRunning]);

useEffect(() => {
  async function fetchHistory() {
    const sets = await getPreviousSets(exerciseId);
    if (sets.length > 0) {
      const lastSet = sets[0];
      onChange("previousWeight", lastSet.weight ?? undefined);
      onChange("previousReps", lastSet.reps ?? undefined);
      onChange("previousMinReps", lastSet.minReps ?? undefined);
      onChange("previousMaxReps", lastSet.maxReps ?? undefined);
      onChange("previousDuration", lastSet.duration ?? undefined);
    }
  }
  fetchHistory();
}, [exerciseId]);

    const isDuration = exerciseType === "Duration" || exerciseType === "Yoga";
const isWeighted = exerciseType === "Weighted" || exerciseType === "Assisted Bodyweight";
    const isBodyweight = exerciseType === "Bodyweight";

   

    const getPrefillValue = (
      current?: number | string | null,
      previous?: number | string | null
    ) => {
      if (current != null && current !== "") return current.toString();
      if (previous != null && previous !== "") return previous.toString();
      return "";
    };

 const handleCheckPress = () => {
   if (timerRunning) {
    setTimerRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }
      const newValue = !set.isCompleted;
      onChange("isCompleted", newValue);
      onToggleCheck(newValue);
     Vibration.vibrate([0, 200, 100, 200], false);
  };

const formatTime = (secs?: number) => {
  if (secs == null) return "00:00"; // fallback
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
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
      <Box flex={showCheckIcon ? 6: 4}>
        <HStack alignItems="center" space="sm" ml="$4">
          {set.isRangeReps ? (
            <HStack alignItems="center" flex={1}>
              <Input size="sm" borderWidth={0} w="25%">
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
              <Input size="sm" borderWidth={0} w="30%">
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
            <Input size="sm" borderWidth={0} w="32%" ml="$2">
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
          <Box flex={showCheckIcon ? 2 : 1} mt="$2">
            <Pressable onPress={() => onOpenSetType(exerciseId, index)}>
              <Text color={getSetTypeColor(set.setType)}>
                {set.setType && set.setType !== "Normal"
                  ? set.setType
                  : `${index + 1}`}
              </Text>
            </Pressable>
          </Box>


          {/* Weighted = weight + reps */}
          {isWeighted && (
            <>
              <Box flex={showCheckIcon ? 2 : 1}>
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
  <Box flex={showCheckIcon ? 6 : 6} position="relative">
    {/* Timer Icon - absolute, left side */}
    {!set.isCompleted && showCheckIcon && (
      <Box position="absolute" left={38} top={0} bottom={0} justifyContent="center" zIndex={1}>
        <Pressable
          onPress={() => {
            if (timerRunning) {
              setTimerRunning(false);
              if (intervalRef.current) clearInterval(intervalRef.current);
            } else {
              setTimerRunning(true);
            }
          }}
        >
          {timerRunning ? (
            <AntDesign name="pausecircle" size={24} color="#3b82f6" />
          ) : (
            <Ionicons
              name="caret-forward-circle-outline"
              size={24}
              color="#3b82f6"
            />
          )}
        </Pressable>
      </Box>
    )}

    {/* Duration input - always centered and fixed width */}
    <Box alignItems="center">
      <Input size="sm" borderWidth={0} w={100}>
        <InputField
          placeholder="00:00"
          keyboardType="numeric"
          color="$white"
          textAlign="center"
          value={formatTime(timeLeft)}
          onChangeText={(text) => {
            const parts = text.split(":");
            let val: number | undefined;
            if (parts.length === 2) {
              const minutes = parseInt(parts[0], 10) || 0;
              const seconds = parseInt(parts[1], 10) || 0;
              val = minutes * 60 + seconds;
            } else {
              val = text ? parseInt(text, 10) || 0 : undefined;
            }
            const safeVal = val ?? 0;
            setTimeLeft(val);
            onChange("duration", safeVal);
          }}
        />
      </Input>
    </Box>
  </Box>
)}


          {/* ✅ Check Icon */}
         {showCheckIcon && (
  <Box ml="$3">
    <Pressable
      onPress={handleCheckPress}
      alignItems="center"
      justifyContent="center"
    >
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
