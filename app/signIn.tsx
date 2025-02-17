import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import CustomButton from "@/components/customeButton";
import GoogleAuthButton from "@/components/googleAuthButton";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import bcrypt from "react-native-bcrypt";
import { db } from "../db/db";

interface FormState {
  email: string;
  password: string;
}

interface ErrorState {
  email?: string;
  password?: string;
}

function SignIn(): JSX.Element {
  const { login } = useAuth();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<ErrorState>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const validateField = async (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    let newErrors: ErrorState = { ...errors };

    if (key === "email") {
      if (!value.trim()) {
        newErrors.email = "Please enter your email.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Invalid email format.";
      } else {
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
      }
    }

    if (key === "password") {
      if (!value) {
        newErrors.password = "Please enter your password.";
        console.log(newErrors.password);
      } else {
        try {
          // Fetch the user using the email
          const foundUser = await db
            .select()
            .from(users)
            .where(eq(users.email, form.email.trim()))
            .get();

          if (!foundUser) {
            newErrors.email = "Email not found. Please sign up.";
          } else if (!bcrypt.compareSync(value, foundUser.password)) {
            newErrors.password = "Incorrect password. Try again.";
          } else {
            delete newErrors.password;
          }
        } catch (error) {
          console.error("Error checking password:", error);
        }
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (key: keyof FormState, value: string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleSignIn = async (): Promise<void> => {
    const { email, password } = form;
    let newErrors: ErrorState = {};

    if (!email.trim()) newErrors.email = "Please enter your email.";
    if (!password) newErrors.password = "Please enter your password.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(email.trim(), password);
      setForm({ email: "", password: "" });
      setErrors({});
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Email not found")) {
          setErrors({ email: "Email not found. Please sign up." });
        } else if (err.message.includes("Incorrect password")) {
          setErrors({ password: "Incorrect password. Try again." });
        } else {
          Alert.alert("Login Failed", "Invalid email or password.", [
            { text: "OK" },
          ]);
        }
      }
    }
  };

  return (
    <View className="flex-1 px-4">
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

          <TouchableOpacity>
            <Pressable onPress={() => router.replace("/forgotPassword")}>
              <Text className="font-semibold text-right text-neutral-500">
                Forgot password?
              </Text>
            </Pressable>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <CustomButton
          text="Sign In"
          bgColor="bg-zinc-900"
          onPress={handleSignIn}
        />
        <GoogleAuthButton label="Sign in with Google" />
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
