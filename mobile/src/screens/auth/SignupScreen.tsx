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

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

export function SignupScreen({ navigation }: Props) {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        inviteCode: inviteCode.trim() || undefined,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
          "Couldn't create your account. Double check your college email."
      );
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
        <Text style={styles.eyebrow}>CAMPUS CONNECT</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Use your college email — it verifies you automatically. No college
          domain? Ask your club admin for an invite code.
        </Text>

        <View style={styles.form}>
          <TextField label="Full name" placeholder="Divyam R" value={name} onChangeText={setName} />
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
            placeholder="At least 8 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextField
            label="Invite code (optional)"
            placeholder="Only if your college isn't recognized yet"
            autoCapitalize="characters"
            value={inviteCode}
            onChangeText={setInviteCode}
          />

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <Button
            title="Create account"
            onPress={handleSignup}
            loading={loading}
            disabled={!name || !email || password.length < 8}
          />
        </View>

        <Button
          title="Already have an account? Log in"
          variant="secondary"
          onPress={() => navigation.navigate("Login")}
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
