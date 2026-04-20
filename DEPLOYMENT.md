# Deployment Notes

## Backend

The backend currently uses SQLite through Prisma:

- Keep `prisma/dev.db` on persistent storage.
- If you redeploy into a container, mount a volume for the database file.
- Re-run migrations with `npx prisma migrate deploy`.
- Re-run seeding only when you explicitly want the demo data reset with `npx tsx prisma/seed.ts`.

Recommended production startup:

```bash
npx prisma generate
npx prisma migrate deploy
npx tsx src/server.ts
```

## Environment Variables

Set these in production:

```env
PORT=3000
JWT_SECRET=use-a-strong-secret
DATABASE_URL=file:./dev.db
CORS_ORIGINS=https://your-frontend-domain.com
SOCKET_CORS_ORIGINS=https://your-frontend-domain.com
```

If you move away from SQLite later, update `prisma/schema.prisma` before deploying.

## Mobile App

The mobile app reads the API URL from Expo public variables:

```env
EXPO_PUBLIC_BASE_URL=https://your-api-domain.com
EXPO_PUBLIC_SOCKET_URL=https://your-api-domain.com
```

For release builds, prefer an Expo/EAS workflow and make sure the API URL points to a public host.

## Operational Notes

- Back up `prisma/dev.db` regularly.
- Rotate `JWT_SECRET` before going live.
- Replace the demo seed credentials before production use.

