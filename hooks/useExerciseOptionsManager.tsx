import { useRef, useState } from "react";
import { RestTimerSheetRef } from "@/components/routine/bottomSheet/timer";
import { WeightSheetRef } from "@/components/routine/bottomSheet/weight";
import { RepsTypeSheetRef } from "@/components/routine/bottomSheet/repsType";
import { SetTypeSheetRef } from "@/components/routine/bottomSheet/set";

export function useExerciseOptionsManager() {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [activeSetIndex, setActiveSetIndex] = useState<number | null>(null);

  const [exerciseData, setExerciseData] = useState<
    Record<
      string,
      {
        notes: string;
        restTimer: number;
        unit: "lbs" | "kg";
        repsType: "reps" | "rep range";
        sets: {
          weight?: number;
          reps?: number;
          minReps?: number;
          maxReps?: number;
          setType?: "W" | "Normal" | "D" | "F";
        }[];
      }
    >
  >({});

  const restSheetRef = useRef<RestTimerSheetRef>(null);
  const weightSheetRef = useRef<WeightSheetRef>(null);
  const repsSheetRef = useRef<RepsTypeSheetRef>(null);
  const setTypeSheetRef = useRef<SetTypeSheetRef>(null);

  const openRestTimer = (id: string) => {
    setActiveExerciseId(id);
    restSheetRef.current?.open();
  };

  const openWeightSheet = (id: string) => {
    setActiveExerciseId(id);
    weightSheetRef.current?.open();
  };

  const openRepsSheet = (id: string) => {
    setActiveExerciseId(id);
    repsSheetRef.current?.open();
  };
  const openSetTypeSheet = (exerciseId: string, setIndex: number) => {
    setExerciseData((prev) => {
      const updated = { ...prev };
      if (!updated[exerciseId]) {
        // initialize if missing
        updated[exerciseId] = {
          notes: "",
          restTimer: 0,
          unit: "kg",
          repsType: "reps",
          sets: [{ weight: undefined, reps: undefined, setType: "Normal" }],
        };
      } else if (!updated[exerciseId].sets[setIndex]) {
        // initialize set if missing
        updated[exerciseId].sets[setIndex] = {
          weight: undefined,
          reps: undefined,
          setType: "Normal",
        };
      }
      return updated;
    });

    setActiveExerciseId(exerciseId);
    setActiveSetIndex(setIndex);
    setTypeSheetRef.current?.open();
  };

  const updateRestDuration = (duration: number) => {
    if (!activeExerciseId) return;
    setExerciseData((prev) => {
      const updated = { ...prev };
      if (updated[activeExerciseId]) {
        updated[activeExerciseId].restTimer = duration;
      }
      return updated;
    });
  };

  const updateWeightUnit = (unit: "lbs" | "kg") => {
    if (!activeExerciseId) return;
    setExerciseData((prev) => ({
      ...prev,
      [activeExerciseId]: {
        ...prev[activeExerciseId],
        unit,
      },
    }));
  };

  const updateRepsType = (type: "reps" | "rep range") => {
    if (!activeExerciseId) return;
    setExerciseData((prev) => ({
      ...prev,
      [activeExerciseId]: {
        ...prev[activeExerciseId],
        repsType: type,
      },
    }));
  };

  const updateSetType = (
    type: "W" | "Normal" | "D" | "F" | "REMOVE",
    exerciseId?: string,
    setIndex?: number
  ) => {
    const exId = exerciseId ?? activeExerciseId;
    const idx = setIndex ?? activeSetIndex;
    if (!exId || idx === null) return;

    setExerciseData((prev) => {
      const updated = { ...prev };
      const sets = [...updated[exId].sets];

      if (type === "REMOVE") {
        // 🗑 remove the set
        sets.splice(idx, 1);
      } else {
        // ✅ update set type
        sets[idx] = { ...sets[idx], setType: type };
      }

      updated[exId].sets = sets;
      return updated;
    });
  };

  return {
    activeSetIndex,
    setActiveSetIndex,
    activeExerciseId,
    setActiveExerciseId,
    exerciseData,
    setExerciseData,
    restSheetRef,
    weightSheetRef,
    repsSheetRef,
    setTypeSheetRef,
    openRestTimer,
    openWeightSheet,
    openRepsSheet,
    updateRestDuration,
    updateWeightUnit,
    updateRepsType,
    openSetTypeSheet, // ✅
    updateSetType,
  };
}
