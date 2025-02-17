import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customeButton";
import GoogleAuthButton from "@/components/googleAuthButton";
import CustomKeyboard from "@/components/customKeyboard";
import { db } from "../db/db";
import { users } from "../db/schema";

import { eq } from "drizzle-orm";

interface FormState {
  username: string;
  email: string;
  password: string;
}

interface ErrorState {
  username?: string;
  email?: string;
  password?: string;
}

function SignUp(): JSX.Element {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const validateField = (key: keyof FormState, value: string) => {
    let newErrors: ErrorState = { ...errors };

    if (key === "username") {
      if (!value.trim()) {
        newErrors.username = "Username is required.";
      } else {
        delete newErrors.username;
      }
    }

    if (key === "email") {
      if (!value.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Invalid email format.";
      } else {
        delete newErrors.email;
      }
    }

    if (key === "password") {
      if (!value) {
        newErrors.password = "Password is required.";
      } else if (
        value.length < 6 ||
        !/[A-Z]/.test(value) ||
        !/\d/.test(value) ||
        !/[!@#$%^&*]/.test(value)
      ) {
        newErrors.password =
          "Must be  characters, include uppercase, number, and special character.";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const checkExistingUser = async (key: keyof FormState, value: string) => {
    try {
      if (value.trim().length === 0) return;

      // Fetch user by email or username
      const foundUser = await db
        .select()
        .from(users)
        .where(eq(users[key], value.trim()))
        .get();

      if (foundUser) {
        setErrors((prev) => ({
          ...prev,
          [key]:
            key === "username"
              ? "This username is already taken."
              : "This email is already in use.",
        }));
      } else {
        setErrors((prev) => {
          const { [key]: removedError, ...rest } = prev; // Remove error if it was set before
          return rest;
        });
      }
    } catch (error) {
      console.error(`Error checking existing ${key}:`, error);
    }
  };

  const handleChange = (key: keyof FormState, value: string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
    checkExistingUser(key, value);
  };

  const handleRegister = async (): Promise<void> => {
    const { email, password, username } = form;
    let newErrors: ErrorState = {};

    if (!username.trim()) newErrors.username = "Please enter a username.";
    if (!email.trim()) newErrors.email = "Please enter your email.";
    if (!password) newErrors.password = "Please enter your password.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await register(username.trim(), email.trim(), password);
      setLoading(false);
      setForm({ username: "", email: "", password: "" });
      setErrors({});
    } catch (error: any) {
      setLoading(false);
      Alert.alert(
        "Sign Up Error",
        error.message || "An unexpected error occurred."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-4xl font-bold text-black text-center mb-8">
          Create Account
        </Text>

        {/* Form Container */}
        <View className="w-full max-w-md gap-4">
          {/* Username Input */}
          <View>
            <Text className="font-semibold text-lg tracking-wider text-neutral-700 mb-1 ml-2">
              Username
            </Text>
            <View className="flex-row items-center p-2 bg-neutral-100 rounded-xl">
              <TextInput
                value={form.username}
                onChangeText={(text) => handleChange("username", text)}
                className="flex-1 ml-1 font-medium text-gray-800"
                placeholder="Username"
                placeholderTextColor="gray"
              />
            </View>
            {errors.username && (
              <Text className="text-red-500 text-sm ml-2">
                {errors.username}
              </Text>
            )}
          </View>

          {/* Email Input */}
          <View>
            <Text className="font-semibold tracking-wider text-lg text-neutral-700 mb-1 ml-2">
              Email
            </Text>
            <View className="flex-row items-center p-2 bg-neutral-100 rounded-xl">
              <TextInput
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                className="flex-1 ml-1 font-medium text-gray-800"
                placeholder="example@gmail.com"
                placeholderTextColor="gray"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 text-sm ml-2">{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View>
            <Text className="font-semibold tracking-wider text-lg text-neutral-700 mb-1 ml-2">
              Password
            </Text>
            <View className="flex-row items-center p-2 bg-neutral-100 rounded-xl">
              <TextInput
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                className="flex-1 font-medium text-neutral-700 pr-2"
                placeholder="minimum 6 characters"
                placeholderTextColor="gray"
                autoCapitalize="none"
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                className="p-2"
              >
                <Feather
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-sm ml-2">
                {errors.password}
              </Text>
            )}
          </View>
        </View>

        {/* Sign Up Button */}

        <CustomButton
          text="Sign Up"
          loading={loading}
          bgColor="bg-zinc-900"
          onPress={handleRegister}
        />

        <GoogleAuthButton label="Sign up with Google" />
      </View>

      {/* Footer - Positioned at the bottom */}
      <View className="absolute bottom-8 flex-row justify-center items-center w-full">
        <Text className="font-semibold text-neutral-500">
          Already have an account?{" "}
        </Text>
        <Pressable onPress={() => router.replace("/signIn")}>
          <Text className="text-sm font-bold text-indigo-500">Sign In</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default SignUp;
