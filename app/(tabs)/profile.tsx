import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Divider,
  Button,
  ScrollView,
  Spinner,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import CustomButton from "@/components/customButton";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<null | { id: number; name: string; email: string;  photo?: string | null ,  created_at?: string | null; }>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const [dbUser] = await db.select().from(users);
        if (dbUser) {
          setUser({
            id: Number(dbUser.id),
            name: dbUser.name,
            email: dbUser.email,
            photo: dbUser.photo ?? null,
            created_at: dbUser.created_at ?? null // <- fetch created_at if available
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

    fetchUser();
  }, []);

  const logout = async () => {
    setUser(null);
    router.replace("/signIn");
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$black">
        <Spinner size={24} color="$white" />
        <Text color="$white" mt="$2">Loading profile...</Text>
      </Box>
    );
  }

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
              <AvatarImage source={{ uri: user.photo }} alt={user.name} /> // show photo if exists
            ) : (
              <AvatarFallbackText>
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallbackText>
            )}
          </Avatar>
        </LinearGradient>

        {/* Username */}
        <VStack space="xs" alignItems="center" w="100%" mt="$4">
          <Text color="$white" fontSize="$2xl" fontWeight="$bold">{user.name}</Text>
          <Text color="$coolGray400" fontSize="$md">Fitness Enthusiast</Text>
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
            <ProfileItem label="Fitness Goal" value="Lose Fat" />
            <Divider bg="$coolGray800" />
           <ProfileItem 
  label="Joined" 
  value={
    user.created_at 
      ? new Date(user.created_at).toLocaleString("en-US", { month: "long", year: "numeric" })
      : "-"
  } 
/>
          </VStack>
        </Box>

        {/* Buttons */}
        <VStack space="md" w="100%">
         

                  
         <CustomButton
                      onPress={() => router.replace("/home")}

               bg="$blue600"
               borderColor="$textLight400"
               icon={ <AntDesign name="edit" size={18} color="white"  marginLeft={2}
               />}
               >
                 Edit Profile
               </CustomButton>
         
         <CustomButton
               onPress={logout}
               bg="$blue600"
               borderColor="$textLight400"
               icon={ <AntDesign name="logout" size={18} color="white"  marginLeft={2}
               />}
               >
                 Logout
               </CustomButton>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

const ProfileItem = ({ label, value }: { label: string; value: string }) => (
  <HStack justifyContent="space-between" alignItems="center">
    <Text color="$coolGray400" fontSize="$sm">{label}</Text>
    <Text color="$white" fontWeight="$medium" fontSize="$sm">{value}</Text>
  </HStack>
);
