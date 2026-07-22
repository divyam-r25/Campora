import { Router } from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.middleware";
import { validateBody, validateQuery } from "../../middleware/validate.middleware";
import {
  createAnnouncementHandler,
  listAnnouncementsHandler,
} from "./announcement.controller";
import {
  createAnnouncementSchema,
  listAnnouncementsQuerySchema,
} from "./announcement.validation";

const router = Router();

router.use(authMiddleware);

router.get("/", validateQuery(listAnnouncementsQuerySchema), listAnnouncementsHandler);

router.post(
  "/",
  requireRole("CLUB_ADMIN", "SUPER_ADMIN"),
  validateBody(createAnnouncementSchema),
  createAnnouncementHandler
);

export default router;
