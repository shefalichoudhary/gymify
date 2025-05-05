import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";

interface WeightUnitModalProps {
  visible: boolean;
  unit?: "kg" | "lbs"; // Default to "kg" if undefined
  onSelect: (unit: "kg" | "lbs") => void;
  onClose: () => void;
}

const WeightUnitModal = ({
  visible,
  unit = "kg", // Default to "kg"
  onSelect,
  onClose,
}: WeightUnitModalProps) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={{ justifyContent: "flex-end", margin: 0 }}
      backdropColor="black"
      backdropOpacity={0.8}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View className="bg-zinc-800 rounded-t-2xl pb-4 max-h-[75%] w-full">
        {/* Handle and Header */}
        <View className="items-center py-2  my-1">
          <View className="w-12 h-1.5 bg-gray-400 rounded-full mb-2" />
          <Text className="text-white text-xl font-bold py-2">
            Weight Units
          </Text>
        </View>
        <View
          className="flex-col  gap-4 
             bg-zinc-600 m-3 py-1 rounded-lg "
        >
          {["kg", "lbs"].map((option, index, array) => {
            const isSelected = unit === option; // Check if the current option is selected
            return (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  onSelect(option as "kg" | "lbs");
                  onClose();
                }}
                accessibilityLabel={`Select ${option} as the weight unit`}
                className={`py-4 px-4 ${
                  index !== array.length - 1 ? "border-b border-gray-400" : ""
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-white text-lg tracking-wider font-semibold">
                    {option}
                  </Text>

                  {isSelected && (
                    <AntDesign name="check" size={24} color="#3B82F9" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

export default WeightUnitModal;
