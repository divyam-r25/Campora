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
import * as announcementService from "../../services/announcementService";
import { colors, spacing, typography } from "../../constants/theme";
import { AppStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "NewAnnouncement">;

export function NewAnnouncementScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await announcementService.createAnnouncement({
        title: title.trim(),
        body: body.trim(),
      });
      navigation.goBack();
    } catch (err: any) {
      setError(
        err?.response
          ? err.response.data?.error ?? "Couldn't post that. Try again."
          : "Can't reach the server. Check your connection and try again."
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
        <Text style={styles.eyebrow}>NEW ANNOUNCEMENT</Text>
        <Text style={styles.title}>Post to your college</Text>
        <Text style={styles.subtitle}>
          This goes out to everyone at your college immediately — no draft
          state yet, so double check before posting.
        </Text>

        <View style={styles.form}>
          <TextField
            label="Title"
            placeholder="e.g. Robotics Club — Info Session Friday"
            value={title}
            onChangeText={setTitle}
            maxLength={140}
          />
          <TextField
            label="Details"
            placeholder="What, where, when — keep it scannable"
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={6}
            style={styles.bodyInput}
            maxLength={4000}
          />

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <Button
            title="Post announcement"
            onPress={handleSubmit}
            loading={loading}
            disabled={title.trim().length < 3 || body.trim().length < 1}
          />
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />
        </View>
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
    lineHeight: 20,
  },
  form: {
    marginBottom: spacing.lg,
  },
  bodyInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  errorBanner: {
    color: colors.danger,
    marginBottom: spacing.md,
    fontSize: 13,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
});
