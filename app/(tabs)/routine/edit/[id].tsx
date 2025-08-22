// app/editRoutine.tsx
import React, { useState,useEffect,useRef } from "react";
import { exercises } from "@/db/schema"
import {
  Box,
  HStack,
  Text,
  Input,
  InputField,
  Pressable,
  ScrollView,
} from "@gluestack-ui/themed";
import ExerciseBlock from "@/components/routine/exerciseBlock";
import CustomButton from "@/components/customButton";
import { useRouter } from "expo-router";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import CustomHeader from "@/components/customHeader";
import { db } from "@/db/db";
import {
  routines,
  routineExercises,
  routineSets,
} from "@/db/schema";
import { eq, inArray  } from "drizzle-orm";
import { updateRoutineInDb } from "@/components/routine/updateRoutine"; 
import { WorkoutSet as Set } from "@/types/workoutSet";
import {  useLocalSearchParams } from "expo-router";
import { useExerciseOptionsManager } from "@/hooks/useExerciseOptionsManager";
  import SetTypeModal from "@/components/routine/bottomSheet/set";
    import RestTimerSheet  from "@/components/routine/bottomSheet/timer";
    import RepsTypeSheet from "@/components/routine/bottomSheet/repsType";
    import WeightSheet from "@/components/routine/bottomSheet/weight";

