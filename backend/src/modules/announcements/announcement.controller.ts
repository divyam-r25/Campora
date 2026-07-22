import { Request, Response } from "express";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import * as announcementService from "./announcement.service";
import { ListAnnouncementsQuery } from "./announcement.validation";

export const listAnnouncementsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const query = req.validatedQuery as ListAnnouncementsQuery;
    const result = await announcementService.listAnnouncements(
      req.user.collegeId,
      query
    );
    res.status(200).json(result);
  }
);

export const createAnnouncementHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const announcement = await announcementService.createAnnouncement(
      req.user.collegeId,
      req.user.userId,
      req.body
    );
    res.status(201).json(announcement);
  }
);
