import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Text,
  VStack,
  Pressable,
  HStack,
  FlatList,
  Box,ScrollView
} from "@gluestack-ui/themed";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import CustomBottomSheet from "@/components/routine/bottomSheet/customBottomSheet";
import { db } from "@/db/db";
import { exercises, muscles, Muscle, exerciseMuscles } from "@/db/schema";
import { inArray } from "drizzle-orm";

export type ExerciseFilterDrawerRef = {
  open: (tab: "equipment" | "muscle") => void;
  close: () => void;
};

type Props = {
  selectedEquipment: string | null;
  selectedMuscle: string | null;
  onSelectEquipment: (equipment: string) => void;
  onSelectMuscle: (muscleId: string) => void;
};

const ExerciseFilterDrawer = forwardRef<ExerciseFilterDrawerRef, Props>(
  ({ selectedEquipment, selectedMuscle, onSelectEquipment, onSelectMuscle }, ref) => {
    const bottomSheetRef = useRef<any>(null);
    const [activeTab, setActiveTab] = useState<"equipment" | "muscle">("equipment");

    const [equipmentList, setEquipmentList] = useState<string[]>([]);
    const [muscleList, setMuscleList] = useState<Muscle[]>([]);

    useImperativeHandle(ref, () => ({
      open: (tab: "equipment" | "muscle") => {
        setActiveTab(tab);
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

useEffect(() => {
  const fetchFilters = async () => {
    // Fetch exercises with type safety
    const exercisesData: { equipment: string }[] = await db
      .select({ equipment: exercises.equipment })
      .from(exercises)
      .all();

    const uniqueEquipment = [...new Set(exercisesData.map((e) => e.equipment))];
    setEquipmentList(uniqueEquipment);

    // Fetch exercise-muscle links
    const muscleLinks: { muscle_id: string }[] = await db
      .select({ muscle_id: exerciseMuscles.muscle_id })
      .from(exerciseMuscles)
      .all();

    const muscleIds = [...new Set(muscleLinks.map((em) => em.muscle_id))];

    if (muscleIds.length === 0) {
      setMuscleList([]);
      return;
    }

    // Fetch muscles by ID with proper typing
    const musclesData: Muscle[] = await db
      .select()
      .from(muscles)
      .where(inArray(muscles.id, muscleIds as string[])); // explicitly typed as string[]
    setMuscleList(musclesData);
  };

  fetchFilters().catch((err) => console.error("Failed to fetch filters:", err));
}, []);


    return (
     <CustomBottomSheet ref={bottomSheetRef} snapPoints={["20%", "50%"]}>
  <VStack flex={1} p="$4" height="100%">
    <Box
      borderBottomWidth={1}
      borderColor="$trueGray700"
      pb="$3"
      mb="$4"
    >
      <Text fontSize="$lg" fontWeight="$bold" textAlign="center" color="white">
        {activeTab === "equipment" ? "Equipment" : "Muscle Group"}
      </Text>
    </Box>

    {/* Scrollable filter content */}
  <BottomSheetScrollView
          contentContainerStyle={{ padding: 1, paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        >
      {activeTab === "equipment" &&
        equipmentList.map((item) => {
          const isSelected = selectedEquipment === item;
          return (
            <Pressable
              key={item}
              p="$3"
              borderRadius="$md"
              bg={isSelected ? "$blue600" : "#2a2a2a"}
              onPress={() => {
                onSelectEquipment(item);
                bottomSheetRef.current?.close();
              }}
              mb="$2"
            >
              <Text color="$white">{item}</Text>
            </Pressable>
          );
        })}

       {activeTab === "muscle" &&
        muscleList.map((item) => {
          const isSelected = selectedMuscle === item.id;
            return (
            <Pressable
              key={item.id}
              p="$3"
              borderRadius="$md"
              bg={isSelected ? "$blue600" : "#2a2a2a"}
              onPress={() => {
                onSelectMuscle(item.id);
                bottomSheetRef.current?.close();
              }}
              mb="$2"
            >
              <Text color="$white">{item.name}</Text>
            </Pressable>
              
          );
        })}

</BottomSheetScrollView>
  </VStack>
</CustomBottomSheet>

    );
  }
);

export default ExerciseFilterDrawer;