type ExerciseUpdateData = {
  notes: string;
  restTimer: number;
  sets: Set[];
    unit: "lbs" | "kg";
  repsType: "reps" | "rep range";
};
export default function EditRoutineScreen() {
const { id: rawId, addedExerciseIds, duplicate } = useLocalSearchParams<{
  id: string | string[];
  addedExerciseIds?: string;
  duplicate?: string;
}>();

const isDuplicate = duplicate === "true";

const routineId = Array.isArray(rawId) ? rawId[0] : rawId;
  const router = useRouter();
const {
   activeExerciseId,
      activeSetIndex,
      restSheetRef,
      weightSheetRef,
      repsSheetRef,
      setTypeSheetRef,
      openRestTimer,
      openWeightSheet,
      openRepsSheet,
      openSetTypeSheet,
      
} = useExerciseOptionsManager();
  const [routineTitle, setRoutineTitle] = useState("Loading...");
  const [exerciseData, setExerciseData] = useState<Record<string, ExerciseUpdateData>>({});
  const [exerciseMeta, setExerciseMeta] = useState<Record<string, {
    id: string;
    exercise_name: string;
      exercise_type: string | null; 
    equipment: string;
    type: string;
  }>>({});

const handleSetTypeSelect = (
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


const handleRestDurationSelect = (duration: number) => {
  if (!activeExerciseId) return;

  setExerciseData((prev:any) => {
    const updated = { ...prev };
    const exercise = updated[activeExerciseId];

    if (exercise) {
      exercise.restTimer = duration;
      exercise.restTimeInSeconds = duration;
    }

    return updated;
  });
};
const handleWeightSelect = (unit: string) => {
  if (!activeExerciseId) return;
  setExerciseData((prev:any) => ({
    ...prev,
    [activeExerciseId]: {
      ...prev[activeExerciseId],
      unit,
    },
  }));
};
const handleRepsTypeSelect = (type: "reps" | "rep range") => {
  if (!activeExerciseId) return;
  setExerciseData((prev: any) => ({
    ...prev,
    [activeExerciseId]: {
      ...prev[activeExerciseId],
      repsType: type,
    },
  }));
};


useEffect(() => {
  if (addedExerciseIds) {
    const addedIds = JSON.parse(addedExerciseIds) as string[];

    const loadNewExercises = async () => {
      const newExercises = await db
        .select()
        .from(exercises)
        .where(inArray(exercises.id, addedIds));

      const updatedData = { ...exerciseData };
      const updatedMeta = { ...exerciseMeta };

      for (const ex of newExercises) {
        if (!updatedData[ex.id]) {
          updatedData[ex.id] = {
            notes: "",
            restTimer: 0,
            sets: [],
            unit: "kg",
            repsType: "reps",
          };
          updatedMeta[ex.id] = ex;
        }
      }

      setExerciseData(updatedData);
      setExerciseMeta(updatedMeta);
    };

    loadNewExercises();
  }
}, [addedExerciseIds]);


 useEffect(() => {
    const fetchRoutineData = async () => {
      if (!routineId) return;

      const routine = await db
        .select()
        .from(routines)
        .where(eq(routines.id, routineId))
        .get();

      if (!routine) return;

      setRoutineTitle(routine.name);

      const routineEx = await db
        .select()
        .from(routineExercises)
        .where(eq(routineExercises.routineId, routineId))
        .all();

      const exerciseIds = routineEx.map((re) => re.exerciseId);

      const allExercises = await db
        .select()
        .from(exercises)
        .where(inArray(exercises.id, exerciseIds))
        .all();

      const allSets = await db
        .select()
        .from(routineSets)
        .where(eq(routineSets.routineId, routineId))
        .all();

      // 🧩 Build exerciseData & meta
      const updatedExerciseData: Record<string, ExerciseUpdateData> = {};
      const updatedMeta: typeof exerciseMeta = {};

   for (const ex of allExercises) {
  const matchingRoutineEx = routineEx.find((re) => re.exerciseId === ex.id);
  const sets = allSets
    .filter((s) => s.exerciseId === ex.id)
    .map((s) => ({
      weight: s.weight ?? 0,
      reps: s.reps ?? 0, // ✅ ensure number
      minReps: s.minReps ?? undefined,
      maxReps: s.maxReps ?? undefined,
        setType: s.setType ?? "Normal",
        duration: s.duration ?? 0,
    }));


    updatedExerciseData[ex.id] = {
  notes: matchingRoutineEx?.notes || "",
  restTimer:matchingRoutineEx?.restTimer || 0,
  unit: matchingRoutineEx?.unit || "kg", // or "lbs" if you prefer
  repsType: matchingRoutineEx?.repsType || "reps",
  sets,
};


  updatedMeta[ex.id] = ex;
}


      setExerciseData(updatedExerciseData);
      setExerciseMeta(updatedMeta);
    };

    fetchRoutineData();
  }, [routineId]);
 
const handleSave = async () => {
  try {
    await updateRoutineInDb(routineId, routineTitle, exerciseData);
    console.log("Saving sets:", JSON.stringify(exerciseData
      , null, 2));
    router.back();
  } catch (err) {
    console.error("❌ Failed to update routine:", err);
  }
};

  const handleExerciseChange = (id: string, newData: any) => {
    setExerciseData((prev) => ({ ...prev, [id]: newData }));
  };

  return (
    <Box flex={1} bg="$black">
      <CustomHeader
  title="Edit Routine"
  left="Cancel"
  onPress={() => router.back()}
  right="Update"
  onRightButtonPress={handleSave}
/>

      <ScrollView showsVerticalScrollIndicator={false} px="$4">
      <Box pt="$4"  mb="$4">
 <Input variant="underlined" borderBottomWidth={0.5} size="xl"borderColor="#1F1F1F" >
                      <InputField
                        placeholder="Routine title"
                                  value={routineTitle}
                                  onChangeText={setRoutineTitle}
                        color="$white"
                        placeholderTextColor="$coolGray400"
                        fontWeight="$small"
                        className="text-2xl pb-5 px-2"
                      />
          {routineTitle.length > 0 && (
   <Pressable onPress={() => setRoutineTitle("")}>
               <Box
    bg="$white"
    p={5} // adjust for size
    borderRadius={999} // full circle
    alignItems="center"
    justifyContent="center"
  >
    <MaterialIcons name="clear" size={10} color="black" />
  </Box>
            </Pressable>
  )}
        </Input>


      </Box>
          
        {Object.entries(exerciseData).map(([id, data]) => (
          <ExerciseBlock
            key={id}
            exercise={exerciseMeta[id]}
           data={{
  ...data,
  unit: data.unit || "kg",
  repsType: data.repsType || "reps",
  
}}
            onChange={(newData) => handleExerciseChange(id, newData)}
              onOpenRestTimer={openRestTimer}
       onOpenWeight={openWeightSheet}
      onOpenRepsType={openRepsSheet}
      onOpenSetType={(exerciseId, setIndex) => {
        if (setIndex === undefined) return; // or handle default
        openSetTypeSheet(exerciseId, setIndex);
      }}
  onOpenRepRange={() =>{}}
  onToggleSetComplete={()=>{}}


                />
              
              ))}

        <Box mt="$6">
          <HStack space="lg" alignItems="center">
           <CustomButton
              onPress={() =>
                router.push({
                  pathname: "/addExercise",
                  params: { from: "editRoutine", routineId },
                })
              }
  
              bg="$blue500"
              icon={<Entypo name="plus" size={24} color="white" />}
              iconPosition="left"
            >
              Add exercise
            </CustomButton>
          </HStack>
        </Box>
      </ScrollView>
      <RestTimerSheet
        ref={restSheetRef}
        onSelectDuration={handleRestDurationSelect}
      />
      <WeightSheet
        ref={weightSheetRef}
        onSelectWeight={handleWeightSelect}
      />
      <RepsTypeSheet
        ref={repsSheetRef}
        onSelectRepsType={handleRepsTypeSelect}
      />
      <SetTypeModal
        ref={setTypeSheetRef}
        selectedType={
          exerciseData[activeExerciseId ?? ""]?.sets?.[activeSetIndex ?? 0]?.setType || "Normal"
        }
          onSelect={(type:any) => {
          handleSetTypeSelect(type, activeExerciseId!, activeSetIndex!); // explicitly pass IDs
          setTypeSheetRef.current?.close();
        }}
        />
    </Box>
  );
}
