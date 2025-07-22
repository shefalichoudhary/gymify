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
} from "@gluestack-ui/themed";
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
    const snapPoints = useMemo(() => ["50%"], []);

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
        const exercisesData = await db.select().from(exercises).all();
        const uniqueEquipment = [...new Set(exercisesData.map((e) => e.equipment))];
        setEquipmentList(uniqueEquipment);

        const muscleLinks = await db.select().from(exerciseMuscles).all();
        const muscleIds = [...new Set(muscleLinks.map((em) => em.muscle_id))];
        const musclesData = await db
          .select()
          .from(muscles)
          .where(inArray(muscles.id, muscleIds));
        setMuscleList(musclesData);
      };

      fetchFilters();
    }, []);

    return (
      <CustomBottomSheet ref={bottomSheetRef}>
        <VStack space="md" px="$4" py="$4">
        

          {/* Equipment List */}
          {activeTab === "equipment" && (
            <FlatList
              data={equipmentList}
              keyExtractor={(item:any) => item}
              renderItem={({ item }:any) => {
                const isSelected = selectedEquipment === item;
                return (
                  <Pressable
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
              }}
            />
          )}

          {/* Muscle List */}
          {activeTab === "muscle" && (
            <FlatList
              data={muscleList}
              keyExtractor={(item:any) => item.id}
              renderItem={({ item }:any) => {
                const isSelected = selectedMuscle === item.id;
                return (
                  <Pressable
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
              }}
            />
          )}
        </VStack>
      </CustomBottomSheet>
    );
  }
);

export default ExerciseFilterDrawer;
