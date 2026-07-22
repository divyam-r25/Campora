import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/apiError";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        ApiError.badRequest("Invalid request body", result.error.flatten())
      );
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(
        ApiError.badRequest("Invalid query parameters", result.error.flatten())
      );
    }
    // Stash parsed/coerced query on a separate key — req.query itself is a
    // getter-only property on some Express versions and can't be reassigned.
    req.validatedQuery = result.data;
    next();
  };
}
