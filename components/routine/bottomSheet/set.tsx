import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

interface SetType {
  key: string;
  label: string;
  icon: string;
}

interface SetTypeModalProps {
  visible: boolean;
  selectedType: string;
  onSelect: (type: string) => void;
  onClose: () => void;
}

const setTypes: SetType[] = [
  { key: "W", label: "Warm-Up Set", icon: "W" },
  { key: "Normal", label: "Normal Set", icon: "N" },
  { key: "D", label: "Drop Set", icon: "D" },
  { key: "F", label: "Failure", icon: "F" },
];

// Define icon colors per type
export const iconColors: Record<string, string> = {
  W: "text-yellow-400",
  N: "text-white",
  D: "text-blue-400",
  F: "text-red-500",
};

const SetTypeModal: React.FC<SetTypeModalProps> = ({
  visible,
  selectedType,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={{ justifyContent: "flex-end", margin: 0 }}
      backdropColor="black"
      backdropOpacity={0.8}
    >
      <View className="bg-zinc-800 rounded-t-2xl pb-4 max-h-[75%] w-full">
        {/* Handle and Header */}
        <View className="items-center py-2 my-1">
          <View className="w-12 h-1.5 bg-gray-400 rounded-full mb-2" />
          <Text className="text-white text-xl font-bold py-2">
            Select Set Type
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="bg-zinc-600 m-3 py-1 rounded-lg"
        >
          {setTypes.map((type, index, array) => (
            <TouchableOpacity
              key={type.key}
              onPress={() => {
                onSelect(type.key);
                onClose();
              }}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Select ${type.label}`}
              className={`py-6 px-4 ${
                index !== array.length - 1 ? "border-b border-gray-400" : ""
              }`}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text
                    className={`text-xl font-bold mr-2 ${
                      iconColors[type.icon] ?? "text-gray-300"
                    }`}
                  >
                    {type.icon}
                  </Text>
                  <Text
                    className={`text-medium font-semibold ml-4 ${
                      selectedType === type.key
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {type.label}
                  </Text>
                </View>

                {type.key === selectedType && (
                  <AntDesign name="check" size={24} color="#3B82F9" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default SetTypeModal;
