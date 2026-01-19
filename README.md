# Fusion.js Logger + Bundle Splitting Demo

## What We Built
- Fusion.js app with a **custom logger plugin**
- Logs from:
  - Server middleware
  - Server-side render (SSR)
  - Client-side render
- Demonstrates **code splitting**
  - Route-level (`/about`)
  - Component-level (lazy components via buttons)

---
---

## Run Commands

### Development
```bash
yarn dev
```

### Production
```bash
yarn build-production
yarn start
```
---
---

## Log Behavior
### Server Middleware (every HTTP Request)
```bash
[SERVER-MW] Request for: /
[SERVER-MW] Request for: /about
[SERVER-MW] Request for: /_static/client-xxx.js
```
### Server-Side 
```bash
[SERVER] Home SSR render
[SERVER] About SSR render
```
### Client-Side
```bash
[SERVER] Home SSR render
[SERVER] About SSR render
```

## Bundle download behaviour
### Initial Page Load
```bash
/_static/client-main-xxxx.js
/_static/client-runtime-xxxx.js
```
### Lazy Component (button click)
```bash
/_static/client-src_components_lazyBoxA_js.js
```
### Route Navigation (`/about`)
```bash
/_static/client-src_pages_about_js.js
```
---
---

## Dev vs Prod

### `yarn dev`
- Hot reload enabled
- Bundles may re-download
- Multiple SSR logs possible

### `yarn build && yarn start`
- Stable bundle names
- Bundles downloaded once
- SSR only on refresh or direct URL hit

## Key Points
- Token = dependency contract
- Plugin = implementation
- SSR happens only on server requests
- Client navigation does NOT trigger SSR
- Code splitting verified via Network tab
