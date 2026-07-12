# TransitOps Role Permissions Reference

## Quick Reference Guide

### 1. Fleet Manager
**Permissions**: MANAGE_VEHICLES, MANAGE_MAINTENANCE, VIEW_DRIVERS, VIEW_REPORTS, MANAGE_SETTINGS

**Can Access**:
- ✅ Dashboard
- ✅ Fleet (Manage)
- ✅ Drivers (View only)
- ✅ Maintenance (Manage)
- ✅ Analytics/Reports
- ✅ Settings

**Cannot Access**:
- 🔒 Trips (no permission)
- 🔒 Fuel & Expenses (no manage/view permission)

---

### 2. Dispatcher
**Permissions**: VIEW_VEHICLES, VIEW_DRIVERS, MANAGE_TRIPS

**Can Access**:
- ✅ Dashboard
- ✅ Fleet (View only)
- ✅ Drivers (View only)
- ✅ Trips (Manage)

**Cannot Access**:
- 🔒 Maintenance
- 🔒 Fuel & Expenses
- 🔒 Analytics/Reports
- 🔒 Settings

---

### 3. Safety Officer
**Permissions**: MANAGE_DRIVERS, VIEW_TRIPS, VIEW_VEHICLES

**Can Access**:
- ✅ Dashboard
- ✅ Fleet (View only)
- ✅ Drivers (Manage)
- ✅ Trips (View only)

**Cannot Access**:
- 🔒 Maintenance
- 🔒 Fuel & Expenses
- 🔒 Analytics/Reports
- 🔒 Settings

---

### 4. Financial Analyst
**Permissions**: VIEW_VEHICLES, MANAGE_FUEL_EXPENSES, VIEW_REPORTS

**Can Access**:
- ✅ Dashboard
- ✅ Fleet (View only)
- ✅ Maintenance (View only)
- ✅ Fuel & Expenses (Manage)
- ✅ Analytics/Reports

**Cannot Access**:
- 🔒 Drivers
- 🔒 Trips
- 🔒 Settings

---

## How Sidebar Works

### All Users See:
1. Dashboard
2. Fleet
3. Drivers
4. Trips
5. Maintenance
6. Fuel & Expenses
7. Analytics
8. Settings
9. Support (always accessible)

### Visual Indicators:
- **Normal appearance** = User has access
- **Dimmed (50% opacity)** = User doesn't have access
- **Lock icon 🔒** = Restricted page
- **Tooltip on hover** = "You don't have permission to access this page"

### Click Behavior:
- **Accessible pages**: Normal navigation
- **Restricted pages**: Click is prevented, no navigation occurs

### URL Direct Access:
Even if a user types a restricted URL directly:
- They are automatically redirected to their role's default page
- Fleet Manager → `/vehicles`
- Dispatcher → `/trips`
- Safety Officer → `/drivers`
- Financial Analyst → `/fuel-expenses`

---

## Permission Hierarchy

### Manage vs View:
- **MANAGE_X**: Full CRUD operations (Create, Read, Update, Delete)
- **VIEW_X**: Read-only access

### Example:
- Fleet Manager has `MANAGE_VEHICLES` → Can add, edit, delete vehicles
- Dispatcher has `VIEW_VEHICLES` → Can only see vehicle list, no editing

---

## Implementation Files

1. **Sidebar Component**: `frontend/src/components/common/Sidebar.jsx`
   - Shows all items
   - Adds visual indicators for restricted items
   - Prevents clicks on restricted items

2. **Permissions Library**: `frontend/src/lib/permissions.js`
   - Defines all roles and permissions
   - Maps roles to permissions
   - Provides utility functions

3. **Route Protection**: `frontend/src/App.jsx`
   - `RequirePermission` component wraps each route
   - Redirects unauthorized access attempts

4. **Permission Hook**: `frontend/src/hooks/usePermissions.js`
   - React hook for checking permissions in components
   - Provides `can()`, `canAny()`, `canAll()` functions

---

## Testing Checklist

### For Each Role:
- [ ] Log in as the role
- [ ] Verify correct sidebar items are dimmed/locked
- [ ] Verify accessible items are clickable
- [ ] Try clicking locked items (should not navigate)
- [ ] Try typing restricted URLs (should redirect)
- [ ] Verify tooltips appear on hover
- [ ] Check that dashboard KPIs match role permissions
- [ ] Verify action buttons respect permissions (add, edit, delete)

### Cross-Role Testing:
- [ ] Log in as each role sequentially
- [ ] Verify sidebar updates correctly
- [ ] Verify default landing pages are correct
- [ ] Test logout and re-login flows

---

## Troubleshooting

### Issue: All pages are locked
**Cause**: User role not set correctly
**Fix**: Check `AppDataContext` for proper role assignment

### Issue: Pages not redirecting
**Cause**: `RequirePermission` not wrapping routes
**Fix**: Verify all routes in App.jsx have `<RequirePermission>` wrapper

### Issue: Lock icons not showing
**Cause**: Permission check not working
**Fix**: Verify `usePermissions()` hook is properly imported and used

### Issue: User can access restricted page via URL
**Cause**: Route protection not working
**Fix**: Check `canAccessRoute()` function in permissions.js
