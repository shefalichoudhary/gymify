import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { db } from "../db/db";
import { Exercise, exercises } from "../db/schema";

interface Muscle {
  id: number;
  name: string;
}

interface Equipment {
  id: number;
  name: string;
}

interface CombinedContextType {
  selectedMuscle: Muscle | null;
  selectedEquipment: Equipment | null;
  setSelectedMuscle: (muscle: Muscle | null) => void;
  setSelectedEquipment: (equipment: Equipment | null) => void;
  allMuscle: Muscle[];
  allEquipment: Equipment[];
  selectedExercises: Exercise[];
  toggleExercise: (exercise: Exercise) => void;
  resetFilters: () => void;
  clearSelectedExercises: (updatedExercises: Exercise[]) => void; // Fixed type
}

const CombinedContext = createContext<CombinedContextType>({
  selectedMuscle: null,
  selectedEquipment: null,
  setSelectedMuscle: () => {},
  setSelectedEquipment: () => {},
  allMuscle: [],
  allEquipment: [],
  selectedExercises: [],
  toggleExercise: () => {},
  resetFilters: () => {},
  clearSelectedExercises: () => {},
});

export const CombinedProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [allMuscle, setAllMuscle] = useState<Muscle[]>([]);
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchMusclesAndEquipment = async () => {
      try {
        const data = await db.select().from(exercises);

        const uniqueMuscle = Array.from(
          new Set(
            data
              .flatMap((exercise) => [
                exercise.primary_muscle,
                exercise.secondary_muscle,
              ])
              .filter(Boolean)
          )
        ).map((muscle, index) => ({ id: index + 1, name: muscle }));

        const uniqueEquipment = Array.from(
          new Set(data.map((exercise) => exercise.equipment))
        ).map((equip, index) => ({ id: index + 1, name: equip }));

        setAllMuscle([{ id: 0, name: "All Muscle" }, ...uniqueMuscle]);

        setAllEquipment([{ id: 0, name: "All Equipment" }, ...uniqueEquipment]);
      } catch (error) {
        console.error("Error fetching muscles and equipment:", error);
        setAllMuscle([{ id: 0, name: "All Muscle" }]);
        setAllEquipment([{ id: 0, name: "All Equipment" }]);
      }
    };

    fetchMusclesAndEquipment();
  }, []);

  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const exists = prev.some((ex) => ex.id === exercise.id);
      return exists
        ? prev.filter((ex) => ex.id !== exercise.id)
        : [...prev, exercise];
    });
  };

  const resetFilters = () => {
    setSelectedMuscle(null);
    setSelectedEquipment(null);
  };

  const clearSelectedExercises = (updatedExercises: Exercise[]) => {
    setSelectedExercises(updatedExercises);
  };

  const contextValue = useMemo(
    () => ({
      selectedMuscle,
      selectedEquipment,
      clearSelectedExercises,
      setSelectedMuscle,
      setSelectedEquipment,
      allMuscle,
      allEquipment,
      selectedExercises,
      toggleExercise,
      resetFilters,
    }),
    [
      selectedMuscle,
      selectedEquipment,
      clearSelectedExercises,
      allMuscle,
      allEquipment,
      selectedExercises,
    ]
  );

  return (
    <CombinedContext.Provider value={contextValue}>
      {children}
    </CombinedContext.Provider>
  );
};

export const useCombinedContext = () => {
  const context = useContext(CombinedContext);
  if (!context) {
    throw new Error(
      "useCombinedContext must be used within a CombinedProvider"
    );
  }
  return context;
};
