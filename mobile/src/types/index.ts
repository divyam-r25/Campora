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

export interface Author {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Club {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  createdAt: string;
  author: Author;
  club: Club | null;
}

export interface AnnouncementsPage {
  items: Announcement[];
  nextCursor: string | null;
}
