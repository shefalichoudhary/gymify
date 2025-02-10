import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

type CustomButtonProps = {
  onPress: () => void;
  text: string;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  bgColor?: string;
  textColor?: string;
  additionalStyles?: string;
  loading?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  text,
  icon,
  iconSize = 20,
  iconColor = "white",
  bgColor = "bg-zinc-900",
  textColor = "text-white",
  additionalStyles = "",
  loading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`${bgColor} rounded-xl justify-center items-center p-4 w-full mt-4 ${additionalStyles}`}
    >
      <View className="flex-row items-center">
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            {icon && (
              <FontAwesome6 name={icon} size={iconSize} color={iconColor} />
            )}
            <Text
              className={`font-bold ${textColor} tracking-wider ${
                icon ? "ml-3" : ""
              }`}
            >
              {text}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
