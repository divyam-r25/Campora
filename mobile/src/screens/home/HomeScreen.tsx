import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { colors, spacing, typography } from "../../constants/theme";

export function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>CAMPORA</Text>
        <Text style={styles.title}>Hey {user?.name.split(" ")[0]} 👋</Text>
        <Text style={styles.subtitle}>
          You're logged in and verified for your college. The announcements
          feed, events, groups, marketplace, lost & found, and attendance
          reminders modules mount here next — each one follows the same
          screen → service → API pattern as this auth flow.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Signed in as</Text>
          <Text style={styles.cardValue}>{user?.email}</Text>
          <Text style={styles.cardLabel}>Role</Text>
          <Text style={styles.cardValue}>{user?.role}</Text>
        </View>

        <Button title="Log out" variant="secondary" onPress={logout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg, justifyContent: "center" },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  title: { ...typography.display, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 21 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  cardLabel: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  cardValue: { ...typography.body, color: colors.textPrimary, fontWeight: "600" },
});
