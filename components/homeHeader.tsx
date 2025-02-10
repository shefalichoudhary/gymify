import { View, Text, Platform, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/authContext";

const ios = Platform.OS == "ios";

export default function HomeHeader() {
  const { logout } = useAuth();
  const { top } = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View
      style={{ paddingTop: ios ? top : top + 11 }}
      className="flex-row justify-between items-center px-5 bg-zinc-900  pb-5 shadow"
    >
      {/* Left side: Logo + Name */}
      <View className="flex-row items-center">
        <Image
          source={require("../assets/images/logo.png")}
          style={{ height: 60, width: 30 }} // Adjust logo size & spacing
        />
        <Text className="text-xl font-bold tracking-[.18em] text-white">
          GYMIFY
        </Text>
      </View>

      {/* Right side: Logout Button */}
      <TouchableOpacity
        className="bg-zinc-900 rounded-xl px-4 py-2"
        onPress={handleLogout}
      >
        <Text className="font-bold text-white tracking-wider">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
