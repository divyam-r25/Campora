# Campora — System Architecture

## 1. Core design decision: multi-tenancy

Every college is a **tenant**. Every table that holds user data carries a `collegeId`. This is what lets the same codebase serve every college in the future instead of forking the app per campus.

- Signup requires a college email domain (`@srmuniv.edu.in`, `@bits-pilani.ac.in`, etc.) **or** a club/admin-issued invite code for colleges without clean email domains.
- Every DB query is scoped by `collegeId` — enforced in middleware, never left to individual route handlers to remember. This is the #1 place multi-tenant apps leak data across tenants, so it's handled once, centrally.
- One Postgres database, `collegeId` as a column (not separate DBs per college) — simpler ops, cheaper, and fine up to tens of thousands of users per college. You'd only split into per-tenant DBs if a single college got enormous, which is a problem worth having.

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Mobile | Expo (React Native) + TypeScript | cross-platform, OTA updates via EAS, your existing skill set |
| Backend | Node.js + Express + TypeScript | matches your messagingApp experience, huge ecosystem |
| ORM | Prisma | type-safe queries, painless migrations, readable schema |
| Database | PostgreSQL | relational data (users, RSVPs, memberships) genuinely needs joins/constraints — Mongo would fight you here |
| Real-time | Socket.io + Redis adapter | chat, live announcement/event updates; Redis adapter lets you run multiple server instances later |
| Auth | JWT (access + refresh tokens) | stateless, scales horizontally |
| File storage | Cloudinary or S3 | never store uploads on your app server's disk |
| Push notifications | Expo Push Notifications | simplest path for Expo apps, no native FCM/APNs setup needed |
| Caching / queues | Redis | hot feeds (announcements, events), notification fan-out jobs |

## 3. Data model (Prisma, condensed)

```
College        (tenant root: id, name, domain, inviteCode)
User           (collegeId, email, passwordHash, name, role, isVerified)
RefreshToken   (userId, token, expiresAt, revoked)

Club           (collegeId, name, description, verified, createdBy)
ClubMember     (clubId, userId, role)

Announcement   (collegeId, clubId?, authorId, title, body, imageUrl)

Event          (collegeId, clubId?, title, description, location, startTime, endTime)
EventRSVP      (eventId, userId, status, checkedInAt)   -- QR check-in support

Group          (collegeId, name, isDirect, createdBy)     -- chat/groups
GroupMember    (groupId, userId, role, joinedAt)
Message        (groupId, senderId, content, attachmentUrl, editedAt, deletedAt)

LostFoundPost  (collegeId, userId, type[LOST|FOUND], title, description, imageUrl, status)

MarketplaceListing (collegeId, sellerId, title, description, price, category, imageUrls[], status)

AttendanceReminder (collegeId, userId, courseName, daysOfWeek[], classTime, notifyBeforeMinutes)

Notification   (userId, type, title, body, data(json), read)

Report         (collegeId, reporterId, targetType, targetId, reason, status)   -- moderation, needed the moment you add anonymous posting
```

Full schema lives in `backend/prisma/schema.prisma` — that file is the real source of truth, this is the readable summary.

## 4. API shape (REST + Socket.io)

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/announcements
POST   /api/announcements            (club-admin+)
GET    /api/events
POST   /api/events/:id/rsvp
POST   /api/events/:id/checkin       (QR scan, club-admin)

GET    /api/groups
POST   /api/groups
GET    /api/groups/:id/messages
   ws  /socket (join room = groupId, emit 'message:new')

GET    /api/lostfound
POST   /api/lostfound

GET    /api/marketplace
POST   /api/marketplace

GET    /api/attendance
POST   /api/attendance

POST   /api/uploads                  (signed upload URL, not raw file to your server)
```

Every route (except signup/login) runs through `authMiddleware` (verifies JWT) → `tenantMiddleware` (attaches `collegeId` from the token, scopes all downstream queries).

## 5. Folder structure

```
backend/
  prisma/schema.prisma
  src/
    config/        env, db client
    middleware/     auth, tenant, error handling
    modules/
      auth/
      announcements/
      events/
      groups/
      lostfound/
      marketplace/
      attendance/
    utils/
    server.ts

mobile/
  src/
    navigation/     Root/Auth/App navigators
    screens/
      auth/
      announcements/
      events/
      groups/
      lostfound/
      marketplace/
      attendance/
      profile/
    context/        AuthContext (global session state)
    services/        api.ts (axios instance), one service file per module
    constants/       theme, config
```

Each feature module mirrors the same pattern (routes → controller → service, and screen → hook → service on mobile) so once you've built one end-to-end, the rest are the same shape.

## 6. Scalability notes (for when this needs to actually hold up)

- **Chat**: Socket.io with a Redis adapter from day one — costs nothing at small scale, means you never rewrite this when you add a second server instance.
- **Feeds** (announcements/events): paginate everything (cursor-based, not offset), cache the "current college's active events" in Redis with a short TTL.
- **Notifications**: push sends go through a queue (BullMQ + Redis), not sent synchronously in the request — a club posting an announcement to 3,000 students shouldn't block the HTTP response.
- **File uploads**: mobile app uploads directly to S3/Cloudinary via a signed URL your backend issues — your server never touches the file bytes.
- **Rate limiting**: per-user, per-route, from day one (`express-rate-limit` + Redis store) — a campus marketplace/confession board without this gets spammed within a week.

## 7. What's built vs what's next

**Built in this pass:** full Prisma schema (all features), auth module (signup with college-domain verification, login, JWT refresh, role middleware), mobile auth screens wired to the API, navigation shell.

**Next (see ROADMAP.md):** announcements → events → groups/chat → marketplace → lost & found → attendance, roughly in that order, each 1-2 weeks.
