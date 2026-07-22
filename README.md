# Campora

A multi-tenant campus social app — announcements, events, groups/chat, marketplace, lost & found, and attendance reminders — built to work for **any college, not just one**.

## Tech Stack

| Layer | Tech |
|---|---|
| Mobile | React Native (Expo) |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (access + refresh token rotation) |
| Multi-tenancy | College-domain verified signup |

## Project Structure

```
campora/
├── backend/          # Express API (TypeScript)
│   ├── prisma/       # Schema, migrations, seed
│   └── src/
│       ├── modules/
│       │   ├── auth/           # Signup, login, refresh, logout
│       │   └── announcements/  # Feed + create endpoints
│       ├── middleware/         # Auth guard, role guard, validation
│       ├── config/             # Env validation (Zod)
│       └── utils/
└── mobile/           # Expo (React Native + TypeScript)
    └── src/
        ├── screens/
        │   ├── auth/           # Login, Signup
        │   ├── home/           # Home dashboard
        │   └── announcements/  # Feed, New Announcement
        ├── components/         # AnnouncementCard, EmptyState
        ├── hooks/              # useAnnouncements
        ├── services/           # API service layer
        ├── context/            # Auth context
        └── navigation/         # Stack + Tab navigator
```

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # fill in DATABASE_URL (Postgres connection string)
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts   # seeds a College row (domain: sst.scaler.com)
npm run dev              # starts on http://localhost:4000
```

> See `backend/README.md` for full environment variable reference.

### 2. Mobile

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `i` / `a` for a simulator.

> **Physical device?** Edit `mobile/app.json` → `expo.extra.apiUrl` — replace `localhost` with your machine's LAN IP (e.g. `http://192.168.1.42:4000/api`). Your phone and computer must be on the same Wi-Fi. Restart `expo start` after the change.

## Troubleshooting: Signup / Login Fails on a Physical Device

This is the most common first blocker — two separate issues that look identical:

**1 — Find your machine's LAN IP:**

```bash
# macOS
ipconfig getifaddr en0

# Windows (PowerShell)
ipconfig       # look for "IPv4 Address" under your active adapter

# Linux
hostname -I
```

Update `expo.extra.apiUrl` in `mobile/app.json` and restart `expo start`.

**2 — Seed a College row** so your email domain is recognised:

```bash
cd backend
npx tsx prisma/seed.ts
```

This creates one College with domain `sst.scaler.com`. Edit `prisma/seed.ts` before running if your email domain is different.

## Promoting a User to Club Admin (for testing announcements)

The signup flow always creates `STUDENT` users. To test posting announcements:

```bash
cd backend
npx prisma studio
# Open the User table → change your role to CLUB_ADMIN → Save
```

## What's Built

| Phase | Feature | Status |
|---|---|---|
| 0 | Auth (signup, login, JWT refresh, roles) + multi-tenancy | ✅ Done |
| 0 | Mobile navigation shell, session persistence, auto token refresh | ✅ Done |
| 1 | Announcements feed (cursor-paginated, infinite scroll, pull-to-refresh) | ✅ Done |
| 1 | Create announcement (CLUB_ADMIN / SUPER_ADMIN only) | ✅ Done |

## What's Next

| Phase | Feature |
|---|---|
| 2 | Events + RSVP + QR check-in |
| 3 | Groups & Chat (Socket.io) |
| 4 | Marketplace (image upload → S3/Cloudinary) |
| 5 | Lost & Found |
| 6 | Attendance reminders + push notifications (Expo Push + BullMQ) |
| 7 | Polish — moderation, rate limiting, EAS Build / App Store |

See `ROADMAP.md` for the full week-by-week plan and `ARCHITECTURE.md` for system design decisions.
