import { useState, useEffect } from "react";
import { useCombinedContext } from "@/context/exerciseModalContext";
import cuid from "cuid";

export default function useCreateRoutineState() {
  const { selectedExercises, clearSelectedExercises } = useCombinedContext();

  const [routineTitle, setRoutineTitle] = useState<string>("");
  const [routineNote, setRoutineNote] = useState<Record<string, string>>({});
  const [restTimer, setRestTimer] = useState<string | number>("OFF");

  const [newSetData, setNewSetData] = useState<
    Record<
      string,
      {
        id: string;
        type: string;
        weight: number;
        reps: number;
        repRange?: { min: number; max: number } | null;
        unit: "kg" | "lbs";
        restTimer: string | number;
        routineNote: string;
      }[]
    >
  >({});

  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [editingSetIndex, setEditingSetIndex] = useState<number | null>(null);

  const [restTimerVisible, setRestTimerVisible] = useState<boolean>(false);
  const [setModalVisible, setSetModalVisible] = useState<boolean>(false);
  const [weightModalVisible, setWeightModalVisible] = useState<boolean>(false);
  const [repsModalVisible, setRepsModalVisible] = useState<boolean>(false);

  const handleAddSet = (idKey: string) => {
    const currentSets = newSetData[idKey] || [];
    const newSet = {
      id: cuid(), // Generate a unique ID for the new set
      type: "Normal", // Default set type
      weight: 0, // Default weight
      reps: 0, // Default reps
      repRange: null, // Default reps range
      unit: "kg", // Default unit
      restTimer: "OFF", // Default rest timer
      routineNote: "", // Default routine note
    };

    setNewSetData((prev: any) => ({
      ...prev,
      [idKey]: [...currentSets, newSet], // Add the new set to the list
    }));
  };

  useEffect(() => {
    const updatedSetData = { ...newSetData };
    selectedExercises.forEach((exercise: any) => {
      const idKey = String(exercise.id);
      if (!updatedSetData[idKey]) {
        updatedSetData[idKey] = [
          {
            id: cuid(), // Generate a unique ID for the initial set
            type: "Normal",
            weight: 0,
            reps: 0,
            repRange: null,
            unit: "kg",
            restTimer: "OFF", // Default rest timer set to "OFF"
            routineNote: "",
          },
        ];
      }
    });
    setNewSetData(updatedSetData);
  }, [selectedExercises]);

  return {
    routineTitle,
    setRoutineTitle,
    routineNote,
    setRoutineNote,
    restTimer,
    setRestTimer,
    newSetData,
    setNewSetData,
    activeExerciseId,
    setActiveExerciseId,
    editingSetIndex,
    setEditingSetIndex,
    restTimerVisible,
    setRestTimerVisible,
    setModalVisible,
    setSetModalVisible,
    weightModalVisible,
    setWeightModalVisible,
    repsModalVisible,
    setRepsModalVisible,
    handleAddSet,
    selectedExercises,
    clearSelectedExercises,
  };
}
