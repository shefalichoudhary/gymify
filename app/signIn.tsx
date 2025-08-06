import React, { useState ,} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter,useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/authContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


// Gluestack UI Components
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, VStack } from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";

interface FormState {
  email: string;
  password: string;
}

function SignIn(): JSX.Element {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login } = useAuth();
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
    <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
           enableOnAndroid
           keyboardShouldPersistTaps="handled"
           contentContainerStyle={{  flexGrow: 1,paddingVertical:100}}
         >

   
           <StatusBar style="dark" />
       <VStack className="w-full m-auto max-w-[800px]  p-4 " >
           <Text className="text-5xl font-bold text-black text-center mb-8">
            Login</Text>

            <FormControl isRequired>
              <VStack space="md">
                {/* Email */}
                <FormControlLabel>
                  <FormControlLabelText>Email</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="example@gmail.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(text) => handleChange("email", text)}
                  />
                </Input>
                {fieldErrors.email && (
    <Text className="text-red-500 text-sm mt-1">{fieldErrors.email}</Text>
  )}

                {/* Password */}
                <FormControlLabel>
                  <FormControlLabelText>Password</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="minimum 6 characters"
                    autoCapitalize="none"
                    secureTextEntry={!isPasswordVisible}
                    value={form.password}
                    onChangeText={(text) => handleChange("password", text)}
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
    <Text className="text-red-500 text-sm mt-1">{fieldErrors.password}</Text>
  )}
              </VStack>
            </FormControl>

            {/* Forgot Password */}
            <TouchableOpacity style={{ marginTop: 10 }}>
              <Pressable onPress={() => router.replace("/forgotPassword")}>
                <Text className="text-right text-neutral-500 font-semibold">
                  Forgot password?
                </Text>
              </Pressable>
            </TouchableOpacity>

            {/* Error message */}
            {error !== "" && (
              <Text className="text-red-500 mt-3 text-sm font-medium">{error}</Text>
            )}

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              className="bg-zinc-900 rounded-xl justify-center items-center p-4 w-full mt-6"
            >
              <Text className="text-white font-bold text-lg">Sign In</Text>
            </TouchableOpacity>
          </VStack>
         </KeyboardAwareScrollView>

          {/* Footer */}
          <View className="mt-10 flex-row justify-center items-center">
            <Text className="font-semibold text-neutral-500">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/signUp")}>
              <Text className="text-sm font-bold text-indigo-500">Sign Up</Text>
            </Pressable>
          </View>
    </SafeAreaView>
  );
}

export default SignIn;
