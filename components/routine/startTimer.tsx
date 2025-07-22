import React, { useEffect, useState } from "react";
import { Box, HStack, Text, Icon, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { Vibration } from "react-native";

interface StartTimerBarProps {
  time: number;
  onChangeTime?: (delta: number) => void;
  onSkip: () => void;
  scrollToRef?: React.RefObject<any>; // Optional scroll target (e.g. next set block)
}

const StartTimerBar = ({ time, onChangeTime, onSkip, scrollToRef }: StartTimerBarProps) => {
  const [seconds, setSeconds] = useState(time);

  useEffect(() => {
    setSeconds(time);
  }, [time]);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          Vibration.vibrate(400); // ✅ vibrate
          onSkip();

          // ✅ Auto-scroll
          scrollToRef?.current?.scrollTo({ y: 0, animated: true });

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  return (
  <Box bg="$blue600" p="$3" borderRadius="$md" mx="$4" my="$2">
      <HStack justifyContent="space-between" alignItems="center">
        <HStack alignItems="center" space="md">
          <Pressable onPress={() => {
            setSeconds((prev) => Math.max(prev - 5, 0));
            onChangeTime?.(-5);
          }}>
            <Ionicons name="remove-circle-outline" size={24} color="$white" />
          </Pressable>

          <Text size="lg" color="$white" fontWeight="$bold">
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
          </Text>

          <Pressable onPress={() => {
            setSeconds((prev) => prev + 5);
            onChangeTime?.(5);
          }}>
            <Ionicons name="add-circle-outline" size={24} color="$white" />
          </Pressable>
        </HStack>

        <Pressable onPress={onSkip}>
          <Text color="$white" fontWeight="$medium">Skip</Text>
        </Pressable>
      </HStack>
    </Box>
  );
};

export default StartTimerBar;
