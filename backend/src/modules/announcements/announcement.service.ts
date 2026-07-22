import { prisma } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import {
  CreateAnnouncementInput,
  ListAnnouncementsQuery,
} from "./announcement.validation";

const authorSelect = {
  id: true,
  name: true,
  avatarUrl: true,
} as const;

const clubSelect = {
  id: true,
  name: true,
  logoUrl: true,
} as const;

export async function listAnnouncements(
  collegeId: string,
  query: ListAnnouncementsQuery
) {
  const { cursor, limit } = query;

  // Fetch one extra row so we know whether a next page exists without a
  // separate count query.
  const rows = await prisma.announcement.findMany({
    where: { collegeId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      title: true,
      body: true,
      imageUrl: true,
      createdAt: true,
      author: { select: authorSelect },
      club: { select: clubSelect },
    },
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return { items, nextCursor };
}

export async function createAnnouncement(
  collegeId: string,
  authorId: string,
  input: CreateAnnouncementInput
) {
  if (input.clubId) {
    // Guard against posting under a club from a different college, or a
    // club that doesn't exist at all — collegeId here comes from the JWT,
    // never from the client, so this is the actual tenant boundary check.
    const club = await prisma.club.findUnique({ where: { id: input.clubId } });
    if (!club || club.collegeId !== collegeId) {
      throw ApiError.badRequest("That club doesn't exist in your college");
    }
  }

  const announcement = await prisma.announcement.create({
    data: {
      collegeId,
      authorId,
      clubId: input.clubId,
      title: input.title,
      body: input.body,
      imageUrl: input.imageUrl,
    },
    select: {
      id: true,
      title: true,
      body: true,
      imageUrl: true,
      createdAt: true,
      author: { select: authorSelect },
      club: { select: clubSelect },
    },
  });

  return announcement;
}
