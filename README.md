# Lomiteria

Monorepo for the Lomiteria system:

- `src/` and `prisma/` contain the backend API.
- `apps/waiter-mobile/` contains the Expo mobile app.
- `CatalogoPrecios/` contains menu catalog images.

## Requirements

- Node.js 20+ recommended
- npm
- SQLite is used by the current Prisma schema

## Project Structure

- Backend API: Express + Prisma + Socket.IO + JWT
- Mobile app: Expo + React Native + Zustand + Axios

## Backend Setup

From the repository root:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts
npx tsx src/server.ts
```

The API listens on `PORT` and defaults to `3000`.

## Backend Environment

Create a `.env` file in the repository root if you want to override the defaults:

```env
PORT=3000
JWT_SECRET=change-me
DATABASE_URL=file:./dev.db
CORS_ORIGINS=*
SOCKET_CORS_ORIGINS=*
```

Defaults are defined in [`src/config/env.ts`](./src/config/env.ts).

## Mobile App Setup

From `apps/waiter-mobile/`:

```bash
npm install
npm start
```

To point the app at a different backend, set Expo public env vars:

```env
EXPO_PUBLIC_BASE_URL=http://localhost:3000
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

If you are testing on a physical device, use a reachable LAN IP or `npm run start:tunnel`.

## Seed Data

The seed script creates:

- `admin` user with password `zarf123`
- `waiter1` user with password `zarf123`
- default tables, categories, products, and extras

Run the seed again after resetting the database if you want the demo data restored.

## Deployment Notes

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for production and hosting notes.

