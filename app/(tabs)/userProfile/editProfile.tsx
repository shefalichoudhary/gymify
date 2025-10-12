import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  VStack,
  Input,
  InputField,
  Button,
  Spinner,
  ScrollView,
  Pressable,
} from "@gluestack-ui/themed";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import CustomButton from "@/components/customButton";
import FitnessGoalSheet, { FitnessGoalSheetRef } from "@/components/profile/fitnessGoalSheet";

export default function EditProfile() {
  const fitnessSheetRef = useRef<FitnessGoalSheetRef>(null);
  const router = useRouter();
  const [user, setUser] = useState<null | {
    id: string;
    name: string;
    email: string;
  }>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const [dbUser] = await db.select().from(users);
        if (dbUser) {
          setUser({
            id: String(dbUser.id),
            name: dbUser.username,
            email: dbUser.email,
          });
          setName(dbUser.username);
          setEmail(dbUser.email);
          setFitnessGoal(dbUser.fitness_goal);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await db
        .update(users)
        .set({
          username: name,
          email,
          fitness_goal: fitnessGoal,
        })
        .where(eq(users.id, user.id));

      router.replace("/profile"); // Go back after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <ScrollView flex={1} bg="$black" py="$24" contentContainerStyle={{ paddingBottom: 120 }}>
      <VStack space="xl" px="$5" alignItems="center">
        {" "}
        {/* <- remove px here if you want truly full width */}
        <Text color="$white" fontSize="$2xl" fontWeight="$bold" textAlign="center">
          Edit Profile
        </Text>
        {/* Name */}
        <VStack space="xs" w="100%">
          <Text color="$coolGray400" fontSize="$sm">
            Name
          </Text>
          <Input borderColor="$coolGray800" bg="$gray900" w="100%">
            <InputField
              placeholder="Enter your name"
              value={name}
              color="$white"
              onChangeText={setName}
            />
          </Input>
        </VStack>
        {/* Email */}
        <VStack space="xs" w="100%">
          <Text color="$coolGray400" fontSize="$sm">
            Email
          </Text>
          <Input borderColor="$coolGray800" bg="$gray900" w="100%">
            <InputField
              placeholder="Enter your email"
              value={email}
              color="$white"
              onChangeText={setEmail}
            />
          </Input>
        </VStack>
        {/* Fitness Goal */}
        <VStack space="xs" w="100%">
          <Text color="$coolGray400" fontSize="$sm">
            Fitness Goal
          </Text>
          <Input borderColor="$coolGray800" bg="$gray900" w="100%">
            <Pressable style={{ flex: 1 }} onPress={() => fitnessSheetRef.current?.open()}>
              <InputField
                pointerEvents="none"
                placeholder="Select your goal"
                value={fitnessGoal}
                color="$white"
                editable={false}
                style={{ paddingRight: 30 }}
              />
            </Pressable>
            <AntDesign
              name="caretdown"
              size={14}
              color="#a1a1aa"
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: [{ translateY: -7 }],
              }}
            />
          </Input>
        </VStack>
        {/* Save & Cancel Buttons */}
        <VStack space="md" mt="$6" w="100%" pb="$8">
          <CustomButton onPress={handleSave} bg="$blue600" isDisabled={saving} icon={null}>
            {saving ? "Saving..." : "Save Changes"}
          </CustomButton>

          <Button
            variant="outline"
            borderColor="$blue600"
            onPress={() => router.replace("/profile")}
          >
            <Text color="$white">Cancel</Text>
          </Button>
        </VStack>
      </VStack>

      <FitnessGoalSheet ref={fitnessSheetRef} onSelectGoal={(goal) => setFitnessGoal(goal)} />
    </ScrollView>
  );
}
