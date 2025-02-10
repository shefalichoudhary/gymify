import React, { useState } from "react";
import { useAuth } from "../context/authContext";
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
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomKeyboard from "@/components/customKeyboard";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleAuthButton from "@/components/googleAuthButton";

interface FormState {
  username: string;
  email: string;
  password: string;
}

interface Errors {
  emailError: string | null;
  passwordError: string | null;
}

function SignUp(): JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    emailError: null,
    passwordError: null,
  });
  const { register } = useAuth();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState: any) => !prevState);
  };

  const validateInput = ({
    email,
    password,
  }: {
    email?: string;
    password?: string;
  }) => {
    let emailError: string | null = null;
    let passwordError: string | null = null;

    // Validate email
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailError = "Please enter a valid email address!";
      }
    }

    // Validate password
    if (password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      if (!passwordRegex.test(password)) {
        passwordError =
          "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.";
      }
    }

    setErrors({ emailError, passwordError });

    return emailError || passwordError ? false : true;
  };

  const handleRegister = async (): Promise<void> => {
    const { email, password, username } = form;

    // Check if all fields are empty and show alert
    if (!email && !password && !username) {
      Alert.alert("Sign Up", "Please fill all the fields!");
      return;
    }

    // Validate the fields
    const isValid = validateInput({ email, password });
    if (!isValid) {
      return;
    }

    // Proceed with registration if no errors
    try {
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
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyboard>
        <StatusBar style="dark" />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-5xl font-bold text-black text-center mb-8">
            Create Your Account
          </Text>

          {/* Form Container */}
          <View className="w-full max-w-md gap-6">
            {/* Username Input */}
            <View className="w-full ">
              <Text className="font-semibold tracking-widest text-lg text-neutral-700 mb-1 ml-2">
                Username
              </Text>

              <TextInput
                className="p-4 border border-gray-300 rounded-lg bg-neutral-100 text-neutral-700"
                placeholder="username"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                value={form.username}
                onChangeText={(value) => handleChange("username", value)}
              />
            </View>

            {/* Email Input */}
            <View className="w-full ">
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
            <View className="w-full ">
              <Text className="font-semibold tracking-wider text-lg text-neutral-700 mb-1 ml-2">
                Password
              </Text>

              <View className="flex-row p-2 border border-gray-300 rounded-lg bg-neutral-100 items-center">
                <TextInput
                  value={form.password}
                  onChangeText={(text) => handleChange("password", text)}
                  className="flex-1 text-neutral-700"
                  placeholder="Minimum 8 characters"
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

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleRegister}
            className="bg-zinc-900 rounded-xl justify-center items-center p-4 w-full mt-4"
          >
            <Text className="font-bold text-white tracking-wider">
              {loading ? <ActivityIndicator color="white" /> : "Sign Up"}
            </Text>
          </TouchableOpacity>
          <GoogleAuthButton label="Sign up with Google" />
        </View>

        {/* Footer - Positioned at the bottom */}
        <View className="mb-4 flex-row justify-center items-center w-full">
          <Text className="font-semibold text-neutral-500">
            Already have an account?
          </Text>
          <Pressable onPress={() => router.replace("/signIn")}>
            <Text className="text-sm font-bold text-indigo-500">Sign In</Text>
          </Pressable>
        </View>
      </CustomKeyboard>
    </SafeAreaView>
  );
}

export default SignUp;
