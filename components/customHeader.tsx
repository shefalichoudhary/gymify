import React from "react";
import { HStack, Box, Text, VStack, Pressable } from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
interface CustomHeaderProps {
  title?: string;
  logo?: any;
  left?: React.ReactNode | string;
  onPress?: () => void;
  center?: React.ReactNode;
  right?: React.ReactNode | string;
  onRightButtonPress?: () => void;
  isRightButtonDisabled?: boolean;
  isHome?: boolean;
  homeLeft?: React.ReactNode;
}

export default function CustomHeader({
  title ,
  left,
  onPress,
  center,
  right,
  onRightButtonPress,
  isRightButtonDisabled = false,
  isHome = false,
  homeLeft,
}: CustomHeaderProps) {
  const insets = useSafeAreaInsets();
   const router = useRouter();

 const LeftButton = isHome
  ? homeLeft || null
  : (
    <Pressable onPress={onPress || (() => router.back())}>
      <AntDesign name="arrowleft" size={24} color="white" />
    </Pressable>
  );

  return (
    <Box w="100%" px="$4" pt={insets.top + 10} pb="$4"  bg="#1F1F1F">
      <HStack alignItems="center" justifyContent="space-between" w="100%" >
        {/* Left */}
        <Box>{LeftButton}</Box>

        {/* Center */}
        <Box flex={1} alignItems="center">
          {center ? (
            center
          ) : !isHome ? (
            <Text
              fontSize="$lg"
              fontWeight="$small"
              color="$white"
              letterSpacing={1}
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : null}
        </Box>

        {/* Right */}
        <Box>
          {typeof right === "string" ? (
            <Pressable
              onPress={onRightButtonPress}
              disabled={isRightButtonDisabled}
            >
              <Text
                color={isRightButtonDisabled ? "$gray500" : "$blue500"}
                fontWeight="$small"
                fontSize="$lg"
              >
                {right}
              </Text>
            </Pressable>
          ) : right}
        </Box>
      </HStack>
    </Box>
  );
}
