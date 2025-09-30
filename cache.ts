import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Define the type manually
export type TokenCache = {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
};

const createTokenCache = (): TokenCache => {
  return {
    getToken: (key) => SecureStore.getItemAsync(key),
    saveToken: (key, token) => SecureStore.setItemAsync(key, token),
  };
};

// SecureStore is not supported on the web
export const tokenCache: TokenCache | undefined =
  Platform.OS !== "web" ? createTokenCache() : undefined;
