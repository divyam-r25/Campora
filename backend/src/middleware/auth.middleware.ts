import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { verifyAccessToken } from "../utils/jwt";

// Verifies the JWT and attaches { userId, collegeId, role } to req.user.
// Every route below this (except /auth/*) relies on req.user.collegeId
// to scope its database queries — this is the single point where
// cross-tenant data leaks are prevented.
export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing or malformed Authorization header"));
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}

// Role gate — usage: router.post('/', authMiddleware, requireRole('CLUB_ADMIN', 'SUPER_ADMIN'), ...)
export function requireRole(...allowed: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!allowed.includes(req.user.role)) {
      return next(ApiError.forbidden("You don't have permission to do this"));
    }
    next();
  };
}
