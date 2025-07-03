import React from "react";
import { Text } from "@gluestack-ui/themed";
import { Entypo } from "@expo/vector-icons";
import CustomButton from "@/components/customButton";

type Props = {
  onPress: () => void;
};

export default function AddSetButton({ onPress }: Props) {
  return (
    <CustomButton
      mt="$2"
      bg="#1F1F1F"
      onPress={onPress}
      icon={<Entypo name="plus" size={24} color="white" />}
      iconPosition="left"
    >
      <Text color="$white">Add Set</Text>
    </CustomButton>
  );
}
