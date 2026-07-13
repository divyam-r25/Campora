import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  // Unexpected errors: log full detail server-side, never leak internals to the client
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Something went wrong" });
}

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
}
