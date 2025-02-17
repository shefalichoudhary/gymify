import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";
import CustomButton from "@/components/customeButton";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

interface FormState {
  email: string;
  password: string;
}

let emailCheckTimeout: NodeJS.Timeout | null = null; // Global variable for debounce

export default function ForgotPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [ispasswordVisible, setIsPasswordVisible] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Function to check if user exists
  const checkUserExists = async (email: string) => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return false;

    setCheckingEmail(true);
    try {
      const foundUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();
      return !!foundUser;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    } finally {
      setCheckingEmail(false);
    }
  };

  // Live Validation on Input Change (with manual debounce)
  const handleChange = async (name: keyof FormState, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    let newErrors = { ...errors };

    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "Please enter your email.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Invalid email format.";
      } else {
        // ✅ Perform the check asynchronously and update errors later
        setCheckingEmail(true);
        try {
          const foundUser = await db
            .select()
            .from(users)
            .where(eq(users.email, value.trim()))
            .get();

          if (!foundUser) {
            newErrors.email = "Email not found. Please sign up.";
          } else {
            delete newErrors.email;
          }
        } catch (error) {
          console.error("Error checking email:", error);
        }
        setCheckingEmail(false);
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        newErrors.password = "Password is required.";
      } else if (value.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleForgotPassword = async () => {
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const userExists = await checkUserExists(form.email);
      if (!userExists) {
        throw new Error("No account found with this email.");
      }

      await resetPassword(form.email, form.password);
      setLoading(false);
      Alert.alert("Success", "Password reset successfully.", [
        { text: "OK", onPress: () => router.push("/signIn") },
      ]);
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error", error.message || "Password reset failed.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-4 bg-gray-50">
      <Text className="text-3xl font-bold mb-2 text-gray-800">
        Reset Password
      </Text>
      <Text className="text-medium text-gray-600 mb-6 text-center">
        Enter your email and new password to reset it.
      </Text>

      {/* Email Input */}
      <View className="w-full mb-3">
        <TextInput
          className="w-full p-3 border border-gray-300 rounded-lg mb-2 text-gray-700"
          placeholder="example@gmail.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
        />
        {checkingEmail && (
          <Text className="text-blue-500 text-sm ml-2">Checking email...</Text>
        )}
        {errors.email && (
          <Text className="text-red-500 text-sm ml-2">{errors.email}</Text>
        )}
      </View>

      {/* Password Input with Eye Toggle */}
      <View className="w-full relative">
        <TextInput
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 pr-12"
          placeholder="New Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!ispasswordVisible}
          value={form.password}
          onChangeText={(value) => handleChange("password", value)}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!ispasswordVisible)}
          className="absolute right-3 top-3"
        >
          <Feather
            name={ispasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text className="text-red-500 text-sm ml-2">{errors.password}</Text>
      )}

      {/* Reset Button with Loading */}
      <CustomButton
        onPress={handleForgotPassword}
        text="Reset Password"
        bgColor="bg-zinc-900"
        loading={loading}
      />

      {/* Sign In Link */}
      <View className="absolute bottom-8 flex-row justify-center items-center w-full">
        <Text className="font-semibold text-neutral-500">
          Remembered your password?{" "}
        </Text>
        <Text
          className="font-bold text-indigo-500"
          onPress={() => router.push("/signIn")}
        >
          Sign In
        </Text>
      </View>
    </View>
  );
}
