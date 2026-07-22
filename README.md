# Campora

A multi-tenant campus social app — announcements, events, groups/chat,
marketplace, lost & found, and attendance reminders, built to work for any
college, not just one.

Read these in order:
1. **ARCHITECTURE.md** — the full system design and why it's built this way
2. **ROADMAP.md** — the week-by-week build plan
3. **backend/README.md** — backend setup
4. Mobile setup — below

## Quick start

**Backend** (see `backend/README.md` for full detail):
```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

**Mobile:**
```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with Expo Go on your phone, or press `i`/`a` for a simulator.
If testing on a physical device, change `apiUrl` in `mobile/app.json` from
`localhost` to your machine's local network IP (`localhost` won't resolve
from a phone on the same wifi).

## Troubleshooting: signup/login fails on a physical device

This is the most common first blocker, and it's two separate issues that
look identical from the error banner:

**1. Find your computer's LAN IP** (the machine running the backend):
```bash
# Mac
ipconfig getifaddr en0
# Windows (PowerShell)
ipconfig        # look for "IPv4 Address" under your active adapter
# Linux
hostname -I
```
Then edit `mobile/app.json` → `expo.extra.apiUrl` → replace `localhost` with
that IP, e.g. `http://192.168.1.42:4000/api`. Your phone and computer must be
on the same wifi network. Restart `expo start` after changing this.

**2. Seed a College row** so your email domain is recognized:
```bash
cd backend
npx tsx prisma/seed.ts
```
This creates one College with domain `sst.scaler.com` — edit
`prisma/seed.ts` first if your email domain is different.

With the updated error handling in this version, if you still see a failure
after both fixes, the app will now show you the *actual* reason (network
unreachable vs. a specific validation message from the server) instead of
one generic message — that'll tell you exactly which of the two this is.

## What's built vs what's next

**Phase 0 (auth + multi-tenancy)** and **Phase 1 (announcements)** are
complete and compile cleanly — see ROADMAP.md for exactly what each covers
and what to test before moving on.

Everything else — events, chat, marketplace, lost & found, attendance — is
fully designed in the schema and API map but not yet built.
