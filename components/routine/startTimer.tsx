import React from "react";
import { Box, Text } from "@gluestack-ui/themed";

export default function StartTimerBar({ duration }: { duration: number }) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <Box p="$4" bg="$blue500">
      <Text color="$white" fontWeight="$bold" fontSize="$md">
        ⏱ Workout Time: {minutes}:{seconds.toString().padStart(2, "0")}
      </Text>
    </Box>
  );
}
