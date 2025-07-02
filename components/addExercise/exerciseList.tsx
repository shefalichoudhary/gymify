import React from "react";
import { FlatList, Box, Text } from "@gluestack-ui/themed";
import { Pressable } from "../ui/pressable";
import { Exercise } from "@/db/schema";
import { ListRenderItem } from "react-native";

interface Props {
  data: Exercise[];
  selectedIds: string[];
  toggleSelect: (id: string) => void;
}

export default function ExerciseList({ data, selectedIds, toggleSelect }: Props) {
  const renderItem: ListRenderItem<Exercise> = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <Pressable onPress={() => toggleSelect(item.id)}>
        {/* Outer container with fixed border and blue bar */}
        <Box
          flexDirection="row"
          alignItems="center"
          py="$2"
          bg={isSelected ? "$gray800" : "transparent"}
          borderBottomWidth={0.6}
          borderBottomColor="#2a2a2a"
        >
          {/* Static left blue bar */}
          <Box
            w={5}
            h={56}
            bg={isSelected ? "$blue500" : "transparent"}
             borderRadius={40}
            ml={isSelected ? "$2" : "$0"}
          />

          {/* Shifting content container (Icon + Text) */}
          <Box flexDirection="row" alignItems="center" ml={isSelected ? "$3" : "$0"}>
            {/* Icon */}
            <Box
            w={56} // increased from 42
  h={56}
  borderRadius={30}
              bg="$coolGray600"
              mr="$4"
              justifyContent="center"
              alignItems="center"
            >
              {/* Optional icon/initials */}
            </Box>

            {/* Text */}
            <Box>
              <Text color="$white" fontSize="$md" fontWeight="$medium">
                {item.exercise_name}
              </Text>
              <Text color="$coolGray400" fontSize="$sm">
                {item.exercise_type}
              </Text>
            </Box>
          </Box>
        </Box>
      </Pressable>
    );
  };

  return (
    <Box flex={1} px="$1">
      <Text color="$coolGray400" py="$4" px="$4" fontSize="$md" letterSpacing={0.5}>
        All Exercises
      </Text>

      {data.length === 0 ? (
        <Box flex={1} alignItems="center" px="$4" py="$12">
          <Text color="#cccccc" fontSize="$lg">
            No exercises found.
          </Text>
        </Box>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 10 }}
          renderItem={renderItem as ListRenderItem<unknown>}
        />
      )}
    </Box>
  );
}
