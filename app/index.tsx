import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function LandingPage() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/hero-image.jpg")}
      style={{ flex: 1 }}
      className="w-full h-full"
      resizeMode="cover"
    >
      {/* Overlay for opacity */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "black",
          opacity: 0.3,
        }}
      />

      <View className="flex-1 justify-center items-center px-2">
        {/* Logo and Name */}
        <View className="absolute top-1 flex-row items-center">
          <Image
            source={require("../assets/images/logo.png")}
            style={{ height: 150, width: 60 }}
          />
          <Text className="text-4xl font-sans font-black tracking-[.18em] text-white">
            GYMIFY
          </Text>
        </View>

        {/* Description and Button */}
        <View className="absolute bottom-9 ">
          <Text className="font-bold text-4xl tracking-lighter text-white ">
            Unleash Your Potential with Gymify
          </Text>
          <Text className="text-sm tracking-wider text-white  mb-6 mt-3">
            Discover personalized fitness plans and home workouts designed to
            help you build strength, improve...
          </Text>
          <TouchableOpacity
            className=" p-4 mx-1 rounded bg-yellow-400"
            onPress={() => {
              router.replace("/signUp");
            }}
          >
            <View className=" flex-row items-center mx-auto gap-2">
              <Text className="text-md font-bold text-black text-center ">
                Get Started
              </Text>

              <AntDesign name="arrowright" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
