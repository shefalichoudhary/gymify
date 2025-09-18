import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "756288749216-3oaav02buu9204ugjvp2oe6jmchq0o8c.apps.googleusercontent.com",
    webClientId:"756288749216-vr6ijqcj6j368qc2s7bhr6kd2f5n4c0a.apps.googleusercontent.com"
  });

  return { request, response, promptAsync };
};
