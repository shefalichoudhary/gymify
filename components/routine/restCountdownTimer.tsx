import React, { useEffect, useRef, useState } from "react";
import { VStack, HStack, Box, Text, Progress, Button } from "@gluestack-ui/themed";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

type Props = {
  timeLeft: number;
  totalTime: number;
  onSkip: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function RestCountdownTimer({
  timeLeft,
  totalTime,
  onSkip,
  onIncrease,
  onDecrease,
}: Props) {
  const progress = timeLeft / totalTime;
  const soundRef = useRef<Audio.Sound | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const hasPlayedEndRef = useRef(false);

  // Unlock audio on first button press
  const unlockAudio = async () => {
    if (audioUnlocked) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/beep.mp3"),
        { shouldPlay: true }
      );
      await sound.playAsync();
      await sound.unloadAsync();

      setAudioUnlocked(true);
      console.log("✅ Audio unlocked");
    } catch (e) {
      console.error("Failed to unlock audio:", e);
    }
  };

  // Load beep sound
  useEffect(() => {
    let isMounted = true;

    const loadBeep = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/sounds/beep.mp3")
        );
        if (isMounted) {
          soundRef.current = sound;
          console.log("✅ Beep sound loaded");
        }
      } catch (e) {
        console.error("❌ Failed to load beep sound:", e);
      }
    };

    loadBeep();

    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync();
    };
  }, []);

  // Play beep + haptic
  const playBeep = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync(); // reset if already playing
        await soundRef.current.playAsync();
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error("Failed to play beep:", e);
    }
  };

  // Play start beep
  useEffect(() => {
    if (timeLeft === totalTime && audioUnlocked) {
      playBeep();
    }
  }, [timeLeft, totalTime, audioUnlocked]);

  // Play end beep
  useEffect(() => {
    if (timeLeft <= 0 && !hasPlayedEndRef.current && audioUnlocked) {
      hasPlayedEndRef.current = true;
      playBeep();
    }
    if (timeLeft > 0) {
      hasPlayedEndRef.current = false;
    }
  }, [timeLeft, audioUnlocked]);

  // Skip handler
  const handleSkip = () => {
    unlockAudio();
    playBeep(); // play end beep on skip
    onSkip();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      bg="#1F1F1F"
      borderTopLeftRadius={12}
      borderTopRightRadius={12}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: -2 }}
      shadowOpacity={0.2}
      zIndex={999}
    >
      <VStack space="md" width="100%" mb="$4">
        <Progress
          value={progress * 100}
          size="xs"
          bg="#2a2a2a"
          width="100%"
          borderRadius={5}
        >
          <Progress.FilledTrack bg="$blue600" />
        </Progress>

        <HStack justifyContent="space-between" alignItems="center" space="md" px="$4">
          <Button
            variant="solid"
            bg="#2a2a2a"
            size="sm"
            px="$4"
            borderRadius="$xl"
            onPress={() => {
              unlockAudio();
              onDecrease();
            }}
          >
            <Text fontSize="$md" color="$white">-10s</Text>
          </Button>

          <Text
            fontSize="$2xl"
            fontWeight="$bold"
            color="$white"
            letterSpacing={1.5}
            textAlign="center"
            minWidth={80}
          >
            {formatTime(timeLeft)}
          </Text>

          <Button
            variant="solid"
            bg="#2a2a2a"
            size="sm"
            px="$4"
            borderRadius="$xl"
            onPress={() => {
              unlockAudio();
              onIncrease();
            }}
          >
            <Text fontSize="$md" color="$white">+10s</Text>
          </Button>

          <Button
            variant="solid"
            bg="$blue500"
            size="sm"
            px="$4"
            borderRadius="$xl"
            onPress={handleSkip}
            $hover={{ bg: "$blue400" }}
          >
            <Text fontSize="$md" color="$white" fontWeight="$medium">
              Skip
            </Text>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
