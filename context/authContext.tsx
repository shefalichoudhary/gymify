import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import cuid from "cuid";  
import { makeRedirectUri } from "expo-auth-session";
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

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "756288749216-vr6ijqcj6j368qc2s7bhr6kd2f5n4c0a.apps.googleusercontent.com",
    androidClientId: "756288749216-3oaav02buu9204ugjvp2oe6jmchq0o8c.apps.googleusercontent.com",
    webClientId: "756288749216-vr6ijqcj6j368qc2s7bhr6kd2f5n4c0a.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    redirectUri: makeRedirectUri({ scheme: "myapp"}),
  } as any);

   useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const { authentication } = response;
        if (!authentication?.accessToken) return;

        const userInfoResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          }
        );
        const userInfo = await userInfoResponse.json();
        const email = userInfo.email;
        const username = userInfo.name;

        // Check if user exists in DB
        let result = await db.select().from(users).where(eq(users.email, email));
        let dbUser = result[0];

        if (!dbUser) {
          const newUser = {
            id: cuid(),
            name: username,
            email,
            password: "", // empty for Google login
          };
          await db.insert(users).values(newUser);
          dbUser = newUser;
        }

        const loggedInUser = { username: dbUser.name, email: dbUser.email };
        setUser(loggedInUser);
        await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
      }
    };
    handleGoogleResponse();
  }, [response]);
  // Load user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
      setLoading(false);
    };
    loadUser();
  }, []);

   

  // Google login function
 const loginWithGoogle = async () => {
    if (!request) throw new Error("Google Auth request not ready");
    await promptAsync();
  };

  // Email/password login
  const login = async (email: string, password: string) => {
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      const foundUser = result[0];

      if (!foundUser) throw new Error("User not found");

      // Compare hashed password
      const hashedInput = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      if (hashedInput !== foundUser.password) throw new Error("Incorrect password");

      const loggedInUser = { username: foundUser.name, email: foundUser.email };
      setUser(loggedInUser);
      await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Registration
  const register = async (username: string, email: string, password: string) => {
    try {
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      await db.insert(users).values({ name: username, email, password: hashedPassword });

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

  // Logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register,loginWithGoogle, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
