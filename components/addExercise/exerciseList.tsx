import React, { useRef, useState, useEffect } from "react";
import { Box, Text } from "@gluestack-ui/themed";
import { Pressable } from "../ui/pressable";
import { FlatList, ListRenderItem } from "react-native";
import { Exercise } from "@/db/schema";
import { Audio } from "expo-av";
import { Image } from "react-native";

interface Props {
  data: Exercise[];
  selectedIds: string[];
  toggleSelect: (id: string) => void;
}

export default function ExerciseList({ data, selectedIds, toggleSelect }: Props) {
  const flatListRef = useRef<FlatList>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const lastPlayRef = useRef<number>(0); // timestamp of last audio play
  // Play local audio
 const playAudio = async () => {
    const now = Date.now();
    const DEBOUNCE_DELAY = 800; // ms
    if (now - lastPlayRef.current < DEBOUNCE_DELAY) {
      return; // ignore rapid presses
    }
    lastPlayRef.current = now;

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/button-press.mp3")
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };
  // Unload sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Group exercises by first letter
  const grouped: Record<string, Exercise[]> = {};
  data.forEach((ex) => {
    const letter = ex.exercise_name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(ex);
  });

  const letters = Object.keys(grouped).sort();

  // Flatten grouped for FlatList
  const flatData: { letter?: string; item?: Exercise }[] = [];
  letters.forEach((letter) => {
    flatData.push({ letter });
    grouped[letter].forEach((ex) => flatData.push({ item: ex }));
  });

  const renderItem: ListRenderItem<typeof flatData[0]> = ({ item }) => {
    if (item.letter) {
      return (
        <Box px="$2" py="$1" bg="$gray900">
          <Text color="$coolGray400" fontSize="$lg" fontWeight="$medium">
            {item.letter}
          </Text>
        </Box>
      );
    }

    if (!item.item) return null;

    const exercise = item.item;
    const isSelected = selectedIds.includes(exercise.id);

    return (
      <Box
        flexDirection="row"
        alignItems="center"
        py="$1.5"
        px="$4"
        mb="$2"
        borderRadius="$md"
        borderLeftWidth={isSelected ? 4 : 0}
        borderLeftColor="$blue500"
        {...(isSelected && { elevation: 3 })}
      >
        <Box
          w={50}
          h={50}
          borderRadius={25}
          bg="#1F1F1F"
          mr="$3"
          justifyContent="center"
          alignItems="center"
        >
          <Image
    source={require("../../assets/images/logo.png")} // replace with your icon path
    style={{ width: 100, height: 100, resizeMode: "contain" }}
  />
        </Box>
        <Pressable
  onPress={() => {
    const isSelected = selectedIds.includes(exercise.id);

    // Only play audio if it's being selected, not unselected
    if (!isSelected) {
      playAudio();
    }

    toggleSelect(exercise.id);
  }}
>

          <Box flex={1}>
            <Text color="$white" fontSize="$md" fontWeight="$medium">
              {exercise.exercise_name}
            </Text>
            <Text color="$coolGray400" fontSize="$sm">
              {exercise.exercise_type}
            </Text>
          </Box>
        </Pressable>
      </Box>
    );
  };

  const handleLetterPress = (letter: string) => {
    setActiveLetter(letter);
    const index = flatData.findIndex((i) => i.letter === letter);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <Box flex={1} px="$2">
      <Text color="$coolGray400" py="$4" px="$2" fontSize="$md" letterSpacing={0.5}>
        All Exercises
      </Text>

      <Box flex={1} position="relative">
        <FlatList
          ref={flatListRef}
          data={flatData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem as any}
          contentContainerStyle={{ paddingBottom: 64 }}
          style={{ flex: 1 }}
        />

        {/* Alphabet sidebar */}
        <Box
          position="absolute"
          right={0}
          top={10}
          bottom={0}
          justifyContent="center"
          alignItems="center"
          pr="$1"
        >
          {letters.map((letter) => (
            <Pressable
              key={letter}
              onPress={() => handleLetterPress(letter)}
              style={{ paddingVertical: 4, paddingHorizontal: 4 }}
            >
              <Text
                color={activeLetter === letter ? "$blue500" : "$white"}
                fontSize="$xs"
                fontWeight={activeLetter === letter ? "bold" : "normal"}
              >
                {letter}
              </Text>
            </Pressable>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
