import { api } from "./api";
import { Announcement, AnnouncementsPage } from "../types";

export async function fetchAnnouncements(cursor?: string | null): Promise<AnnouncementsPage> {
  const { data } = await api.get<AnnouncementsPage>("/announcements", {
    params: cursor ? { cursor, limit: 20 } : { limit: 20 },
  });
  return data;
}

export async function createAnnouncement(input: {
  title: string;
  body: string;
  clubId?: string;
  imageUrl?: string;
}): Promise<Announcement> {
  const { data } = await api.post<Announcement>("/announcements", input);
  return data;
}
