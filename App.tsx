import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Button, Linking, StyleSheet, Text, View } from "react-native";

const REDIRECT_URL = "keepalivedemo://redirect";
const AUTH_URL = `http://localhost:8000/?redirect_uri=${encodeURIComponent(REDIRECT_URL)}`;

const processStartedAt = new Date().toLocaleTimeString();

export default function App() {
  const [authResult, setAuthResult] = useState("none");
  const [initialUrl, setInitialUrl] = useState("none");
  const [lastUrlEvent, setLastUrlEvent] = useState("none");

  useEffect(() => {
    Linking.getInitialURL().then((url) => setInitialUrl(url ?? "none"));
    const subscription = Linking.addEventListener("url", ({ url }) =>
      setLastUrlEvent(url),
    );
    return () => subscription.remove();
  }, []);

  const startAuth = async () => {
    setAuthResult("pending…");
    const result = await WebBrowser.openAuthSessionAsync(
      AUTH_URL,
      REDIRECT_URL,
    );
    setAuthResult(JSON.stringify(result));
  };

  return (
    <View style={styles.container}>
      <Button title="Start auth session" onPress={startAuth} />
      <Text style={styles.line} testID="process-started-at">
        JS started at: {processStartedAt}
      </Text>
      <Text style={styles.line} testID="auth-result">
        openAuthSessionAsync result: {authResult}
      </Text>
      <Text style={styles.line} testID="initial-url">
        Linking.getInitialURL: {initialUrl}
      </Text>
      <Text style={styles.line} testID="last-url-event">
        Last Linking 'url' event: {lastUrlEvent}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  line: {
    fontFamily: "monospace",
  },
});
