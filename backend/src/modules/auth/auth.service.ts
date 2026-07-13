import { prisma } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { hashPassword, verifyPassword } from "../../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { LoginInput, SignupInput } from "./auth.validation";

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

async function resolveCollege(email: string, inviteCode?: string) {
  const domain = email.split("@")[1]?.toLowerCase();

  const byDomain = await prisma.college.findUnique({ where: { domain } });
  if (byDomain) return byDomain;

  if (inviteCode) {
    const byInvite = await prisma.college.findUnique({
      where: { inviteCode },
    });
    if (byInvite) return byInvite;
  }

  throw ApiError.badRequest(
    "We don't recognize this college. Use your college email, or ask your club admin for an invite code."
  );
}

async function issueTokenPair(userId: string, collegeId: string, role: string) {
  const accessToken = signAccessToken({ userId, collegeId, role });
  const refreshToken = signRefreshToken({ userId });

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return { accessToken, refreshToken };
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const college = await resolveCollege(input.email, input.inviteCode);
  const passwordHash = await hashPassword(input.password);

  // Domain match = auto-verified. Invite-code signups still count as verified
  // since the code was issued by a club admin for that college.
  const user = await prisma.user.create({
    data: {
      collegeId: college.id,
      email: input.email,
      passwordHash,
      name: input.name,
      isVerified: true,
    },
  });

  const tokens = await issueTokenPair(user.id, user.collegeId, user.role);
  return { user: toSafeUser(user), ...tokens };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized("Invalid email or password");

  const tokens = await issueTokenPair(user.id, user.collegeId, user.role);
  return { user: toSafeUser(user), ...tokens };
}

export async function refresh(refreshToken: string) {
  let payload: { userId: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized("Refresh token is no longer valid");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw ApiError.unauthorized("User no longer exists");

  // Rotate: revoke the used refresh token, issue a fresh pair.
  // This means a stolen refresh token is only usable once before detection.
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  });

  const tokens = await issueTokenPair(user.id, user.collegeId, user.role);
  return { user: toSafeUser(user), ...tokens };
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { revoked: true },
  });
}

// Never send passwordHash to the client
function toSafeUser(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  collegeId: string;
  avatarUrl: string | null;
  isVerified: boolean;
}) {
  const { id, email, name, role, collegeId, avatarUrl, isVerified } = user;
  return { id, email, name, role, collegeId, avatarUrl, isVerified };
}
