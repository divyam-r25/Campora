import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload {
  userId: string;
  collegeId: string;
  role: string;
}

// jsonwebtoken types expiresIn as a specific literal/number type, not a plain
// string, so env values (which are just `string`) need this narrow cast at
// the one place they're used — safer than loosening the type everywhere else.
const accessOptions: SignOptions = {
  expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
};
const refreshOptions: SignOptions = {
  expiresIn: env.jwtRefreshExpiresIn as SignOptions["expiresIn"],
};

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, accessOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}

export function signRefreshToken(payload: { userId: string }): string {
  return jwt.sign(payload, env.jwtRefreshSecret, refreshOptions);
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, env.jwtRefreshSecret) as { userId: string };
}
