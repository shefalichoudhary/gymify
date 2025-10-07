import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cuid from "cuid";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  google: number | null; // ✅ allow null
  photo: string | null; // ✅ allow null
  created_at: string | null; // ✅ allow null
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check if a user ID is already stored on this device
        let storedId = await AsyncStorage.getItem("userId");

        if (storedId) {
          // Fetch user from SQLite
          const existingUser = await db.select().from(users).where(eq(users.id, storedId));
          if (existingUser.length > 0) {
            setUser(existingUser[0]);
          } else {
            // If not found in DB (edge case), generate a new user
            storedId = await createNewUser();
          }
        } else {
          // No userId found — create new user
          storedId = await createNewUser();
        }
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    const createNewUser = async (): Promise<string> => {
      const newId = cuid();
      await db.insert(users).values({ id: newId });
      const insertedUser = await db.select().from(users).where(eq(users.id, newId));
      if (insertedUser.length > 0) setUser(insertedUser[0]);
      await AsyncStorage.setItem("userId", newId);
      return newId;
    };

    initializeUser();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

// Hook to access the user
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
