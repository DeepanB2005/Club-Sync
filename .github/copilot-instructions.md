# GitHub Copilot Instructions for Club-events

These guidelines are for AI coding agents (GPT-5.1) working in this repo.
Focus on preserving existing patterns and flows in the MERN + Vite/Capacitor stack.

## Project Overview
- Full-stack MERN college club & event management system.
- Backend: Express + Mongoose in [bc](bc) (REST API, Google OAuth, MongoDB).
- Web frontend: React + Vite + Tailwind in [fr](fr).
- Mobile app: React + Vite + Ionic/Capacitor clone of the web UI in [fr/mobileApp](fr/mobileApp).

## Backend (bc) Architecture & Conventions
- Entry point: [bc/server.js](bc/server.js).
  - Connects to Mongo via `connectDB()` from [bc/db.js](bc/db.js).
  - CORS is **whitelist-based**: only
    - `https://club-events.vercel.app`
    - `http://localhost:5173`
    - `http://127.0.0.1:5173`
    - `http://localhost:8100`
    Add new origins **only** by extending this list.
  - JSON body size is limited to `10mb`; keep payloads small (e.g. images as compressed base64 or URLs).
- Auth:
  - Google OAuth handled at `POST /api/auth/google` in [bc/server.js](bc/server.js) using `google-auth-library` and `REACT_APP_GOOGLE_CLIENT_ID` env var.
  - Custom email/password auth lives in [bc/routes/users.js](bc/routes/users.js) (`/api/users/login`, signup at `/api/users`).
  - Passwords are currently stored in plain text; **do not introduce hashing only in one route** — if you change this, update **all** auth flows and callers.
- API route structure (mounted in [bc/server.js](bc/server.js)):
  - `/api/users` → [bc/routes/users.js](bc/routes/users.js)
    - Uses `User` model from [bc/models/User.js](bc/models/User.js).
    - Normalizes: `email.toLowerCase()`, `rollNo.toUpperCase()`, `gender.toLowerCase()`.
    - Provides role-based queries like `/students` and a redundant `/api/users` path inside the router (keep behaviour compatible if you refactor).
  - `/api/clubs` → [bc/routes/clubs.js](bc/routes/clubs.js)
    - Uses `Club` and `JoinRequest` models; populates `members`, `leader`, and `events` where relevant.
    - Join/membership flows rely on `JoinRequest` and explicit `members` array updates.
    - Update endpoints support both `PUT` (full) and `PATCH` (partial) with duplicate-name checks.
  - `/api/events` → [bc/routes/events.js](bc/routes/events.js)
    - Uses `Event` model; enforces required `title`, `date`, `club` fields.
    - `PATCH /:eventId` builds an `updateFields` object and uses `$set`, then repopulates `club`.
  - `/api/join-requests` → [bc/routes/joinRequests.js](bc/routes/joinRequests.js) (handles approval/decline; follow existing status values like `pending`).
- Error handling pattern:
  - Most routes wrap logic in `try/catch` and respond with `res.status(4xx/5xx).json({ error: message })`.
  - Validation and duplicate-key errors are explicitly handled in user/club routes; copy these patterns for new write endpoints.

### Backend Workflows
- Install deps (backend only):
  - `cd bc && npm install`
- Local dev server:
  - `npm run dev` (uses `nodemon server.js`, default port `5000`).
- Environment:
  - Define at least `MONGODB_URI` (see [bc/db.js](bc/db.js)) and `REACT_APP_GOOGLE_CLIENT_ID` for Google OAuth.
  - Do **not** hardcode secrets in source files.

## Web Frontend (fr) Architecture & Conventions
- Tooling: React 19 + Vite 6 + Tailwind CSS + React Router.
- Entry points:
  - Vite HTML shell: [fr/index.html](fr/index.html).
  - React bootstrap: [fr/src/main.jsx](fr/src/main.jsx).
  - Top-level routing: [fr/src/App.jsx](fr/src/App.jsx) with routes for `/`, `/Login`, `/Dashboard`.
- UI structure:
  - Global pages in [fr/src/pages](fr/src/pages) (`Home.jsx`, `Login.jsx`, `Dashboard.jsx`).
  - Reusable components in [fr/src/components](fr/src/components):
    - `home/*` for landing sections (hero, navbar, events, clubs, carousel, search, activities).
    - `forms/*` for `LoginForm`, `SignupForm`, `googleOauth` (use these instead of duplicating auth UIs).
    - `Dashboard/*` for admin/leader/student dashboard layout (`Sidebar`, `dashboard`, `Manageclubs`, `Manageusers`, `student/*`).
  - Use these directories when adding new UI rather than creating parallel trees.
- Styling:
  - Tailwind-based utility classes; global config in [fr/tailwind.config.js](fr/tailwind.config.js) and [fr/postcss.config.cjs](fr/postcss.config.cjs).
  - Prefer extending Tailwind config or adding small utilities in [fr/src/index.css](fr/src/index.css) over large custom CSS files.
- Routing & navigation:
  - Always use `react-router-dom` for navigation (e.g. `useNavigate`, `<Link>`).
  - Keep route paths and dashboard navigation in sync between `App.jsx` and sidebar/menu components.
- API integration:
  - Frontend talks to backend base URL `http://localhost:5000` in dev and the deployed API in prod; reuse existing helpers (search in `src` for `5000` or `/api/`).
  - When adding endpoints, follow existing patterns for JSON bodies and error handling (expect `{ error: string }`).

### Web Frontend Workflows
- Install deps:
  - `cd fr && npm install`
- Dev server (default port 5173):
  - `npm run dev`
- Build & preview:
  - `npm run build`
  - `npm run preview`
- Linting:
  - `npm run lint` (ESLint 9 with React hooks/refresh plugins; keep new code lint-clean).

## Mobile App (fr/mobileApp) Patterns
- Structure largely mirrors the web frontend:
  - Entry: [fr/mobileApp/src/main.jsx](fr/mobileApp/src/main.jsx) and [fr/mobileApp/src/App.jsx](fr/mobileApp/src/App.jsx).
  - Pages and components under `src/pages`, `src/components/home`, `src/components/forms`, `src/components/Dashboard` follow the same names as the web app.
- Capacitor/Ionic:
  - Config in [fr/mobileApp/capacitor.config.ts](fr/mobileApp/capacitor.config.ts) and [fr/mobileApp/ionic.config.json](fr/mobileApp/ionic.config.json).
  - Android-specific files live under [fr/mobileApp/android](fr/mobileApp/android).
- Mobile workflows:
  - From [fr](fr): use Capacitor CLI scripts (e.g. `npx cap copy`) targeting the `mobileApp` project; keep web build paths consistent when changing output.

## Cross-cutting Guidelines for AI Agents
- Keep backend and frontend contracts in sync: whenever you change a request/response shape in `bc/routes/*`, update all React and mobile callers.
- Reuse existing models, routes, and components; avoid creating "almost duplicates" with slightly different naming.
- Follow existing naming conventions:
  - `rollNo` uppercase, `email` lowercase, `gender` lowercase.
  - Club/event relationships via Mongo ObjectId refs (`club`, `events`, `members`, `leader`).
- Before adding new libraries, check if an equivalent is already used (e.g. framer-motion, lucide-react, react-icons).
- When unsure where to place new code:
  - Backend: new business logic usually belongs in a route handler using Mongoose models in [bc/models](bc/models).
  - Web/mobile: new views go in `pages`, shared UI and logic in `components` under the most specific subfolder.

If any part of this feels incomplete (e.g. missing scripts you rely on or deployment details), tell me which workflow or area you want clarified and I’ll refine these instructions.