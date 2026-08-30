# Odisha AR Heritage — Core Prototype

A mobile-first WebAR platform for exploring Odisha's monuments — starting
with the **Konark Sun Temple** — in their present-day and historically
restored states, with a GPS-gated unlock and an account-synced visitor
passport. Login is mandatory: tourists sign up/log in to explore and
collect stamps; a separate admin account manages the monument catalogue.

This is the **core prototype scope** — the smallest version of the app
that proves the idea end-to-end: sign up → see monuments on a map → open
the AR experience → unlock a stamp via geofence → see it in your passport.
Itinerary planning, a leaderboard, admin analytics, and QR-code check-in
are designed and were working in an earlier build, but are held back for
a later round — see "What's next" below.

## Architecture

```
Client (tourist / admin)
   │  HTTPS + JWT (Authorization: Bearer <token>)
   ▼
React 18 + Vite frontend  ──────────────────────────────┐
   │  fetch("/api/...")                                 │
   ▼                                                      │
Express API (api/index.js), routes under /api/*          │
   │  Mongoose ODM                                        │
   ▼                                                      │
MongoDB Atlas — `users` and `monuments` collections       │
                                                            │
<model-viewer> hands off to native AR ──────────────────────┘
   (ARCore / Scene Viewer on Android, ARKit / Quick Look on iOS)
```

## Stack

- **React 18 + Vite** — app shell and dev/build tooling
- **react-router-dom** — client-side routing, with `ProtectedRoute` gating
  `/explorer` and `/passport` behind tourist login
- **Express + Mongoose** — REST API in `api/`, deployed as a single
  Vercel serverless function (see `vercel.json`)
- **MongoDB Atlas** — `users` (tourists + admin) and `monuments` (GeoJSON
  `location`, `2dsphere` indexed for the geofence check)
- **JWT** (`jsonwebtoken` + `bcryptjs`) — stateless auth; the token is
  stored in `localStorage` and sent as `Authorization: Bearer <token>`
- **`<model-viewer>`** (Google, via CDN in `index.html`) — WebXR/AR
  surface tracking for `.glb` models, handing off to ARCore/Scene Viewer
  or ARKit/Quick Look on-device
- **Leaflet + OpenStreetMap** — the Discover map, no API key needed
- **lucide-react** — icon set
- Plain CSS with a shared token system in `src/App.css`

## UI/UX

- **Welcome splash** (`src/components/WelcomeSplash`) — shown once per
  browser session before the app loads. Features a hand-built SVG
  illustration of an Odissi dancer in Tribhangi pose
  (`src/components/OdissiDancer`) — Odissi originated in Odisha's
  temples, and Konark's own Nata Mandir (dance hall) is carved with
  dancers in this exact stance, so it's a direct link to the app's
  subject rather than a generic loading screen. Auto-continues after
  ~2.8s or on tap; respects `prefers-reduced-motion`.
- **Search** (`src/components/SearchBar`) — filters the Discover map +
  monument cards and the Passport stamp grid by name/era.
- **Login** — split hero/form layout, reusing the dancer illustration at
  rest, with icon-prefixed labeled fields and an animated tab switcher
  between login/signup.
- **Passport** — a circular progress ring leads as the hero; unlocked
  stamps get a subtle shine animation.
- **Explorer** — restructured as an explicit 4-step sequence (check in →
  explore in AR → learn → listen), since that genuinely is the order
  a visit happens in.
- Design tokens (`--shadow-card`, `--shadow-lifted`, `--gold-glow`,
  `--gradient-dusk`, `--radius-lg` in `App.css`) are shared across every
  page so card elevation and the dusk-gradient hero treatment stay
  consistent.

## Getting started

**1. Install dependencies**

```bash
npm install
```

**2. Set up environment variables**

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
- `MONGODB_URI` — from Atlas (Connect → Drivers)
- `JWT_SECRET` — any long random string, e.g. `openssl rand -hex 32`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the one seeded admin account

**3. Seed the database**

```bash
npm run seed
```

Loads the monument catalogue, builds the `2dsphere` index the geofence
check needs, and creates the admin account.

**4. Run the full stack locally**

```bash
npm run dev:full
```

Runs the Express API (`npm run server`, port 5000) and the Vite frontend
(`npm run dev`, port 5173) together — Vite proxies `/api/*` to the
Express server (see `vite.config.js`), so the app behaves as one origin.

Running `npm run dev` alone serves the frontend only; API calls will fail
until the Express server (`npm run server`) is also running.

