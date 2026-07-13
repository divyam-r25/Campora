# Campus Connect

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

## What's built vs what's next

Phase 0 (auth + multi-tenancy) is complete and compiles cleanly. Everything
else — announcements, events, chat, marketplace, lost & found, attendance —
is fully designed in the schema and API map but not yet built. That's
intentional: see ROADMAP.md for why, and for the order to build them in.
