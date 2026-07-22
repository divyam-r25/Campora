import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().min(3).max(140),
  body: z.string().min(1).max(4000),
  clubId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional(),
});
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

// Query params come in as strings over HTTP, so this schema coerces before
// validating — a plain z.number() would reject "20" outright.
export const listAnnouncementsQuerySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type ListAnnouncementsQuery = z.infer<typeof listAnnouncementsQuerySchema>;
