import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();
type User = {
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-login if token or user data exists
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
      setLoading(false);
    };
    loadUser();
  }, []);

 const login = async (email: string, password: string) => {
  try {
    // 1. Fetch user from DB by email
    const result = await db.select().from(users).where(eq(users.email, email));
    const foundUser = result[0];

    if (!foundUser) {
      throw new Error("User not found");
    }

    // 2. Compare provided password with stored hash
      const hashPassword = async (password: string) => {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
};
       const hashedInputPassword = await hashPassword(password);

    if (hashedInputPassword !== foundUser.password) {
      throw new Error("Incorrect password");
    }
    // 3. Save to state and AsyncStorage (excluding password)
    const loggedInUser = {
      username: foundUser.name,
      email: foundUser.email,
    };
    setUser(loggedInUser);
    await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));

    console.log("Login successful");
  } catch (error: any) {
    console.error("Login failed:", error.message);
    throw new Error(error.message);
  }
};

const register = async (username: string, email: string, password: string) => {
  try {
    // 1. Hash password
    const hashPassword = async (password: string) => {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
};
   const hashedPassword = await hashPassword(password);

    // 2. Insert into SQLite using Drizzle
    await db.insert(users).values({
      name: username,
      email,
      password: hashedPassword,
    });

    // 3. Save to state and AsyncStorage (optional)
     const newUser = { username, email };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed: users.email")) {
      throw new Error("Email already in use");
    } else if (error.message.includes("UNIQUE constraint failed: users.name")) {
      throw new Error("Username already in use");
    } else {
      throw new Error("Registration failed");
    }
  }
};




 

const logout = async () => {
  try {
    setUser(null);
    await AsyncStorage.removeItem("user");
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Something went wrong while logging out");
  }
};

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
