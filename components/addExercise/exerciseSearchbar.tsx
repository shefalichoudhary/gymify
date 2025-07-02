import React from "react";
import { Box, Input, InputField, HStack } from "@gluestack-ui/themed";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "../ui/pressable";

interface Props {
  query: string;
  setQuery: (value: string) => void;
}

export default function ExerciseSearchbar({ query, setQuery }: Props) {
  return (
    <Box px="$3" py="$4">
      <Input borderRadius={12} size="sm" borderColor="#29282a" bg="#29282a">
        <HStack alignItems="center" w="100%" px="$2">
          <AntDesign name="search1" size={26} color="gray" />
          <InputField
            placeholder="Search exercise"
            value={query}
            onChangeText={setQuery}
            color="$white"
            placeholderTextColor="$coolGray400"
            flex={1}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
               <Box
    bg="$white"
    p={4} // adjust for size
    borderRadius={999} // full circle
    alignItems="center"
    justifyContent="center"
  >
    <MaterialIcons name="clear" size={14} color="black" />
  </Box>
            </Pressable>
          )}
        </HStack>
      </Input>
    </Box>
  );
}
