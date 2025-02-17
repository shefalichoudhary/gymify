import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import bcrypt from "react-native-bcrypt";
import { db } from "../db/db";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

bcrypt.setRandomFallback((len: number) => {
  const randomBytes = Crypto.getRandomBytes(len);
  return Array.from(randomBytes);
});

interface AuthContextType {
  user: { id: string; username: string; email: string } | null;
  isAuthenticated: boolean | undefined;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string, password: string) => Promise<void>;
  googleAuth: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const saveUserToStorage = async (user: AuthContextType["user"]) => {
    try {
      await SecureStore.setItemAsync("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to storage:", error);
    }
  };

  const getUserFromStorage = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error getting user from storage:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    };
    loadUser();
  }, []);

  // Register functionality

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();

      if (existingUser) {
        alert("Email address is already in use. Please try a different one.");
        return;
      }

      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10)); // Async hashing

      await db
        .insert(users)
        .values({ username, email, password: hashedPassword })
        .execute();

      const foundUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();
      if (!foundUser) throw new Error("User not found after registration.");

      const newUser = {
        id: foundUser.id.toString(),
        username: foundUser.username,
        email: foundUser.email,
      };
      setUser(newUser);

      setIsAuthenticated(true);
      await saveUserToStorage(newUser);
      alert("Registration successful!");
    } catch (error) {
      throw new Error("Registration failed. Please try again.");
    }
  };

  // Login functionality

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const foundUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();
      if (!foundUser) {
        alert("Invalid email address. Please try again.");
        return;
      }

      const isPasswordCorrect = await bcrypt.compareSync(
        password,
        foundUser.password
      );
      if (!isPasswordCorrect) {
        alert("Invalid password. Please try again.");
        return;
      }

      const loggedInUser = {
        id: foundUser.id.toString(),
        username: foundUser.username,
        email: foundUser.email,
      };

      setUser(loggedInUser);
      setIsAuthenticated(true);

      await saveUserToStorage(loggedInUser);
    } catch (error) {
      throw new Error("Login failed. Please try again.");
    }
  };

  // Google SignIN and SignUp functionality

  const googleAuth = async (token: string): Promise<void> => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await res.json();

      if (!userData.email) throw new Error("Google sign-in failed.");

      // Check if user exists
      let existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .get();

      if (!existingUser) {
        // If user doesn't exist, create a new one
        await db
          .insert(users)
          .values({
            username: userData.name,
            email: userData.email,
          })
          .execute();

        // Fetch the newly created user
        existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, userData.email))
          .get();
      }

      if (!existingUser)
        throw new Error("User not found after Google sign-in.");

      const loggedInUser = {
        id: existingUser.id.toString(),
        username: existingUser.username,
        email: existingUser.email,
      };
      setUser(loggedInUser);
      setIsAuthenticated(true);
      await saveUserToStorage(loggedInUser);

      alert("Google Sign-In Successful!");
    } catch (error) {
      alert("Google sign-in failed. Please try again.");
    }
  };

  // Reset Password functionality

  const resetPassword = async (
    email: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const foundUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();
      if (!foundUser) throw new Error("No user found with this email.");

      const hashedPassword = await bcrypt.hashSync(
        newPassword,
        bcrypt.genSaltSync(10)
      );

      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.email, email))
        .execute();
      alert("Password reset successful!");
    } catch (error) {
      throw new Error("Password reset failed. Please try again.");
    }
  };

  //  Logout functionality

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        isAuthenticated,
        resetPassword,
        googleAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
