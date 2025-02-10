import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import CustomKeyboard from "@/components/customKeyboard";

interface FormState {
  email: string;
  password: string;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState<Boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { resetPassword } = useAuth();

  const handleChange = (name: string, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    const { email, password } = form;
    setEmailError(null); // Clear previous errors
    setPasswordError(null); // Clear previous errors

    if (!email || !password) {
      if (!email) setEmailError("Email is required.");
      if (!password) setPasswordError("Password is required.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await resetPassword(email, password);
      Alert.alert("Success", "Password reset successfully.");
      router.replace("/signIn"); // Redirect to sign-in page
    } catch (error: any) {
      Alert.alert("Error", error.message || "Password reset failed.");
    }
  };

  return (
    <CustomKeyboard>
      <View className="flex-1 justify-center items-center px-4 bg-gray-50">
        <Text className="text-3xl font-bold mb-2 text-gray-800">
          Reset Password
        </Text>
        <Text className="text-medium text-gray-600 mb-9 text-center">
          Enter your email and new password to reset it.
        </Text>

        {/* Email Label & Input */}
        <View className="w-full mb-5">
          <Text className="text-gray-700 font-semibold mb-2">
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
          {emailError && (
            <Text className="text-red-500 text-sm m-1">{emailError}</Text>
          )}
        </View>

        {/* Password Label & Input */}
        <View className="w-full mb-6">
          <Text className="text-gray-700 font-semibold mb-2">New Password</Text>

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
          {passwordError && (
            <Text className="text-red-500 text-sm m-1">{passwordError}</Text>
          )}
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity
          className="bg-zinc-900 rounded-xl justify-center items-center p-4 w-full"
          onPress={handleForgotPassword}
        >
          <Text className="font-bold text-white tracking-wider">
            Reset Password
          </Text>
        </TouchableOpacity>

        {/* Navigation to Sign In */}
      </View>
      <View className="  mb-4 flex-row justify-center items-center w-full">
        <Text className="font-semibold text-neutral-500">
          Remembered your password?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/signIn")}>
          <Text className="font-bold text-indigo-500">Sign In</Text>
        </TouchableOpacity>
      </View>
    </CustomKeyboard>
  );
}
