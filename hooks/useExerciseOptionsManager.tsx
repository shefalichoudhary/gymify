import { useRef, useState } from "react";
import { RestTimerSheetRef } from "@/components/routine/bottomSheet/timer";
import { WeightSheetRef } from "@/components/routine/bottomSheet/weight";
import { RepsTypeSheetRef } from "@/components/routine/bottomSheet/repsType";

export function useExerciseOptionsManager() {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [exerciseData, setExerciseData] = useState<Record<
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
      }[];
    }
  >>({});

  const restSheetRef = useRef<RestTimerSheetRef>(null);
  const weightSheetRef = useRef<WeightSheetRef>(null);
  const repsSheetRef = useRef<RepsTypeSheetRef>(null);

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


  return {
    activeExerciseId,
    setActiveExerciseId,
    exerciseData,
    setExerciseData,
    restSheetRef,
    weightSheetRef,
    repsSheetRef,
    openRestTimer,
    openWeightSheet,
    openRepsSheet,
    updateRestDuration,
    updateWeightUnit,
    updateRepsType,
  };
}
