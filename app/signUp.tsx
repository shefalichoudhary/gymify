import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  FormControl,

  FormControlLabel,
  FormControlLabelText,

} from "@/components/ui/form-control"
import { Input, InputField,VStack } from  "@gluestack-ui/themed";
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
    const [isInvalid, setIsInvalid] = React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const { register } = useAuth();
  const [usernameError, setUsernameError] = useState<string | null>(null);
const [emailError, setEmailError] = useState<string | null>(null);

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

      setEmailError(null);
  setUsernameError(null);
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
       router.replace("/home");
    }  catch (error: any) {
    if (error.message === "Email already in use") {
      setEmailError(error.message);
    } else if (error.message === "Username already in use") {
      setUsernameError(error.message);
    } else {
      Alert.alert("Sign Up Error", error.message);
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

  // Determine if the form is invalid (example: any field empty or email error)
  

  return (
<SafeAreaView style={{ flex: 1 }}>
  <StatusBar style="dark" />
  <KeyboardAwareScrollView
    enableOnAndroid
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ padding: 2, flexGrow: 1 }}
  >

        <StatusBar style="dark" />
    <VStack className="w-full m-auto max-w-[800px]  p-4 " >
        <Text className="text-5xl font-bold text-black text-center mb-8">
            Create Your Account
          </Text>
      <FormControl
        isInvalid={isInvalid}
        size="md"
        isDisabled={false}
        isRequired={true}
      >

          <VStack space="md" className="w-full max-w-md">
    {/* Username Input */}
    <FormControlLabel>
      <FormControlLabelText>Username</FormControlLabelText>
    </FormControlLabel>
    <Input>
      <InputField
        placeholder="username"
        value={form.username}
        onChangeText={(text) => handleChange("username", text)}
        autoCapitalize="none"
      />
    </Input>
    {usernameError && (
  <Text className="text-red-500 text-sm mt-1 ml-1">{usernameError}</Text>
)}

    {/* Email Input */}
    <FormControlLabel>
      <FormControlLabelText>Email</FormControlLabelText>
    </FormControlLabel>
    <Input>
      <InputField
        placeholder="example@gmail.com"
        value={form.email}
        onChangeText={handleEmailChange}
        autoCapitalize="none"
        keyboardType="email-address"
      />
    </Input>
    {emailError && (
  <Text className="text-red-500 text-sm mt-1 ml-1">{emailError}</Text>
)}

    {/* Password Input */}
    <FormControlLabel>
      <FormControlLabelText>Password</FormControlLabelText>
    </FormControlLabel>
    <Input>
      <InputField
        type={isPasswordVisible ? "text" : "password"}
        placeholder="password"
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={togglePassword}
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          zIndex: 1,
        }}
        hitSlop={10}
      >
        <Feather
          name={isPasswordVisible ? "eye-off" : "eye"}
          size={20}
          color="gray"
        />
      </TouchableOpacity>
    </Input>

    {/* Sign Up Button */}
    <TouchableOpacity
      onPress={handleRegister}
      className="bg-zinc-900 rounded-xl justify-center items-center p-4 w-full mt-4"
      disabled={loading}
    >
      <Text className="font-bold text-white tracking-wider">
        {loading ? <ActivityIndicator color="white" /> : "Sign Up"}
      </Text>
    </TouchableOpacity>
  </VStack>
          </FormControl>
        </VStack >
</KeyboardAwareScrollView>
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
