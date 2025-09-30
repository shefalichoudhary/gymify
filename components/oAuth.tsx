import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { styles } from "./styles";
import { useWarmUpBrowser } from "../hooks/useWamUpBrowser";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import cuid from "cuid";

WebBrowser.maybeCompleteAuthSession();

export function OAuthButtons() {
  const router = useRouter();
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive?.({ session: createdSessionId });

        // Fetch basic user info from Clerk
        const res = await fetch("https://api.clerk.dev/v1/users/me", {
          headers: { Authorization: `Bearer ${createdSessionId}` },
        });
        const data = await res.json();

        const newUser = {
          id: cuid(),
          name: data.first_name || data.email.split("@")[0],
          email: data.email,
          password: null, // Google users have no password
          google: 1,
        };

        // Insert into SQLite (ignore if already exists)
        await db.insert(users).values(newUser).onConflictDoNothing();

        // Navigate to home
        router.replace("/home");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow, router]);

  return (
    <TouchableOpacity
      style={{ ...styles.secondaryButton, marginBottom: 20 }}
      onPress={onPress}
    >
      <Text style={styles.secondaryButtonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
}
