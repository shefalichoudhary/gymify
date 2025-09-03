import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  Button,
  ButtonText,
  VStack,
  HStack,
  Text,
  Box,
  Pressable,
  FormControlHelper,FormControlHelperText,FormControlErrorIcon
} from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@/context/authContext";

interface FormState {
  username: string;
  email: string;
  password: string;
}

function SignUp(): JSX.Element {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    username: "",
  });

  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const togglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const validateInput = (email: string, password: string, username: string) => {
    let valid = true;

    // Reset errors
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);

    // Username
    if (!username.trim()) {
      setUsernameError("Username is required.");
      valid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    // Password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{6,}$/;
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 6 characters long and include uppercase, lowercase, a number, and a special character."
      );
      valid = false;
    }

    return valid;
  };

  const handleRegister = async (): Promise<void> => {
    const { email, password, username } = form;

    if (!validateInput(email, password, username)) {
      return;
    }

    try {
      setLoading(true);
      await register(username.trim(), email.trim(), password);
      setForm({ username: "", email: "", password: "" });
      router.replace("/home");
    } catch (error: any) {
      if (error.message === "Email already in use") {
        setEmailError(error.message);
      } else if (error.message === "Username already in use") {
        setUsernameError(error.message);
      } else {
        setEmailError(error.message); // fallback error
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  return (
    <Box flex={1} bg="#1F1F1F">
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <StatusBar style="light" />

        <VStack
          flex={1}
          pt="$32"
          px="$5"
          space="lg"
          width="100%"
          maxWidth={800}
          alignSelf="center"
        >
          {/* Title */}
          <Text size="4xl" bold color="$textLight50" textAlign="center" mb="$4">
            Create Your Account
          </Text>

          {/* Username */}
          <FormControl isInvalid={!!usernameError}>
            <FormControlLabel>
              <FormControlLabelText color="$textLight50">
                Username
              </FormControlLabelText>
            </FormControlLabel>
            <Input bg="$backgroundDark800" rounded="$xl" borderWidth={0}>
              <InputField
                placeholder="username"
                placeholderTextColor="$textLight400"
                autoCapitalize="none"
                value={form.username}
                onChangeText={(text) => handleChange("username", text)}
                color="$textLight50"
              />
            </Input>
            {usernameError && (
              <FormControlError>
                <FormControlErrorText>{usernameError}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Email */}
          <FormControl isInvalid={!!emailError}>
            <FormControlLabel>
              <FormControlLabelText color="$textLight50">
                Email
              </FormControlLabelText>
            </FormControlLabel>
            <Input bg="$backgroundDark800" rounded="$xl" borderWidth={0}>
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
            {emailError && (
              <FormControlError>
                <FormControlErrorText>{emailError}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Password */}
          <FormControl isInvalid={!!passwordError}>
            <FormControlLabel>
              <FormControlLabelText color="$textLight50">
                Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input bg="$backgroundDark800" rounded="$xl" borderWidth={0}>
              <InputField
                placeholder="password"
                placeholderTextColor="$textLight400"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                color="$textLight50"
              />
              <TouchableOpacity
                onPress={togglePassword}
                style={{ position: "absolute", right: 12, top: 12, zIndex: 1 }}
                hitSlop={10}
              >
                <Feather
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </Input>
             <FormControlHelper>
    <FormControlHelperText color="$textLight400">
      Password must be at least 6 characters long, include uppercase, lowercase, a number, and a special character.
    </FormControlHelperText>
  </FormControlHelper>
            {passwordError && (
              <FormControlError>
                <FormControlErrorText>{passwordError}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Sign Up Button */}
          <Button
            bg="$blue600"
            rounded="$xl"
            mt="$4"
            onPress={handleRegister}
            size="md"
            isDisabled={loading}
          >
            <ButtonText color="white" bold size="lg">
              {loading ? "Loading..." : "Sign Up"}
            </ButtonText>
          </Button>
        </VStack>
      </KeyboardAwareScrollView>

      {/* Footer */}
        <HStack justifyContent="center" alignItems="center" py="$4">
          <Text color="$textLight400" mr="$1">
            Already have an account?
          </Text>
          <Pressable onPress={() => router.push("/signIn")}>
            <Text size="sm" bold color="$blue500">
              Sign In
            </Text>
          </Pressable>
        </HStack>
    </Box>
  );
}

export default SignUp;
