import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { OAuthButtons } from "@/components/oAuth"
import { useRouter } from "expo-router";

export default function SignInScreen() {
 const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter()

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({ identifier: emailAddress, password });
await setActive({ session: completeSignIn.createdSessionId });

    } catch (err: any) {
      ("Error:> " + err?.status || "");
      ("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.oauthView}>
        <OAuthButtons />
      </View>

      <View style={styles.inputView}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          style={styles.textInput}
          placeholder="Email..."
          placeholderTextColor="#000"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={password}
          style={styles.textInput}
          placeholder="Password..."
          placeholderTextColor="#000"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onSignInPress}>
        <Text style={styles.primaryButtonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Have an account?</Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(auth)/signUpScreen")}
        >
          <Text style={styles.secondaryButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  oauthView: { marginBottom: 20 },
  inputView: { marginVertical: 8 },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryButton: {
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  secondaryButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  secondaryButtonText: { color: "#1f2937" },
  footer: { flexDirection: "row", marginTop: 12, alignItems: "center" },
});
