import React from "react";
import { ImageBackground, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Box, VStack, HStack, Text, Image, Center } from "@gluestack-ui/themed";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import CustomButton from "@/components/customButton";

export default function LandingPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Load Inter font
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_900Black,
    Inter: Inter_400Regular,
    InterBold: Inter_700Bold,
    InterBlack: Inter_900Black,
  });
  if (!fontsLoaded) return null;

  const fontSizeTitle = width > 1400 ? "$3xl" : width > 1200 ? "$2xl" : width > 900 ? "$xl" : "$xl";

  if (isLargeScreen) {
    // SPLIT LAYOUT FOR LARGE SCREENS
    return (
      <HStack flex={1} w="100%" h="100%">
        {/* Left: Background Image */}
        <Box flex={2} h="100%" backgroundColor="$black">
          <ImageBackground
            source={require("../assets/images/hero-image.jpg")}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            resizeMode="cover"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="$black"
              opacity={0.3}
              zIndex={1}
            />
          </ImageBackground>
        </Box>
        {/* Right: Content */}
        <Center flex={1} px="$8" bg="$black">
          <VStack
            flex={1}
            w="100%"
            maxWidth={420}
            justifyContent="space-between"
            alignItems="center"
            alignSelf="center"
            py="$12"
          >
            {/* Top: Logo and Name */}
            <HStack alignItems="center" space="lg" mt="$6">
              <Image
                source={require("../assets/images/logo.png")}
                alt="Gymify Logo"
                style={{
                  height: 100,
                  width: 26,
                }}
              />
              <Text
                fontSize={fontSizeTitle}
                fontWeight="$black"
                color="$white"
                letterSpacing={7}
                fontFamily="Inter"
              >
                GYMIFY
              </Text>
            </HStack>
            {/* Bottom: Content */}
            <VStack
              w="90%"
              space="xl"
              alignItems="center"
              justifyContent="flex-end"
              alignSelf="center"
              pb="$4"
            >
              <Text
                fontSize={fontSizeTitle}
                fontWeight="$bold"
                color="$white"
                textAlign="left"
                letterSpacing={1}
                fontFamily="Inter"
              >
                Unleash Your Potential with Gymify
              </Text>
              <Text
                fontSize={width > 1200 ? "$sm" : "$xs"}
                color="$white"
                textAlign="left"
                px="$2"
                fontFamily="Inter"
              >
                Discover personalized fitness plans and home workouts designed to help you build
                strength, improve flexibility, and stay motivated.
              </Text>
              <CustomButton
                onPress={() => router.replace("/home")}
                hover={{ bg: "$yellow300", scale: 1.05 }}
                style={({ pressed }: any) => ({
                  backgroundColor: "#1F1F1F",
                  opacity: pressed ? 1 : 1, // same opacity prevents flash
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                })}
                iconPosition="right"
                icon={
                  <AntDesign name="arrowright" size={20} color="white" style={{ marginLeft: 8 }} />
                }
              >
                Get Started
              </CustomButton>
            </VStack>
          </VStack>
        </Center>
      </HStack>
    );
  }

  // STACKED LAYOUT FOR SMALL SCREENS
  return (
    <Box flex={1}>
      <ImageBackground
        source={require("../assets/images/hero-image.jpg")}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
        }}
        resizeMode="cover"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="$black"
          opacity={0.6} // Increased opacity for better text visibility
          zIndex={1}
        />
        <VStack
          flex={1}
          justifyContent="space-between"
          zIndex={2}
          px="$2"
          py="$8"
          alignItems="center"
        >
          {/* Top: Logo and Name */}
          <HStack alignItems="center" space="lg" mt="$4">
            <Image
              source={require("../assets/images/logo.png")}
              alt="Gymify Logo"
              style={{
                height: 120,
                width: 28,
              }}
            />
            <Text
              fontSize="$4xl"
              fontWeight="$black"
              color="$white"
              letterSpacing={4}
              fontFamily="Inter"
            >
              GYMIFY
            </Text>
          </HStack>
          {/* Bottom: Content */}
          <VStack
            w="100%"
            maxWidth={360}
            space="lg"
            px="$2"
            alignItems="center"
            justifyContent="flex-end"
            alignSelf="center"
          >
            <Text
              fontSize={width > 600 ? "$2xl" : width > 400 ? "$xl" : "$2xl"}
              fontWeight="$bold"
              color="$white"
              textAlign="left"
              letterSpacing={1}
              fontFamily="Inter"
            >
              Unleash Your Potential with Gymify
            </Text>
            <Text
              fontSize={width > 600 ? "$sm" : "$sm"}
              color="$white"
              textAlign="left"
              fontFamily="Inter"
              lineHeight={17}
              letterSpacing={0.4}
            >
              Discover personalized fitness plans and home workouts designed to help you build
              strength, improve flexibility, and stay motivated.
            </Text>
            <CustomButton
              onPress={() => router.replace("/home")}
              hover={{ bg: "$yellow300", scale: 1.05 }}
              style={({ pressed }: any) => ({
                backgroundColor: "#1F1F1F",
                opacity: pressed ? 1 : 1, // same opacity prevents flash
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 12,
              })}
              iconPosition="right"
              icon={
                <AntDesign name="arrowright" size={20} color="white" style={{ marginLeft: 8 }} />
              }
            >
              Get Started
            </CustomButton>
          </VStack>
        </VStack>
      </ImageBackground>
    </Box>
  );
}
