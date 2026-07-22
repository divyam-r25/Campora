import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";
import { Announcement } from "../types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {announcement.club ? announcement.club.name : "College-wide"}
          </Text>
        </View>
        <Text style={styles.time}>{timeAgo(announcement.createdAt)}</Text>
      </View>

      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.body} numberOfLines={6}>
        {announcement.body}
      </Text>

      {announcement.imageUrl ? (
        <Image source={{ uri: announcement.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : null}

      <Text style={styles.author}>Posted by {announcement.author.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  time: {
    ...typography.caption,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  author: {
    ...typography.caption,
  },
});
