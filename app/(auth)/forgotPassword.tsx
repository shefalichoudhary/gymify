import React, { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import {
  Box,
  VStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  HStack,
  Pressable,
} from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ForgotPassword(): JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const togglePassword = () => setIsPasswordVisible(prev => !prev);
  const toggleConfirm = () => setIsConfirmVisible(prev => !prev);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));

    if (field === "confirmPassword") {
      if (value !== form.password) setConfirmError("Passwords do not match.");
      else setConfirmError(null);
    }
  };

  const passwordRules = [
    { label: "At least 6 characters", test: (pw: string) => pw.length >= 6 },
    { label: "Uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "Lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "Number", test: (pw: string) => /\d/.test(pw) },
    { label: "Special character", test: (pw: string) => /[@$!%*?&#]/.test(pw) },
  ];

  const validateInput = (email: string, password: string, confirm: string) => {
    let valid = true;
    setEmailError(null);
    setConfirmError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password) valid = false;
    if (!confirm) {
      setConfirmError("Please re-enter your password.");
      valid = false;
    } else if (password !== confirm) {
      setConfirmError("Passwords do not match.");
      valid = false;
    }

    // check if any password rule fails
    const passwordValid = passwordRules.every(rule => rule.test(password));
    return valid && passwordValid;
  };

  const handleReset = async () => {
    const { email, password, confirmPassword } = form;
    if (!validateInput(email, password, confirmPassword)) return;

    try {
      setLoading(true);
      // await resetPassword(email.trim(), password);
      setForm({ email: "", password: "", confirmPassword: "" });
      router.push("/signIn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="$black">
      <StatusBar style="light" />
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack
                 flex={1}
                 pt="$16"
                 px="$5"
                 space="md"
                 width="100%"
                 maxWidth={800}
                 alignSelf="center"
               >
          <VStack space="xs" mb="$4">
            <Text size="4xl" bold color="$textLight50" textAlign="center">
              Reset Password
            </Text>
            <Text size="sm" color="$textLight400" textAlign="center">
              Enter your email and new password to reset it.
            </Text>
          </VStack>

          {/* Email */}
          <FormControl isInvalid={!!emailError}>
            <FormControlLabel>
              <FormControlLabelText color="$textLight50">Email</FormControlLabelText>
            </FormControlLabel>
            <Input bg="$backgroundDark800" rounded="$lg" borderWidth={0}>
              <InputField
                placeholder="example@gmail.com"
                placeholderTextColor="$textLight400"
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                color="$white"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>
            {emailError && (
              <FormControlError>
                <FormControlErrorText>{emailError}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Password */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color="$textLight50">New Password</FormControlLabelText>
            </FormControlLabel>
            <Input bg="$backgroundDark800" rounded="$lg" borderWidth={0}>
              <InputField
                placeholder="New Password"
                placeholderTextColor="$textLight400"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                value={form.password}
                color="$white"

                onChangeText={(text) => handleChange("password", text)}
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

            {/* Password rules */}
            <VStack mt="$2" space="xs">
              {passwordRules.map((rule, idx) => {
                const valid = rule.test(form.password);
                return (
                  <HStack key={idx} alignItems="center" space="sm">
                    <Feather
                      name={valid ? "check-circle" : "x-circle"}
                      size={16}
                      color={valid ? "green" : "red"}
                    />
                    <Text color="$textLight400">{rule.label}</Text>
                  </HStack>
                );
              })}
            </VStack>
          </FormControl>

          {/* Confirm Password */}
          <FormControl isInvalid={!!confirmError}>
            <FormControlLabel>
              <FormControlLabelText color="$textLight50">Re-enter Password</FormControlLabelText>
            </FormControlLabel>
            <Input bg="$backgroundDark800" rounded="$lg" borderWidth={0}>
              <InputField
                placeholder="Re-enter Password"
                placeholderTextColor="$textLight400"
                secureTextEntry={!isConfirmVisible}
                autoCapitalize="none"
                color="$white"

                value={form.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
              />
              <TouchableOpacity
                onPress={toggleConfirm}
                style={{ position: "absolute", right: 12, top: 12, zIndex: 1 }}
                hitSlop={10}
              >
                <Feather
                  name={isConfirmVisible ? "eye-off" : "eye"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </Input>
            {confirmError && (
              <FormControlError>
                <FormControlErrorText>{confirmError}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <Button
            bg="$blue600"
            rounded="$xl"
            mt="$4"
            onPress={handleReset}
            isDisabled={loading}
          >
            <ButtonText color="white" bold size="lg">
              {loading ? "Loading..." : "Reset Password"}
            </ButtonText>
          </Button>
        </VStack>
      </KeyboardAwareScrollView>

      {/* Footer */}
      <HStack justifyContent="center" alignItems="center" py="$4">
        <Text color="$textLight400" mr="$1">
          Remembered your password?
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
