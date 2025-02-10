import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type CustomHeaderProps = {
  title: string;
  leftLabel: string;
  rightLabel: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export default function CustomHeader({
  title,
  leftLabel,
  rightLabel,
  onLeftPress,
  onRightPress,
}: CustomHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between bg-white p-4 shadow-md">
      {/* Left Button */}
      <TouchableOpacity
        onPress={onLeftPress ? onLeftPress : () => router.back()}
        className="p-2"
      >
        <Text className=" tracking-wider text-blue-500  font-semibold text-lg">
          {leftLabel}
        </Text>
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-lg  font-semibold tracking-wider">{title}</Text>

      {/* Right Button */}
      <TouchableOpacity
        onPress={onRightPress}
        className="px-4 py-2 bg-blue-500 rounded-md shadow-md active:opacity-75"
      >
        <Text className="text-white font-semibold text-lg tracking-wider">
          {rightLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