WebAR itself (camera + GPS) needs HTTPS on a real device, so full
on-device AR testing happens once deployed. `localhost` is treated as a
secure context by browsers, so camera/GPS still work for local testing.

## Login

Both roles are required to sign in — there's no anonymous browsing:

- **Tourists** — sign up or log in from `/login`. A JWT is issued and
  stored in `localStorage`; it unlocks `/explorer` and `/passport`.
- **Admin** — go to `/admin`; if not authenticated as an admin, the same
  route shows a login form (no public signup — the one admin account is
  seeded via `scripts/seed.js` from `ADMIN_EMAIL`/`ADMIN_PASSWORD`).

## The demo loop

Sign up → see the Discover map → open Explorer → tap "Simulate arrival"
to trigger the geofence (no need to physically travel to Odisha for a
demo) → geofence unlocks → toggle the time slider between damaged and
restored → hear the audio guide (falls back to on-device text-to-speech
if no real narration file is present) → check the Passport page → see
the stamp.

## API routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/auth/register` | `POST` | — | Tourist signup |
| `/api/auth/login` | `POST` | — | Login (tourist or admin) |
| `/api/monuments` | `GET` | — | List all monuments |
| `/api/monuments/:id` | `GET` | — | One monument by slug or `_id` |
| `/api/monuments/:id/geofence-check` | `GET` | — | Server-verified proximity via `$geoNear` |
| `/api/monuments` | `POST` | admin | Add/update a monument record |
| `/api/passport/history` | `GET` | tourist/admin | This account's stamps + visits |
| `/api/passport/unlock-stamp` | `POST` | tourist/admin | Record a geofence-verified visit |
| `/api/passport/stats` | `GET` | tourist/admin | Quick counts for the Passport header |

`src/hooks/useGeofence.js` calls the geofence-check route first and
automatically falls back to computing the distance on-device (plain
Haversine) if the API isn't reachable. Same idea in `AdminPortal.jsx`:
if `POST /api/monuments` fails, the record is kept in local component
state and flagged "local only" rather than silently pretending it saved.

## Project structure

```
api/                  Express serverless backend
├── index.js          Express entry & MongoDB connection wrapper
├── config/db.js       Mongoose connection handler
├── middleware/         JWT validation
├── models/            User, Monument (Mongoose schemas)
└── routes/            auth, monuments, passport

src/
├── assets/            Local model/audio/stamp fallbacks (see their READMEs)
├── components/        One folder per self-contained UI module (+ .css)
│   └── Auth/          ProtectedRoute, LoginForm, SignupForm, UserProfileBar
├── hooks/              useAuth, useGeofence, usePassport
├── pages/              LoginPage, DiscoverPage, ExplorerPage, PassportPage, AdminPage
├── utils/api.js        fetch() wrapper that attaches the JWT
├── App.jsx             Router + protected routes
└── main.jsx             Entry point

scripts/seed.js         Loads monument data + admin account
vercel.json              Routes /api/* to the Express function in production
```

## Before you can see 3D models or hear narration

This scaffold ships **without binary assets**. A monument document's
`models.restoredUrl` / `audioGuides.<lang>` fields are empty by default,
so the frontend falls back to `src/assets/models/` and `src/assets/audio/`
by naming convention (`<slug>_<era>.glb`, `<slug>_<lang>.mp3`) — see the
`README.md` in each of those folders. Until real audio exists, the audio
guide falls back further to the device's text-to-speech, using the
narration text already seeded in `scripts/seed.js`.

## Deployment

Push to GitHub, then import the repo at [vercel.com](https://vercel.com).
Vercel auto-detects the Vite frontend; `vercel.json` routes all `/api/*`
requests to the Express app in `api/index.js` as a single serverless
function. Add `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and
`ADMIN_PASSWORD` under Settings → Environment Variables, then run
`npm run seed` once (locally, pointed at the same `MONGODB_URI`) to
populate the production database.

## What's next

Designed and fully working in an earlier build, held back for the next
round rather than rushed into this prototype:

- **Trip itinerary planner** — pick N monuments, get a nearest-neighbour
  ordered route with time estimates
- **Leaderboard** — global ranking of tourists by stamps collected
- **Admin analytics** — visit counts per monument, language distribution
- **QR-based proof-of-visit** — a signed, printable QR code posted at
  each monument as a stronger alternative to the self-reported GPS check
- **Proximity notifications** — opt-in browser alerts when nearing a monument

The architecture (Express routes, Mongoose models, React Router structure)
was built with these in mind, so re-adding them is additive, not a rewrite.
