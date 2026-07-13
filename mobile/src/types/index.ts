export type Role = "STUDENT" | "CLUB_ADMIN" | "FACULTY" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  collegeId: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}
