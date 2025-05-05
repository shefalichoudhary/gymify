import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

interface RepsModalProps {
  visible: boolean;
  selectedType: string; // "Reps" or "Range Reps"
  onSelect: (type: "Reps" | "Rep Range") => void;
  onClose: () => void;
}

const RepsModal: React.FC<RepsModalProps> = ({
  visible,
  selectedType,
  onSelect,
  onClose,
}) => {
  const [repsType, setRepsType] = useState<string>(selectedType);

  // Sync repsType with selectedType when selectedType changes
  useEffect(() => {
    setRepsType(selectedType);
  }, [selectedType]);

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
            Repetition Options
          </Text>
        </View>
        <View
          className="flex-col  gap-4 
        bg-zinc-600 m-3 py-1 rounded-lg "
        >
          {["Reps", "Rep Range"].map((option, index, array) => {
            const isSelected = repsType === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  onSelect(option as "Reps" | "Rep Range");
                  onClose();
                }}
                accessibilityLabel={`Select ${option} as the reps type`}
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

export default RepsModal;
