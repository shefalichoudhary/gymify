import React, { useEffect, useRef } from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Progress,
  Button,
} from "@gluestack-ui/themed";
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
  const hasPlayedSoundRef = useRef(false);

  // Load sound on mount
useEffect(() => {
  let isMounted = true;

  const setupAudio = async () => {
    try {
      // Set audio mode once
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      // Load sound
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/beep.mp3")
      );

      if (isMounted) {
        soundRef.current = sound;
      }
    } catch (e) {
      console.error("Failed to setup audio:", e);
    }
  };

  setupAudio();

  return () => {
    isMounted = false;
    soundRef.current?.unloadAsync();
  };
}, []);




useEffect(() => {
  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });
    } catch (e) {
      console.error("Error setting audio mode:", e);
    }
  };

  setupAudio();
}, []);

useEffect(() => {
  if (timeLeft === 0 && !hasPlayedSoundRef.current) {
    hasPlayedSoundRef.current = true;

    (async () => {
      try {
        console.log("Playing sound");
        if (soundRef.current) {
          await soundRef.current.replayAsync(); // Just replay
        }
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (e) {
        console.error("Failed to play sound:", e);
      }
    })();
  } else if (timeLeft > 0) {
    hasPlayedSoundRef.current = false;
  }
}, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
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

        <HStack
          justifyContent="space-between"
          alignItems="center"
          space="md"
          px="$4"
        >
          <Button
            variant="solid"
            bg="#2a2a2a"
            size="sm"
            px="$4"
            borderRadius="$xl"
            onPress={onDecrease}
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
            onPress={onIncrease}
          >
            <Text fontSize="$md" color="$white">+10s</Text>
          </Button>

          <Button
            variant="solid"
            bg="$blue500"
            size="sm"
            px="$4"
            borderRadius="$xl"
            onPress={onSkip}
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
