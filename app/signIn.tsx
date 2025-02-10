import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import GoogleAuthButton from "@/components/googleAuthButton";
import CustomKeyboard from "@/components/customKeyboard";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormState {
  email: string;
  password: string;
}

interface Errors {
  emailError: string | null;
  passwordError: string | null;
}

function SignIn(): JSX.Element {
  const { login } = useAuth();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({
    emailError: null,
    passwordError: null,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (key: keyof FormState, value: string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async (): Promise<void> => {
    const { email, password } = form;
    setErrors({ emailError: null, passwordError: null });

    if (!email || !password) {
      setErrors({
        emailError: email ? null : "Email is required.",
        passwordError: password ? null : "Password is required.",
      });
      return;
    }

    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailError: "Invalid email format.",
      }));
      return;
    }

    if (password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordError: "Password must be at least 6 characters long.",
      }));
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      setLoading(false);
      setForm({ email: "", password: "" });
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyboard>
        <StatusBar style="dark" />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="mb-9 text-4xl tracking-widest font-bold text-black text-center">
            Login
          </Text>

          {/* Form Container */}
          <View className="w-full max-w-md gap-6">
            {/* Email Input */}
            <View className="w-full">
              <Text className="font-semibold tracking-wider text-lg text-neutral-700 mb-1 ml-2">
                Email Address
              </Text>
              <TextInput
                className="p-4 border border-gray-300 rounded-lg bg-neutral-100 text-neutral-700"
                placeholder="example@gmail.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(value) => handleChange("email", value)}
              />
              {errors.emailError && (
                <Text className="text-red-500 text-sm m-1">
                  {errors.emailError}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View className="w-full">
              <Text className="font-semibold tracking-wider text-lg text-neutral-700 mb-1 ml-2">
                Password
              </Text>
              <View className="flex-row p-2 border border-gray-300 rounded-lg bg-neutral-100 items-center">
                <TextInput
                  value={form.password}
                  onChangeText={(text) => handleChange("password", text)}
                  className="flex-1 text-neutral-700"
                  placeholder="Minimum 6 characters"
                  placeholderTextColor="gray"
                  autoCapitalize="none"
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Feather
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={23}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {errors.passwordError && (
                <Text className="text-red-500 text-sm m-1">
                  {errors.passwordError}
                </Text>
              )}
            </View>
          </View>

          {/* Forgot Password */}
          <Pressable
            onPress={() => router.replace("/forgotPassword")}
            className="self-end my-3"
          >
            <Text className="font-semibold text-neutral-500">
              Forgot password?
            </Text>
          </Pressable>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            className="bg-zinc-900 rounded-xl justify-center items-center p-4 w-full mt-4"
          >
            <Text className="font-bold text-white tracking-wider">
              {loading ? <ActivityIndicator color="white" /> : "Sign In"}
            </Text>
          </TouchableOpacity>
          <GoogleAuthButton label="Sign in with Google" />
        </View>

        {/* Footer */}
        <View className="mb-4  flex-row justify-center items-center w-full">
          <Text className="font-semibold text-neutral-500">
            Don't have an account?{" "}
          </Text>
          <Pressable onPress={() => router.replace("/signUp")}>
            <Text className="text-sm font-bold text-indigo-500">Sign Up</Text>
          </Pressable>
        </View>
      </CustomKeyboard>
    </SafeAreaView>
  );
}

export default SignIn;
