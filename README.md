# TransitOps — Fleet Operations Platform

A single, integrated React app built by merging the independent screens exported from
Google Stitch into one working application, per the integration plan below.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. You'll land on the **Login** screen — pick a role and
sign in with any email/password to enter the app.

## What was done

**Integration plan (executed):**
1. Inventoried all 9 Stitch screens (`authentication_rbac`/`transitops_fleet_management_system`
   were an identical duplicate login screen — the duplicate was dropped).
2. Confirmed all screens shared one Tailwind design-token set (colors, spacing, fonts,
   font sizes) — merged into a single `tailwind.config.js` instead of per-page duplicates.
3. Extracted the shared Header and Sidebar markup (present on every authenticated screen)
   into `src/components/common/Header.jsx` and `Sidebar.jsx`, wired into one
   `src/layouts/AppLayout.jsx` used by every route.
4. Set up `react-router-dom` with the routes: `/login`, `/dashboard`, `/vehicles`,
   `/drivers`, `/trips`, `/maintenance`, `/fuel-expenses`, `/reports`, `/settings`.
   Sidebar links use `NavLink` so the active page highlights correctly, and unauthenticated
   visits to any authenticated route redirect to `/login`.
5. Converted each screen's unique HTML body into a JSX page component in `src/pages/`,
   preserving the original Tailwind classes, layout, copy, and visual design as generated —
   no redesign.
6. Added `src/context/AppDataContext.jsx`, a Context-API store standing in for the Supabase
   backend described in `supabase_schema.txt`, seeded from `src/data/mockData.js` with
   vehicles, drivers, trips, maintenance logs, fuel logs, and expenses. It exposes actions
   (`dispatchTrip`, `completeTrip`, `addVehicle`, `addDriver`, `addMaintenanceLog`, etc.),
   including the dispatch validation rule from the schema notes (vehicle/driver must be
   available, license not expired, cargo ≤ capacity).
7. Wired the Login screen to real state: role selection and sign-in call
   `AppDataContext.signIn`, after which the layout guard lets you into the app; Logout in
   the sidebar calls `signOut` and returns you to `/login`.
8. Removed the unused default Vite/React starter assets and the duplicate login screen.

## Where it stands / good next steps

- The Login flow, routing, shared layout, sidebar navigation, and the global mock-data
  store are fully live.
- The Dashboard, Vehicles, Drivers, Trips, Maintenance, Fuel & Expenses, Reports, and
  Settings pages currently render the original Stitch-generated markup as static content,
  matching the approved visual design exactly. Their numbers/tables are the illustrative
  data Stitch shipped with, not yet read from `AppDataContext`.
- Natural next increment: swap each page's static tables/KPIs for the equivalent data in
  `AppDataContext` (e.g. Vehicle Registry's table → `vehicles`, Trip Dispatcher's dispatch
  form → `dispatchTrip(...)`), one page at a time, without touching any markup/styling.

## Structure

```
src/
  components/common/ Header.jsx, Sidebar.jsx
  layouts/           AppLayout.jsx
  pages/             Login, Dashboard, Vehicles, Drivers, Trips, Maintenance,
                     FuelExpenses, Reports, Settings
  context/           AppDataContext.jsx
  data/              mockData.js
  App.jsx            routes
  main.jsx           entry point
```
