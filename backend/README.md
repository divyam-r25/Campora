# Campora — Backend

## Setup

```bash
npm install
cp .env.example .env
# edit .env — set DATABASE_URL to a real Postgres instance
# (a free one on Neon or Supabase works fine for local dev)

npx prisma generate
npx prisma migrate dev --name init

npm run dev   # http://localhost:4000
```

## Important — read before running

This project was scaffolded in a sandboxed environment that couldn't reach
`binaries.prisma.sh` (Prisma downloads its query engine from there), so
`prisma generate` was **not** run here, and the Prisma-dependent code
(`auth.service.ts`) was not type-checked against real generated types.

The first command you run locally must be:
```bash
npx prisma generate
```
If there's a mismatch between the schema and how it's used in `auth.service.ts`,
this is where it'll surface — with a clear error pointing at the exact line.
That's expected and normal, not a sign something is badly broken; treat it as
the first real debugging rep on this project.

Everything *not* touching Prisma (`jwt.ts`, `password.ts`, middleware, `app.ts`)
was compiled and type-checked cleanly.

## Test the auth flow once running

```bash
# Signup (only works if the email domain matches a College.domain row —
# seed one first via `npx prisma studio`)
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Divyam","email":"you@yourcollege.edu","password":"testpass123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@yourcollege.edu","password":"testpass123"}'
```

You'll need at least one `College` row in the database before signup works —
easiest way is `npx prisma studio` and add one by hand for now (a proper
college-onboarding flow is a later phase).
