import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnnouncementCard } from "../../components/AnnouncementCard";
import { EmptyState } from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import { colors, radius, spacing, typography } from "../../constants/theme";
import { AppStackParamList } from "../../navigation/AppNavigator";
import { Announcement } from "../../types";

type Props = NativeStackScreenProps<AppStackParamList, "Feed">;

const ADMIN_ROLES = new Set(["CLUB_ADMIN", "SUPER_ADMIN"]);

export function AnnouncementsFeedScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const {
    items,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    refresh,
    loadMore,
  } = useAnnouncements();

  const canPost = !!user && ADMIN_ROLES.has(user.role);

  // Refetch when returning to this screen (e.g. after posting a new
  // announcement) — skip the very first focus since the hook's own
  // useEffect already handles the initial load.
  const hasFocusedBefore = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (hasFocusedBefore.current) {
        refresh();
      }
      hasFocusedBefore.current = true;
    }, [refresh])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>CAMPORA</Text>
          <Text style={styles.headerTitle}>Announcements</Text>
        </View>
        <Pressable onPress={logout} hitSlop={12}>
          <Text style={styles.logout}>Log out</Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList<Announcement>
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AnnouncementCard announcement={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.accent}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        ListEmptyComponent={
          <EmptyState
            title="No announcements yet"
            subtitle="Club posts and college-wide notices will show up here."
          />
        }
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator color={colors.accent} style={{ marginVertical: spacing.md }} />
          ) : null
        }
      />

      {canPost ? (
        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate("NewAnnouncement")}
          hitSlop={8}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    ...typography.display,
    color: colors.textPrimary,
  },
  logout: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  errorBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: "#3A1F2680",
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: colors.background,
    fontWeight: "700",
    marginTop: -2,
  },
});
