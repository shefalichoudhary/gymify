import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Divider,
  ScrollView,
  Spinner,
} from "@gluestack-ui/themed";
import { useFocusEffect, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import CustomButton from "@/components/customButton";

type UserType = {
  id: string;
  username: string;
  email: string;
  photo?: string | null;
  created_at?: string | null;
  fitness_goal: string;
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const [dbUser] = await db.select().from(users).limit(1);
      if (dbUser) {
        setUser({
          id: dbUser.id,
          username: dbUser.username,
          email: dbUser.email,
          photo: dbUser.photo ?? null,
          fitness_goal: dbUser.fitness_goal,
          created_at: dbUser.created_at ?? null,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Re-fetch whenever this screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$black">
        <Spinner size={24} color="$white" />
        <Text color="$white" mt="$2">
          Loading profile...
        </Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$black">
        <Text color="$white" fontSize="$lg" fontWeight="$bold" mb="$4">
          You are logged out.
        </Text>
      </Box>
    );
  }

  return (
    <ScrollView flex={1} bg="$black" px="$5" py="$6">
      <VStack space="md" alignItems="center">
        {/* Gradient Avatar */}
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 9999, padding: 2 }}
        >
          <Avatar bgColor="$black" size="2xl" borderWidth={2} borderColor="transparent">
            {user.photo ? (
              <AvatarImage source={{ uri: user.photo }} alt={user.username} /> // show photo if exists
            ) : (
              <AvatarFallbackText>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallbackText>
            )}
          </Avatar>
        </LinearGradient>

        {/* Username */}
        <VStack space="xs" alignItems="center" w="100%" mt="$4">
          <Text color="$white" fontSize="$2xl" fontWeight="$bold">
            {user.username}
          </Text>
          <Text color="$coolGray400" fontSize="$md">
            Fitness Enthusiast
          </Text>
        </VStack>

        {/* Profile Info Card */}
        <Box
          w="100%"
          bg="$gray900"
          p="$4"
          borderRadius="$2xl"
          borderWidth={1}
          borderColor="$coolGray800"
          shadowColor="black"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={6}
        >
          <VStack space="md">
            <ProfileItem label="Email" value={user.email} />
            <Divider bg="$coolGray800" />
            <ProfileItem label="Fitness Goal" value={user.fitness_goal} />
            <Divider bg="$coolGray800" />
            <ProfileItem
              label="Joined"
              value={
                user.created_at
                  ? new Date(user.created_at).toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "-"
              }
            />
          </VStack>
        </Box>

        {/* Buttons */}
        <VStack space="md" w="100%">
          <CustomButton
            onPress={() => router.replace("/editProfile")}
            bg="$blue600"
            borderColor="$textLight400"
            icon={<AntDesign name="edit" size={18} color="white" marginLeft={2} />}
          >
            Edit Profile
          </CustomButton>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

const ProfileItem = ({ label, value }: { label: string; value: string }) => (
  <HStack justifyContent="space-between" alignItems="center">
    <Text color="$coolGray400" fontSize="$sm">
      {label}
    </Text>
    <Text color="$white" fontWeight="$medium" fontSize="$sm">
      {value}
    </Text>
  </HStack>
);
