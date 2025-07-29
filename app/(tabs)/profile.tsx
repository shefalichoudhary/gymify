import React, { useEffect } from "react";
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
  Pressable,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/authContext";
import { LinearGradient } from 'expo-linear-gradient';
export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      // Do nothing here — we’ll handle fallback below
    }
  }, [user]);

  if (!user) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$black">
        <Text color="$white" fontSize="$lg" fontWeight="$bold" mb="$4">
          You are logged out.
        </Text>
        <Button bg="$blue600" onPress={() => router.replace("/signIn")}>
          <Text color="white">Login</Text>
        </Button>
      </Box>
    );
  }

  return (
    <ScrollView flex={1} bg="$black" px="$4" py="$6">
      <VStack space="xl" alignItems="center">
        {/* Gradient Avatar Block */}
        <LinearGradient
  colors={["#4facfe", "#00f2fe"]}
  style={{ borderRadius: 9999, padding: 6 }}
>
          <Avatar bgColor="$black" size="2xl">
            <AvatarFallbackText>
              {user.username?.slice(0, 2).toUpperCase()}
            </AvatarFallbackText>
          </Avatar>
        </LinearGradient>

        <Text color="$white" fontSize="$2xl" fontWeight="$bold">
          {user.username}
        </Text>
        <Text color="$coolGray400" fontSize="$md">
          Fitness Enthusiast
        </Text>

        {/* Profile Card */}
        <Box
          w="100%"
          bg="$gray900"
          p="$5"
          borderRadius="$xl"
          borderWidth={1}
          borderColor="$coolGray800"
          shadowColor="black"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.2}
          shadowRadius={4}
        >
          <VStack space="md">
            <ProfileItem label="Email" value={user.email} />
            <Divider bg="$coolGray800" />
            <ProfileItem label="Fitness Goal" value="Lose Fat" />
            <Divider bg="$coolGray800" />
            <ProfileItem label="Joined" value="March 2024" />
          </VStack>
        </Box>

        {/* Buttons */}
        <VStack space="md" w="100%" mt="$4">
          <Button
            bg="$blue500"
            borderRadius="$lg"
            onPress={() => router.push("/home")}
            size="lg"
          >
            <HStack space="sm" alignItems="center">
              <Feather name="edit-3" size={18} color="white" />
              <Text color="white">Edit Profile</Text>
            </HStack>
          </Button>

          <Button
            bg="$red600"
            borderRadius="$lg"
            onPress={logout}
            size="lg"
            $pressed={{ bg: "$red700" }}
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
    <Text color="$coolGray400" fontSize="$sm">
      {label}
    </Text>
    <Text color="$white" fontWeight="$medium" fontSize="$sm">
      {value}
    </Text>
  </HStack>
);
