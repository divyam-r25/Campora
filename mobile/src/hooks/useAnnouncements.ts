import { useCallback, useEffect, useState } from "react";
import * as announcementService from "../services/announcementService";
import { Announcement } from "../types";

interface UseAnnouncementsResult {
  items: Announcement[];
  isLoading: boolean; // initial load only
  isRefreshing: boolean; // pull-to-refresh
  isLoadingMore: boolean; // infinite scroll
  error: string | null;
  hasMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  prependLocal: (announcement: Announcement) => void;
}

export function useAnnouncements(): UseAnnouncementsResult {
  const [items, setItems] = useState<Announcement[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const page = await announcementService.fetchAnnouncements();
      setItems(page.items);
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
    } catch (err: any) {
      setError(
        err?.response
          ? err.response.data?.error ?? "Couldn't load announcements."
          : "Can't reach the server. Check your connection and try again."
      );
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    load().finally(() => setIsLoading(false));
  }, [load]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isLoading) return;
    setIsLoadingMore(true);
    try {
      const page = await announcementService.fetchAnnouncements(cursor);
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
    } catch {
      // Silent failure on pagination — the user still has what's loaded,
      // and can retry by scrolling again. A banner error here would be
      // disruptive for something this minor.
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, hasMore, isLoadingMore, isLoading]);

  const prependLocal = useCallback((announcement: Announcement) => {
    setItems((prev) => [announcement, ...prev]);
  }, []);

  return {
    items,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
    prependLocal,
  };
}
