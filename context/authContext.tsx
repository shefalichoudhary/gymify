import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import cuid from "cuid";
import { useRouter } from "expo-router"; 
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
WebBrowser.maybeCompleteAuthSession();

type User = {
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
const router = useRouter(); 

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
  // SignInWithGoogle
  // -------------------------
const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn(); // returns GoogleUser directly

    const googleUser = response.data?.user;
    const email = googleUser?.email;
    const username = googleUser?.name ?? "Unknown";
    const photo = googleUser?.photo ?? null;
    const createdAt = new Date().toISOString();

    if (!email) {
      throw new Error("Google account has no email");
    }

    // Now TypeScript knows email is a string
    let dbUser = await getUserByEmail(email);

    if (!dbUser) {
      const newUser = {
        id: cuid(),
        name: username,
        email,
        password: "",  // optional for Google users
        google: 1,     // mark as Google account
        photo,
        created_at: createdAt,
      };
      await insertUser(newUser);
      dbUser = newUser;
    }

    const loggedInUser = { username: dbUser.name ?? "Unknown", email: dbUser.email ?? "" };
    setUser(loggedInUser);
    await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
    router.replace("/home");

  } catch (error: any) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          console.log("Sign-in already in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log("Play services not available or outdated");
          break;
        case statusCodes.SIGN_IN_CANCELLED:
          console.log("User cancelled sign-in");
          break;
        default:
          console.error("Google Sign-In error:", error);
      }
    } else {
      console.error("Unknown error during Google sign-in", error);
    }
  }
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
  const createdAt = new Date().toISOString(); 
    const newUser = { id: cuid(), name: username, email, password: hashedPassword, created_at: createdAt };
    await insertUser(newUser);

    const loggedInUser = { username, email, created_at: createdAt };
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
      value={{ user, login, logout, register, signInWithGoogle, loading }}
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
