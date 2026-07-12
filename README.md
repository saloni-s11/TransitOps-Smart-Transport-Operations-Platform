# TransitOps — Smart Transport Operations Platform

A full-stack fleet management system built for transport depots to manage vehicles, drivers, trips, maintenance, and operational costs — with role-based access control enforced at both the route and action level.

---

## Features

### Fleet Management
- Register vehicles with type, capacity, odometer, and acquisition cost
- Track real-time status: Available, On Trip, In Shop, Retired
- Automatically lock vehicles from dispatch when in shop or retired

### Driver Management
- Maintain driver profiles with license details, category, and expiry
- Safety score tracking with visual indicators
- Block suspended or expired-license drivers from trip assignment

### Trip Dispatch & Lifecycle
- Create and dispatch trips with source, destination, vehicle, driver, and cargo weight
- Capacity validation — blocks dispatch if cargo exceeds vehicle limit
- Full trip lifecycle: Draft → Dispatched → Completed / Cancelled
- Live Board for real-time trip monitoring with one-click complete/cancel
- Vehicle and driver status automatically updated at each lifecycle stage

### Maintenance Tracking
- Log service records (Oil Change, Brake Inspection, Engine Overhaul, and more)
- Vehicle automatically moved to "In Shop" when a record is logged
- Mark Complete returns the vehicle to the available pool

### Fuel & Expense Management
- Log fuel fills with liters, cost, date, and linked trip
- Track toll, parking, driver allowance, and miscellaneous expenses
- Status workflow: Pending Review → Processed / Rejected
- Live totals: fuel cost, expense cost, maintenance cost, and combined operational spend

### Reports & Analytics
- Monthly revenue chart based on completed trips (distance × base rate + cargo premium + vehicle type multiplier)
- Fleet utilization %, fuel efficiency (km/L), operational cost, and ROI KPIs
- Top costliest vehicles ranked by total operating cost
- Efficiency breakdown by fleet category (Trucks, Vans, Special)
- Per-vehicle drill-down: trips, distance, fuel efficiency, cost/km

### Role-Based Access Control (RBAC)
- Four built-in roles with distinct permission sets
- Route-level guards — unauthorized roles are silently redirected, not shown an error
- Action-level guards — buttons hide or show a lock tooltip based on permission
- Three guard modes: `hide`, `disable`, `tooltip`

---

## Role Permission Matrix

| Module | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst |
|---|:---:|:---:|:---:|:---:|
| Fleet — view | ✅ | 👁 view | — | 👁 view |
| Fleet — add / edit | ✅ | — | — | — |
| Drivers — view | ✅ | — | ✅ | — |
| Drivers — add / edit | ✅ | — | ✅ | — |
| Trips — view | — | ✅ | 👁 view | — |
| Trips — dispatch / complete / cancel | — | ✅ | — | — |
| Fuel & Expenses | — | — | — | ✅ |
| Analytics & Reports | ✅ | — | — | ✅ |
| Settings | ✅ | — | — | — |

**Legend:** ✅ full access &nbsp;·&nbsp; 👁 view only &nbsp;·&nbsp; — no access

Default landing pages after login — Fleet Manager → `/vehicles`, Dispatcher → `/trips`, Safety Officer → `/drivers`, Financial Analyst → `/fuel-expenses`.

---

## Tech Stack

**Frontend**
- React 19
- React Router v7
- Tailwind CSS v3
- Vite 8
- Supabase JS client

**Backend / Database**
- Supabase (PostgreSQL)
- Row-level security via Supabase Auth
- DB triggers for automatic status propagation (trip dispatch → vehicle/driver status, maintenance log → vehicle status)

---

## Project Structure

```
transitops/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Header.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── ProtectedAction.jsx   # RBAC wrapper component
│   │   ├── context/
│   │   │   └── AppDataContext.jsx        # Global state + Supabase calls
│   │   ├── hooks/
│   │   │   └── usePermissions.js         # Permission check hook
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx
│   │   ├── lib/
│   │   │   ├── permissions.js            # Role matrix + route guards
│   │   │   └── supabase.js
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Vehicles.jsx / AddVehicle.jsx
│   │       ├── Drivers.jsx
│   │       ├── Trips.jsx
│   │       ├── Maintenance.jsx
│   │       ├── FuelExpenses.jsx
│   │       ├── Reports.jsx
│   │       └── Settings.jsx
│   └── package.json
├── backend/
│   ├── supabase_schema.sql               # Full DB schema + triggers
│   ├── seed.mjs                          # Sample data seeder
│   └── check_trips.mjs
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Set up the database

Run `backend/supabase_schema.sql` in your Supabase SQL editor. This creates all tables, constraints, and triggers.

To seed sample data:

```bash
cd backend
node seed.mjs
```

### 2. Configure environment variables

Create `frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Login

Select a role from the login screen. The app supports a **demo mode** — if Supabase credentials aren't configured or the login fails, it falls back to demo access automatically, so you can explore the UI without a live database.

---

## Database Schema Overview

```
roles               → built-in role definitions
user_profiles       → linked to Supabase Auth users
vehicles            → fleet registry
drivers             → personnel + license + safety score
trips               → source/destination/vehicle/driver/cargo
maintenance_logs    → service records per vehicle
fuel_logs           → fuel fills linked to vehicle + optional trip
expenses            → toll, parking, misc per vehicle + optional trip
```

**Key DB triggers:**
- `trigger_update_trip_status` — when a trip is dispatched, completed, or cancelled, automatically flips vehicle and driver status
- `trigger_handle_maintenance_status` — when a maintenance log is created or completed, flips vehicle to In Shop / Available

---

## RBAC Implementation

Permission checking is layered at two levels:

**Route level** (`App.jsx`)  
Every protected route is wrapped in `<RequirePermission>`, which checks `canAccessRoute(role, path)` and redirects unauthorized users to their default landing page.

**Action level** (`ProtectedAction.jsx`)  
Wrap any button or interactive element:

```jsx
<ProtectedAction permission={PERMISSIONS.ADD_VEHICLE} mode="hide">
  <button>Add Vehicle</button>
</ProtectedAction>

<ProtectedAction permission={PERMISSIONS.DISPATCH_TRIP} mode="tooltip">
  <button>Dispatch</button>
</ProtectedAction>
```

Modes:
- `hide` — element is removed from the DOM entirely
- `disable` — element is visible but greyed out and non-interactive
- `tooltip` — element is visible with a lock icon tooltip explaining the restriction

Check permissions in component logic with the `usePermissions` hook:

```js
const { can, canAny, role, isFleetManager } = usePermissions();

if (can(PERMISSIONS.EDIT_VEHICLE)) { /* ... */ }
```

---

## Available Scripts

```bash
# Frontend
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run oxlint

# Backend
node seed.mjs      # Seed the database with sample data
```
