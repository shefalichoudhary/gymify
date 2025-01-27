import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomKeyboard from "@/components/customKeyboard";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormState {
  username: string;
  email: string;
  password: string;
}

function SignUp(): JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null); // For showing email error
  const { register } = useAuth();

  const togglePassword = () => {
    setIsPasswordVisible((prevState: any) => !prevState);
  };

  const validateInput = ({
    email,
    password,
  }: {
    email?: string;
    password?: string;
  }) => {
    const errors: string[] = [];

    // Validate email
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push("Please enter a valid email address!");
      }
    }

    // Validate password
    if (password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      if (!passwordRegex.test(password)) {
        errors.push(
          "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
        );
      }
    }

    return errors;
  };

  const handleEmailChange = (email: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      email,
    }));
  };

  const handleRegister = async (): Promise<void> => {
    const { email, password, username } = form;

    try {
      if (!email || !password || !username) {
        Alert.alert("Sign Up", "Please fill all the fields!");
        return;
      }

      const errors = validateInput({ email, password });
      if (errors.length > 0) {
        Alert.alert("Sign Up", errors.join("\n"));
        return;
      }

      if (emailError) {
        Alert.alert("Sign Up", emailError); // Show email error
        return;
      }

      setLoading(true);
      await register(username.trim(), email.trim(), password);
      setLoading(false);
      setForm({ username: "", email: "", password: "" });
    } catch (error: any) {
      setLoading(false);
      Alert.alert(
        "Sign Up Error",
        error.message || "An unexpected error occurred."
      );
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  return (
    <CustomKeyboard>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-5xl font-bold text-black text-center mb-8">
            Create Your Account
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
                  className="flex-1 ml-1 ont-medium text-gray-800"
                  placeholder="username"
                  placeholderTextColor="gray"
                />
              </View>
            </View>

            {/* Email Input */}
            <View>
              <Text className="font-semibold  tracking-wider text-lg text-neutral-700 mb-1 ml-2">
                Email
              </Text>
              <View className="flex-row items-center p-2 bg-neutral-100 rounded-xl">
                <TextInput
                  value={form.email}
                  onChangeText={handleEmailChange} // Use the new handler
                  className="flex-1 ml-1 ont-medium text-gray-800"
                  placeholder="example@gmail.com"
                  placeholderTextColor="gray"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
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
                  className="flex-1 ml-1 ont-medium text-gray-800"
                  placeholder="minimum 6 characters"
                  placeholderTextColor="gray"
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={togglePassword}>
                  <Feather
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleRegister}
              className="bg-zinc-900 rounded-xl justify-center items-center p-4 w-full mt-4"
            >
              <Text className="font-bold text-white tracking-wider">
                {loading ? <ActivityIndicator color="white" /> : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
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
    </CustomKeyboard>
  );
}

export default SignUp;
