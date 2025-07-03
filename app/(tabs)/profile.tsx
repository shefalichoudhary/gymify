import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  AvatarFallbackText,
  Divider,
  Button,
  ScrollView,
} from "@gluestack-ui/themed";
import { Pressable } from "@/components/ui/pressable";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";

export default function Profile() {
  const router = useRouter();

  return (
    <ScrollView flex={1} bg="$black" px="$4" py="$6">
      <VStack space="lg" alignItems="center">
        {/* Avatar + Name */}
        <Avatar bgColor="$blue500" size="2xl">
          <AvatarFallbackText>SC</AvatarFallbackText>
        </Avatar>
        <Text color="$white" fontSize="$xl" fontWeight="$bold">
          Shefali Choudhary
        </Text>
        <Text color="$coolGray400">Fitness Enthusiast</Text>

        {/* Profile Details */}
        <Box
          width="100%"
          bg="$gray900"
          p="$4"
          borderRadius="$lg"
          borderWidth={0.3}
          borderColor="$coolGray700"
        >
          <VStack space="lg">
            <ProfileItem label="Email" value="shefali@example.com" />
            <Divider />
            <ProfileItem label="Fitness Goal" value="Lose Fat" />
            <Divider />
            <ProfileItem label="Joined" value="March 2024" />
          </VStack>
        </Box>

        {/* Buttons */}
        <VStack space="md" mt="$4" width="100%">
          <Button
            bg="$blue500"
            borderRadius="$lg"
            onPress={() => router.push("/home")}
          >
            <HStack space="sm" alignItems="center">
              <Feather name="edit-3" size={18} color="white" />
              <Text color="white">Edit Profile</Text>
            </HStack>
          </Button>

          <Button
            bg="$red600"
            borderRadius="$lg"
            onPress={() => console.log("Log out")}
          >
            <HStack space="sm" alignItems="center">
              <AntDesign name="logout" size={18} color="white" />
              <Text color="white">Log Out</Text>
            </HStack>
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

const ProfileItem = ({ label, value }: { label: string; value: string }) => (
  <HStack justifyContent="space-between">
    <Text color="$coolGray400">{label}</Text>
    <Text color="$white" fontWeight="$medium">
      {value}
    </Text>
  </HStack>
);
