import React, { useState } from "react";
import { Box, Text, Pressable, HStack, VStack, ScrollView } from "@gluestack-ui/themed";
import Modal from "react-native-modal";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

interface ExerciseFilterProps {
  selectedEquipment: string;
  selectedMuscle: string;
  allEquipment: { id: number; name: string }[];
  allMuscle: { id: number; name: string }[];
  onSelectEquipment: (value: string) => void;
  onSelectMuscle: (value: string) => void;
}

export default function Category({
  selectedEquipment,
  selectedMuscle,
  allEquipment,
  allMuscle,
  onSelectEquipment,
  onSelectMuscle,
}: ExerciseFilterProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"equipment" | "muscle">("equipment");

  const openFilterModal = (type: "equipment" | "muscle") => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleSelectFilter = (value: string) => {
    if (modalType === "equipment") {
      onSelectEquipment(value);
    } else {
      onSelectMuscle(value);
    }
    setModalVisible(false);
  };

  const shouldShowReset = selectedEquipment !== "All Equipment" || selectedMuscle !== "All Muscle";

  const currentSelected = modalType === "equipment" ? selectedEquipment : selectedMuscle;

  return (
    <>
      <Box p="$4">
        <HStack space="sm" alignItems="center">
          <Pressable
            flex={1}
            px="$4"
            py="$3"
            bg="$gray900"
            borderRadius="$md"
            onPress={() => openFilterModal("equipment")}
          >
            <Text color="$white" textAlign="center" size="md">
              {selectedEquipment}
            </Text>
          </Pressable>

          <Pressable
            flex={1}
            px="$4"
            py="$3"
            bg="$gray900"
            borderRadius="$md"
            onPress={() => openFilterModal("muscle")}
          >
            <Text color="$white" textAlign="center" size="md">
              {selectedMuscle}
            </Text>
          </Pressable>

          {shouldShowReset && (
            <Pressable
              onPress={() => {
                onSelectEquipment("All Equipment");
                onSelectMuscle("All Muscle");
              }}
            >
              <MaterialIcons name="cancel" size={24} color="white" />
            </Pressable>
          )}
        </HStack>
      </Box>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        style={{ justifyContent: "flex-end", margin: 0 }}
        backdropOpacity={0.8}
        backdropColor="black"
      >
        <Box
          bg="$zinc800"
          borderTopLeftRadius="$2xl"
          borderTopRightRadius="$2xl"
          pb="$4"
          maxHeight="75%"
          w="100%"
        >
          <VStack alignItems="center" py="$2" mt="$2">
            <Box w={48} h={1.5} bg="$gray400" borderRadius="$full" mb="$2" />
            <Text color="$white" size="xl" fontWeight="$bold" py="$2">
              Select {modalType === "equipment" ? "Equipment" : "Muscle"}
            </Text>
          </VStack>

          <ScrollView showsVerticalScrollIndicator={false} px="$3" py="$2">
            {(modalType === "equipment" ? allEquipment : allMuscle).map((item, index, array) => (
              <Pressable
                key={item.id}
                py="$4"
                px="$3"
                borderBottomWidth={index !== array.length - 1 ? 1 : 0}
                borderColor="$gray500"
                onPress={() => handleSelectFilter(item.name)}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <Text color="$white" size="lg" fontWeight="$semibold" letterSpacing={1}>
                    {item.name}
                  </Text>
                  {item.name === currentSelected && (
                    <AntDesign name="check" size={24} color="blue" />
                  )}
                </HStack>
              </Pressable>
            ))}
          </ScrollView>
        </Box>
      </Modal>
    </>
  );
}
