import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import AntDesign from "@expo/vector-icons/AntDesign";

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
  const [modalType, setModalType] = useState<"equipment" | "muscle">(
    "equipment"
  );

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

  const shouldShowReset =
    selectedEquipment !== "All Equipment" || selectedMuscle !== "All Muscle";

  const currentSelected =
    modalType === "equipment" ? selectedEquipment : selectedMuscle;

  return (
    <>
      <View className="p-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => openFilterModal("equipment")}
            className="flex-1 p-3 bg-gray-900 rounded-md shadow-md mx-1"
          >
            <Text className="text-center text-lg text-white">
              {selectedEquipment}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openFilterModal("muscle")}
            className="flex-1 p-3 bg-gray-900 rounded-md shadow-md mx-1"
          >
            <Text className="text-center text-lg text-white">
              {selectedMuscle}
            </Text>
          </TouchableOpacity>

          {shouldShowReset && (
            <TouchableOpacity
              onPress={() => {
                onSelectEquipment("All Equipment");
                onSelectMuscle("All Muscle");
              }}
            >
              <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Swipeable Modal with custom styles */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        style={{ justifyContent: "flex-end", margin: 0 }}
        backdropOpacity={0.8}
        backdropColor="black"
      >
        <View className="bg-zinc-800 rounded-t-2xl pb-4 max-h-[75%] w-full">
          {/* Handle and Header */}
          <View className="items-center py-2  my-1">
            <View className="w-12 h-1.5 bg-gray-400 rounded-full mb-2" />
            <Text className="text-white text-xl font-bold py-2">
              Select {modalType === "equipment" ? "Equipment" : "Muscle"}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="bg-zinc-600 m-3 py-1 rounded-lg "
          >
            {(modalType === "equipment" ? allEquipment : allMuscle).map(
              (item, index, array) => (
                <TouchableOpacity
                  key={item.id}
                  className={`py-6 px-4 ${
                    index !== array.length - 1 ? "border-b border-gray-40" : ""
                  }`}
                  onPress={() => handleSelectFilter(item.name)}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white text-lg tracking-wider font-semibold">
                      {item.name}
                    </Text>
                    {item.name === currentSelected && (
                      <AntDesign name="check" size={24} color="#3B82F9" />
                    )}
                  </View>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
