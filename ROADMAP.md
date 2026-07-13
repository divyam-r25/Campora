# Roadmap — 1 to 3 months

Each phase is a real, demoable milestone. Don't start the next phase until the
current one works end-to-end (API + mobile screen + you can explain every
line). That's what makes this defensible in an interview later, and it's
also just... how you avoid a pile of half-finished features in month three.

## Phase 0 — Done in this pass
- Prisma schema for the whole system (multi-tenant)
- Auth: signup (college-domain verified), login, JWT refresh rotation, roles
- Mobile: navigation shell, login/signup screens, session persistence, auto
  token refresh on 401

**Your job before moving on:** run it locally, get a real signup/login
working end-to-end against a real Postgres DB. Break it on purpose (expired
token, wrong password, duplicate email) and confirm the errors are sane.

## Phase 1 — Announcements (week 1-2)
The simplest possible full-stack feature: mostly-read CRUD. Good first module
to build yourself using the auth module as a template (route → controller →
service, same shape).
- Backend: `GET /announcements` (paginated, scoped to collegeId), `POST` (club-admin+)
- Mobile: feed screen, pull-to-refresh, empty state
- This is where you'll first feel the value of the tenant-scoping pattern —
  every query filtered by `req.user.collegeId`

## Phase 2 — Events (week 2-3)
- RSVP model already in the schema
- QR check-in: generate a QR encoding `eventId`, club-admin scans it →
  `POST /events/:id/checkin` — `expo-barcode-scanner` or `expo-camera` on
  the scanning side
- This phase teaches you the RSVP → check-in state machine pattern, reused
  nowhere else but worth doing once properly

## Phase 3 — Groups & Chat (week 3-5)
- Reuse the architecture from your messagingApp project — you've done this before
- Socket.io server alongside Express, JWT-authenticated socket handshake
- Mobile: socket.io-client, message list, typing indicators are optional polish
- This is the most technically involved phase — budget real time for it

## Phase 4 — Marketplace (week 5-6)
- Image upload flow: mobile → signed URL from your backend → direct upload
  to S3/Cloudinary (never through your own server)
- Listing CRUD, category filter, "mark as sold"

## Phase 5 — Lost & Found (week 6-7)
- Structurally almost identical to Marketplace — should be fast
- This is deliberate: once you've built Marketplace, this phase is where you
  prove to yourself you actually understood the pattern, not just copied it

## Phase 6 — Attendance Reminders + Push Notifications (week 7-8)
- Local scheduled notifications first (`expo-notifications`, no backend
  needed) — simplest version, ships fast
- Then: server-side push via Expo Push API for announcements/events (someone
  posts an event → everyone in that college gets notified)
- This is also where a job queue (BullMQ + Redis) earns its place — don't add
  it before you have a real reason to

## Phase 7 — Polish for "actually used at a college" (ongoing)
- Moderation/reporting flow (schema already has `Report`)
- Rate limiting tuning based on real usage
- Onboarding flow for a new college (currently: you add a `College` row by
  hand in Prisma Studio — fine for a pilot, not fine for "every college")
- App store / Play store submission (EAS Build)

## What to skip until there's a real reason
- Microservices — the monolith is correct at this scale
- Kubernetes — Railway/Render/Fly.io is plenty for a college-scale app
- GraphQL — REST is simpler to reason about and debug at this size
