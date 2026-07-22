import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { useAuth } from "../../context/AuthContext";
import { colors, spacing, typography } from "../../constants/theme";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
    } catch (err: any) {
      if (err?.response) {
        setError(err.response.data?.error ?? "Something went wrong. Try again.");
      } else if (err?.request) {
        setError(
          "Can't reach the server. Check that the backend is running and EXPO_PUBLIC_API_URL points to your computer's IP, not localhost."
        );
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>CAMPORA</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in with your college email</Text>

        <View style={styles.form}>
          <TextField
            label="College email"
            placeholder="you@yourcollege.edu"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <Button title="Log in" onPress={handleLogin} loading={loading} disabled={!email || !password} />
        </View>

        <Button
          title="New here? Create an account"
          variant="secondary"
          onPress={() => navigation.navigate("Signup")}
          style={styles.secondaryButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: "center",
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.lg,
  },
  errorBanner: {
    color: colors.danger,
    marginBottom: spacing.md,
    fontSize: 13,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
});
