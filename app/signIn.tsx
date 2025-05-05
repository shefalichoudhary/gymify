import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface FormState {
  email: string;
  password: string;
}

function SignIn(): JSX.Element {
  const { login } = useAuth();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();

  const handleChange = (key: keyof FormState, value: string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleSignIn = async (): Promise<void> => {
    const { email, password } = form;
    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      await login(email.trim(), password);
      setError("");
      setForm({ email: "", password: "" });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <View className="flex-1 px-4">
      {/* Center the form */}
      <View className="flex-1 justify-center items-center">
        <Text className="mb-9 text-4xl tracking-widest font-bold text-black text-center">
          Login
        </Text>

        <View className="w-full gap-5">
          {/* Email Input */}
          <View>
            <Text className="font-semibold text-lg text-neutral-700 mb-1 ml-2">
              Email
            </Text>
            <View className="flex-row p-2 bg-neutral-100 items-center rounded-xl">
              <TextInput
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                className="flex-1 font-medium tracking-wider text-neutral-700"
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
            <View className="flex-row p-2 bg-neutral-100 items-center rounded-xl">
              <TextInput
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                className="flex-1 font-medium text-neutral-700"
                placeholder="minimum 6 characters"
                placeholderTextColor="gray"
                autoCapitalize="none"
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Feather
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity>
            <Pressable onPress={() => router.replace("/forgotPassword")}>
              <Text className="font-semibold text-right text-neutral-500">
                Forgot password?
              </Text>
            </Pressable>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          className="bg-zinc-900 rounded-xl justify-center items-center p-4 w-full mt-4"
        >
          <Text className="font-bold text-white tracking-wider">Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="absolute bottom-8 flex-row justify-center items-center w-full">
        <Text className="font-semibold text-neutral-500">
          Don't have an account?{" "}
        </Text>
        <Pressable onPress={() => router.replace("/signUp")}>
          <Text className="text-sm font-bold text-indigo-500">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default SignIn;
