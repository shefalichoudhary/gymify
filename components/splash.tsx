import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

type SplashProps = {
  error?: boolean;
  message?: string;
  onReady?: () => void;
};

export default function Splash({ error = false, message, onReady }: SplashProps) {
  useEffect(() => {
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏋️ Gymify</Text>
      {error ? (
        <Text style={styles.errorText}>{message}</Text>
      ) : (
        <>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.subtitle}>{message}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginTop: 12,
  },
});
