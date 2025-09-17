import { Stack, useRouter } from "expo-router";
import { Pressable, Box } from "@gluestack-ui/themed";
import { AntDesign } from "@expo/vector-icons";
import CustomHeader from "@/components/customHeader";

export default function AuthLayout() {
  const router = useRouter();

  const getTitle = (routeName: string | undefined) => {
    switch (routeName) {
      case "signIn":
        return "Login";
      case "signUp":
        return "Sign Up";
      case "forgotPassword":
        return "Reset Password";
      default:
        return "";
    }
  };

  return (
    <Stack
      screenOptions={({ route }) => ({
        header: () => (
          <CustomHeader
            left={
              <Pressable onPress={() => router.push("/(tabs)/home")}>
                <AntDesign name="arrowleft" size={24} color="white" />
              </Pressable>
            }
            title={getTitle(route.name)}
            right={<Box width={40} />} // keep title centered
          />
        ),
      })}
    >
      <Stack.Screen name="signIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="forgotPassword" />
    </Stack>
  );
}
