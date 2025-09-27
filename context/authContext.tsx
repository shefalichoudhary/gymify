import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import cuid from "cuid";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router"; 
WebBrowser.maybeCompleteAuthSession();

type User = {
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
const router = useRouter(); 
const redirectUri =
  // @ts-ignore
  makeRedirectUri({ scheme: "myapp", useProxy: true }) ??
  (Platform.OS === "web" ? window.location.origin : "");

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "756288749216-vr6ijqcj6j368qc2s7bhr6kd2f5n4c0a.apps.googleusercontent.com",
    androidClientId: "756288749216-3oaav02buu9204ugjvp2oe6jmchq0o8c.apps.googleusercontent.com",
    webClientId: "756288749216-vr6ijqcj6j368qc2s7bhr6kd2f5n4c0a.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    redirectUri,
  } as any);

  // -------------------------
  // Helper: get user
  // -------------------------
  const getUserByEmail = async (email: string) => {
    if (!email) return null;
    if (Platform.OS === "web") {
      const stored = await AsyncStorage.getItem("users");
      const allUsers = stored ? JSON.parse(stored) : [];
      return allUsers.find((u: any) => u.email === email) || null;
    } else {
      const result = await db.select().from(users).where(eq(users.email, email));
      return result[0] || null;
    }
  };

  // -------------------------
  // Helper: insert user
  // -------------------------
  const insertUser = async (userData: any) => {
    if (Platform.OS === "web") {
      const stored = await AsyncStorage.getItem("users");
      const allUsers = stored ? JSON.parse(stored) : [];
      allUsers.push(userData);
      await AsyncStorage.setItem("users", JSON.stringify(allUsers));
    } else {
      await db.insert(users).values(userData);
    }
  };

  // -------------------------
  // Handle Google login response
  // -------------------------
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const { authentication } = response;
        if (!authentication?.accessToken) return;

        try {
          const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          });
          const userInfo = await userInfoResponse.json();
          const email = userInfo.email ?? "";
          const username = userInfo.name ?? "Unknown";

          let dbUser = await getUserByEmail(email);

          if (!dbUser) {
            const newUser = { id: cuid(), name: username, email, password: "" };
            await insertUser(newUser);
            dbUser = newUser;
          }

          const loggedInUser = { username: dbUser.name ?? "Unknown", email: dbUser.email ?? "" };
          setUser(loggedInUser);
          await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
            router.replace("/home");
        } catch (err) {
          console.error("Google login failed:", err);
        }
      }
    };

    handleGoogleResponse();
  }, [response]);

  // -------------------------
  // Load user from AsyncStorage
  // -------------------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // -------------------------
  // Google login function
  // -------------------------
  const loginWithGoogle = async () => {
    if (!request) throw new Error("Google Auth request not ready");
    await promptAsync();
  };

  // -------------------------
  // Email/password login
  // -------------------------
  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Email and password required");

    const dbUser = await getUserByEmail(email);
    if (!dbUser) throw new Error("User not found");

    const hashedInput = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);

    if (hashedInput !== (dbUser.password ?? "")) throw new Error("Incorrect password");

    const loggedInUser = { username: dbUser.name ?? "Unknown", email: dbUser.email ?? "" };
    setUser(loggedInUser);
    await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  // -------------------------
  // Registration
  // -------------------------
  const register = async (username: string, email: string, password: string) => {
    if (!username || !email || !password) throw new Error("All fields required");

    const hashedPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
    const dbUser = await getUserByEmail(email);

    if (dbUser) throw new Error("Email already in use");

    const newUser = { id: cuid(), name: username, email, password: hashedPassword };
    await insertUser(newUser);

    const loggedInUser = { username, email };
    setUser(loggedInUser);
    await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  // -------------------------
  // Logout
  // -------------------------
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, loginWithGoogle, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
