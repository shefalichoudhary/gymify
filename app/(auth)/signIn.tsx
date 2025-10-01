import React, { useState ,} from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter,useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/authContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  GoogleSignin,

} from '@react-native-google-signin/google-signin';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// Gluestack UI
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,

  FormControlLabelText,
  Input,
  InputField,
 Image,
  Box,
  VStack,
  HStack,
  Text,
  Pressable,
  AlertCircleIcon,
} from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import CustomButton from "@/components/customButton";

interface FormState {
  email: string;
  password: string;
}
GoogleSignin.configure({
  webClientId: '756288749216-vr6ijqcj6j368qc2s7bhr6kd2f5n4c0a.apps.googleusercontent.com', // Required for offline access / server auth
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  scopes: ['profile', 'email'],
});
function SignIn(): JSX.Element {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login ,signInWithGoogle} = useAuth();

  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

const params = useLocalSearchParams();
const redirectTo = Array.isArray(params.redirectTo) ? params.redirectTo[0] : params.redirectTo;
const routineTitle = Array.isArray(params.title) ? params.title[0] : params.title;
const routineExercises = Array.isArray(params.exercises) ? params.exercises[0] : params.exercises;
const routineData = Array.isArray(params.data) ? params.data[0] : params.data;
  const handleChange = (key: keyof FormState, value: string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const togglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSignIn = async (): Promise<void> => {
    const { email, password } = form;
      setFieldErrors({});
    try {
      if (!email || !password) throw new Error("Email and password are required.");

      await login(email.trim(), password);
      setError("");
      setForm({ email: "", password: "" });

      if (redirectTo) {
  router.replace({
    pathname: "/createRoutine",
    params: {
      title: routineTitle,
      exercises: routineExercises,
      data: routineData,
    },
  });
} else {
  router.replace("/home");
}
    } catch (err: any) {
    if (err.message.includes("not found")) {
      setFieldErrors({ email: "User not found with this email." });
    } else if (err.message.includes("Incorrect password")) {
      setFieldErrors({ password: "Incorrect password." });
    } else {
      setFieldErrors({ email: "Login failed. Please try again." });
    }
  }
};

  return (
  <Box flex={1} bg="black">
  <KeyboardAwareScrollView
    enableOnAndroid
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
  >
    <StatusBar style="light" />

    <VStack
      flex={1}
      pt="$16"
      px="$5"
      space="lg" // 🔥 reduce space so "Forgot password?" isn’t pushed too far
      width="100%"
      maxWidth={800}
      alignSelf="center"
    >
      {/* Title */}
      <Text size="4xl" bold color="$textLight50" textAlign="center" mb="$4">
        Login
      </Text>

      {/* Email */}
      <FormControl isInvalid={!!fieldErrors.email}>
        <FormControlLabel>
          <FormControlLabelText color="$textLight50">
            Email
          </FormControlLabelText>
        </FormControlLabel>
        <Input bg="$backgroundDark800" rounded="$lg" borderWidth={0} size="md">
          <InputField
            placeholder="example@gmail.com"
            placeholderTextColor="$textLight400"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
            color="$textLight50"
          />
        </Input>
        {fieldErrors.email && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} color="$error500" />
            <FormControlErrorText color="$error500">
              {fieldErrors.email}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Password */}
      <FormControl isInvalid={!!fieldErrors.password}>
        <FormControlLabel>
          <FormControlLabelText color="$textLight50">
            Password
          </FormControlLabelText>
        </FormControlLabel>
        <Input bg="$backgroundDark800" rounded="$lg" borderWidth={0} size="md">
          <InputField
            placeholder="minimum 6 characters"
            placeholderTextColor="$textLight400"
            autoCapitalize="none"
            secureTextEntry={!isPasswordVisible}
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            color="$textLight50"
          />
          <TouchableOpacity
            onPress={togglePassword}
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              zIndex: 1,
            }}
            hitSlop={10}
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </Input>
        {fieldErrors.password && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} color="$error500" />
            <FormControlErrorText color="$error500">
              {fieldErrors.password}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Forgot Password - moved closer */}
      <Pressable onPress={() => router.push("/forgotPassword")}>
        <Text size="sm" color="$blue500" bold textAlign="right" >
          Forgot password?
        </Text>
      </Pressable>

      {/* Error Message */}
      {error !== "" && (
        <Text size="sm" color="$error500" mt="$2" textAlign="center">
          {error}
        </Text>
      )}

      {/* Sign In Button */}
      <CustomButton
        onPress={handleSignIn}
        bg="$blue500"
      >
        Sign In
      </CustomButton>

<CustomButton
        onPress={signInWithGoogle}
        bg="$black"
        borderWidth={1}
        borderColor="$textLight400"
        icon={<MaterialCommunityIcons name="google" size={20} color="white" marginLeft={2} />}
      >
        Continue with Google
      </CustomButton>
    </VStack>
  </KeyboardAwareScrollView>

  {/* Footer */}
    <HStack justifyContent="center" alignItems="center" py="$4">
      <Text color="$textLight400" mr="$1">
        Don’t have an account?
      </Text>
      <Pressable onPress={() => router.push("/signUp")}>
        <Text size="sm" bold color="$blue500">
          Sign Up
        </Text>
      </Pressable>
    </HStack>
</Box>

);
}
export default SignIn ;