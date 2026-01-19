# Fusion.js Logger + Bundle Splitting Demo

## What We Built
- Fusion.js app with a **custom logger plugin**
- Logs from:
  - Server middleware
  - Server-side render (SSR)
  - Client-side render
# Notes App (Frontend)

This repository is the frontend for a Notes app built with Fusion.js and React. It includes:
- Authentication (login/register/google) backed by cookie-based tokens
- Notes CRUD (list, create, update, delete)
- A small custom logger plugin at `src/plugins/logger`

Quick goals:
- Run the app locally against the backend at http://localhost:3000
- Use the logger plugin to inspect important events

---

## Prerequisites
- Node.js (14+ recommended)
- Yarn or npm
- Backend API running at `http://localhost:3000` (see backend README)

## Install

```bash
yarn install
# or: npm install
```

## Development

Start the dev server (hot reload):

```bash
yarn dev
```

Open `http://localhost:3001` in the browser (the frontend expects the backend on port 3000).

## Production build

```bash
yarn build
yarn start
```

## Environment / Backend expectations
- The frontend talks to these backend endpoints (via `src/utils/apiFetch.js`):
  - `POST /auth/login`, `POST /auth/register`, `POST /auth/google`, `POST /auth/logout`, `POST /auth/refresh`
  - `GET /api/user` — returns current user when cookies are present
  - `GET/POST/PUT/DELETE /api/notes`
- The backend must allow CORS with credentials and set cookies with appropriate SameSite flags for cross-origin testing.

## Logger plugin
- The logger plugin is at `src/plugins/logger/plugin.js` and its token is `src/plugins/logger/token.js`.
- Server middleware logs every request; the plugin also exposes a `log()` API to other modules.

## Troubleshooting (common issues)
- "Actions must be plain objects": ensure thunk middleware is registered via Fusion `EnhancerToken`. See `src/main.js` and `src/store/redux.js`.
- Empty notes or 401s on first load: the app rehydrates auth via `getUser()` and then fetches notes only after login. Confirm backend cookies are sent (check browser devtools → Network → request headers and Cookies).
- Logout flicker: the app dispatches `logout()` to clear client state — navigation is handled by callers (e.g., `src/pages/home.js`). If you see a page reload, check `src/store/auth/actions.js` for leftover reloads.

## Where to find things
- App entry: `src/main.js`
- Routes / root: `src/root.js`
- Auth actions: `src/store/auth/actions.js`
- Notes actions: `src/store/notes/actions.js`
- API helper: `src/utils/apiFetch.js`
- Logger plugin: `src/plugins/logger/plugin.js`

## Testing logs
- Open browser DevTools Console to see client-side logs. Server logs appear in the terminal running the node server.

---

If you want, I can:
- Add structured logging to more places (navigation, component mounts)
- Add a small troubleshooting script to verify backend cookies/CORS

Enjoy — tell me what you'd like logged next.
