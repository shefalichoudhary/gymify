import { View, Text, Platform, Button, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";

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
      className="flex-row justify-between px-5 bg-slate-950 pb-7 rounded-b-3xl shadow"
    >
      <View>
        <Text className="font-medium, text-white">Gymify</Text>
      </View>
      <View>
        <TouchableOpacity
          className="bg-zinc-900 rounded-xl justify-center items-center p-2 w-full"
          onPress={handleLogout}
        >
          <Text className="font-bold text-white tracking-wider">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
