// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// import { useAuth } from "../context/authContext"; // Assuming you have this context
// import { useRouter } from "expo-router";

// interface FormState {
//   email: string;
//   password: string;
// }

// export default function ForgotPassword() {
//   const router = useRouter();
//   const [form, setForm] = useState<FormState>({ email: "", password: "" });
//   const { resetPassword } = useAuth(); // Assuming resetPassword is the method from your context

//   // Handle changes for both email and password
//   const handleChange = (name: string, value: string) => {
//     setForm((prevForm) => ({ ...prevForm, [name]: value }));
//   };

//   const handleForgotPassword = async () => {
//     const { email, password } = form;
//     if (!email || password) {
//       Alert.alert("Error", "Please fill in both fields.");
//       return;
//     }

//     try {
//       // Call your resetPassword logic here
//       await resetPassword(email, password);
//       Alert.alert("Success", "Password reset successfully.");
//     } catch (error: any) {
//       Alert.alert("Error", error.message || "Password reset failed.");
//     }
//   };

//   return (
//     <View className="flex-1 justify-center items-center px-4 bg-gray-50">
//       <Text className="text-3xl font-bold mb-2 text-gray-800">
//         Reset Password
//       </Text>
//       <Text className="text-medium text-gray-600 mb-6 text-center">
//         Enter your email and new password to reset it.
//       </Text>

//       <TextInput
//         className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-700"
//         placeholder="example@gmail.com"
//         placeholderTextColor="#9CA3AF"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={form.email}
//         onChangeText={(value) => handleChange("email", value)}
//       />

//       <TextInput
//         className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-700"
//         placeholder="New Password"
//         placeholderTextColor="#9CA3AF"
//         secureTextEntry
//         value={form.password}
//         onChangeText={(value) => handleChange("password", value)}
//       />

//       <TouchableOpacity
//         className="bg-zinc-900 rounded-xl justify-center items-center p-4 w-full"
//         onPress={handleForgotPassword}
//       >
//         <Text className="font-bold text-white tracking-wider">
//           Reset Password
//         </Text>
//       </TouchableOpacity>
//       <View className="absolute bottom-8 flex-row justify-center items-center w-full">
//         <Text className="font-semibold text-neutral-500">
//           Remembered your password?{" "}
//         </Text>
//         <TouchableOpacity onPress={() => router.push("/signIn")}>
//           <Text className="font-bold text-indigo-500">Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
