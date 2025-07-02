import React from "react";
import { Box, Heading,Text } from "@gluestack-ui/themed";

export default function Home() {
  return (
    <Box  flex={1} bg="$black"  alignItems="center" py="$16"  >
         <Heading className=" pb-3 pt-28" color="#cccccc"  fontSize="$2xl" fontWeight="$bold" letterSpacing={0.6}>
      Welcome to Gymify!
          </Heading>
       <Text color="#cccccc" fontSize={"$sm"}  letterSpacing={0.6} >
        Your personal fitness companion.
      </Text>
      <Text color="#cccccc" fontWeight="$medium" fontSize="$sm" textAlign="center">
        Start tracking your workouts and progress today!
      </Text>
    </Box>
  );
}
