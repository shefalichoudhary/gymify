import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Modal from "react-native-modal";

interface RestTimerModalProps {
  visible: boolean;
  selectedTime?: string | number; // Default to "OFF" if undefined
  onSelect: (time: string) => void;
  onClose: () => void;
}

const RestTimerModal: React.FC<RestTimerModalProps> = ({
  visible,
  selectedTime = "OFF",
  onSelect,
  onClose,
}) => {
  const options = ["OFF", "30", "45", "60", "90", "120"];
  const [currentSelected, setCurrentSelected] = useState<string | number>(
    selectedTime
  );
  const flatListRef = useRef<FlatList>(null);

  const ITEM_HEIGHT = 55; // Height of each item in the FlatList

  // Function to calculate the closest option based on scroll position
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT); // Calculate the closest index
    const selectedOption = options[index];
    setCurrentSelected(selectedOption); // Update the current selected option
  };

  useEffect(() => {
    if (visible && flatListRef.current) {
      const index = options.findIndex((opt) => opt === selectedTime.toString());
      if (index >= 0) {
        flatListRef.current.scrollToOffset({
          offset: index * ITEM_HEIGHT,
          animated: false,
        });
      }
    }
  }, [visible]);

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
      <View
        style={{
          backgroundColor: "#1E293B",
          borderRadius: 16,
          paddingBottom: 16,
          maxHeight: "50%",
          width: "100%",
        }}
      >
        {/* Handle and Header */}
        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <View
            style={{
              width: 48,
              height: 6,
              backgroundColor: "#9CA3AF",
              borderRadius: 3,
              marginBottom: 8,
            }}
          />
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "bold" }}>
            Rest Timer
          </Text>
        </View>

        {/* Scrollable Options */}
        <View style={{ maxHeight: ITEM_HEIGHT * 3, position: "relative" }}>
          {/* Center Overlay */}
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: ITEM_HEIGHT,
              marginTop: -ITEM_HEIGHT / 1,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
              zIndex: 10,
            }}
          />

          <FlatList
            ref={flatListRef}
            data={options}
            keyExtractor={(item) => item}
            contentContainerStyle={{
              paddingVertical: ITEM_HEIGHT * 0.3, // Add padding to center items
            }}
            renderItem={({ item: time }) => {
              const isSelected = currentSelected === time; // Check if the current time is selected
              return (
                <View
                  style={{
                    height: ITEM_HEIGHT,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: isSelected ? "#3B82F9" : "#FFFFFF",
                    }}
                  >
                    {time === "OFF" ? "OFF" : `${time} sec`}
                  </Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT} // Snap to each item
            decelerationRate="fast" // Smooth scrolling
            onMomentumScrollEnd={handleScrollEnd} // Trigger when scrolling stops
          />
        </View>

        {/* Done Button */}
        <TouchableOpacity
          onPress={() => {
            onSelect(currentSelected.toString());
            onClose();
          }}
          style={{
            backgroundColor: "#3B82F9",
            paddingVertical: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            marginTop: 16,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default RestTimerModal;
