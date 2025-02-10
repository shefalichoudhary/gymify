import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/context/authContext";
WebBrowser.maybeCompleteAuthSession();

interface GoogleAuthButtonProps {
  label: string; // Dynamic label for SignIn / SignUp
}
export default function GoogleAuthButton({ label }: GoogleAuthButtonProps) {
  const { googleAuth } = useAuth();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    responseType: "token",
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      googleAuth(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <View className="w-full">
      <TouchableOpacity
        onPress={() => promptAsync()}
        className="bg-zinc-900 rounded-xl flex-row items-center p-4 w-full mt-4 relative"
      >
        {/* Google Icon on the Left */}
        <Image
          className="h-7 w-10 absolute left-4"
          source={require("../assets/images/google-icon.png")}
        />

        {/* Centered Text */}
        <Text className="flex-1 font-bold text-white tracking-wider text-center">
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
