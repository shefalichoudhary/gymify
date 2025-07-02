import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ScrollView,
  Icon,
} from '@gluestack-ui/themed';
import { Feather,FontAwesome6 ,AntDesign } from '@expo/vector-icons';
import CustomButton from '@/components/customButton';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function WorkoutScreen() {

//   useEffect(() => {
//   const loadRoutines = async () => {
//     const result = await db.select().from(routines).all();
//     setRoutines(result);
//   };

//   loadRoutines();
// }, []);
  return (
    <Box flex={1} bg="$black" pt="$8">
     

      <ScrollView px="$4">
       

        {/* Routines */}
        <HStack justifyContent="space-between" alignItems="center" mb="$4">
          <Text color="$white" fontWeight="$semibold" fontSize="$lg">Routines</Text>
<Feather name="folder-plus" size={24} color="white" />
        </HStack>
<HStack space="md" mb="$4">
  {/* New Routine Button */}
  <Button
    flex={1}
       bg="#29282a"

    size="md"
    borderRadius="$lg" // adds sufficient rounding
    justifyContent="flex-start" // aligns content to the left
    px="$4"
  onPress={() => router.push("/logWorkout")}

  >
    <HStack alignItems="center" space="sm">
      <FontAwesome6 name="clipboard-list" size={24}  color="white" />
      <Text color="$white" fontWeight="$medium">New Routine</Text>
    </HStack>
  </Button>

  <Button
       flex={1}
             bg="#29282a"
    size="md"
    borderRadius="$lg" // adds sufficient rounding
    justifyContent="flex-start" // aligns content to the left
    px="$4"
  >
    <HStack alignItems="center" space="sm">
      <AntDesign name="search1" size={24} color="white" />
      <Text color="$white">Explore</Text>
    </HStack>
  </Button>
</HStack>

        {/* My Routines */}
        <Text color="$coolGray400" mb="$3">My Routines </Text>

        {/* Routine Cards */}
        <VStack space="md">
          <Box bg="$coolGray900" p="$4" rounded="$xl">
            <Text color="$white" fontSize="$lg" fontWeight="$semibold">Abs</Text>
            <Text color="$coolGray400" mt="$1" mb="$4">...</Text>

            <CustomButton
              onPress={() => router.back()}
              bg="$blue500"
            >
              Start Routine
            </CustomButton>
          </Box>

         
        </VStack>
      </ScrollView>

    </Box>
  );
}
