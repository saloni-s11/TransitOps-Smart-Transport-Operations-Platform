// TransitOps Role-Based Access Control (RBAC) System
// Defines permissions for each role across all modules

export const ROLES = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst'
};

export const PERMISSIONS = {
  // Vehicle Management
  VIEW_VEHICLES: 'view_vehicles',
  ADD_VEHICLE: 'add_vehicle',
  EDIT_VEHICLE: 'edit_vehicle',
  DELETE_VEHICLE: 'delete_vehicle',

  // Driver Management
  VIEW_DRIVERS: 'view_drivers',
  ADD_DRIVER: 'add_driver',
  EDIT_DRIVER: 'edit_driver',
  DELETE_DRIVER: 'delete_driver',

  // Trip Management
  VIEW_TRIPS: 'view_trips',
  CREATE_TRIP: 'create_trip',
  DISPATCH_TRIP: 'dispatch_trip',
  COMPLETE_TRIP: 'complete_trip',
  CANCEL_TRIP: 'cancel_trip',

  // Maintenance
  VIEW_MAINTENANCE: 'view_maintenance',
  ADD_MAINTENANCE: 'add_maintenance',
  COMPLETE_MAINTENANCE: 'complete_maintenance',

  // Fuel & Expenses
  VIEW_FUEL_EXPENSES: 'view_fuel_expenses',
  ADD_FUEL_LOG: 'add_fuel_log',
  EDIT_FUEL_LOG: 'edit_fuel_log',
  ADD_EXPENSE: 'add_expense',
  EDIT_EXPENSE: 'edit_expense',

  // Analytics & Reports
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',

  // Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',
};

// Role Permission Matrix
const ROLE_PERMISSIONS = {
  [ROLES.FLEET_MANAGER]: [
    // Full access to everything
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.ADD_VEHICLE,
    PERMISSIONS.EDIT_VEHICLE,
    PERMISSIONS.DELETE_VEHICLE,
    PERMISSIONS.VIEW_DRIVERS,
    PERMISSIONS.ADD_DRIVER,
    PERMISSIONS.EDIT_DRIVER,
    PERMISSIONS.DELETE_DRIVER,
    PERMISSIONS.VIEW_TRIPS,
    PERMISSIONS.CREATE_TRIP,
    PERMISSIONS.DISPATCH_TRIP,
    PERMISSIONS.COMPLETE_TRIP,
    PERMISSIONS.CANCEL_TRIP,
    PERMISSIONS.VIEW_MAINTENANCE,
    PERMISSIONS.ADD_MAINTENANCE,
    PERMISSIONS.COMPLETE_MAINTENANCE,
    PERMISSIONS.VIEW_FUEL_EXPENSES,
    PERMISSIONS.ADD_FUEL_LOG,
    PERMISSIONS.EDIT_FUEL_LOG,
    PERMISSIONS.ADD_EXPENSE,
    PERMISSIONS.EDIT_EXPENSE,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.EDIT_SETTINGS,
  ],

  [ROLES.DISPATCHER]: [
    // Trip management + dashboard
    PERMISSIONS.VIEW_TRIPS,
    PERMISSIONS.CREATE_TRIP,
    PERMISSIONS.DISPATCH_TRIP,
    PERMISSIONS.COMPLETE_TRIP,
    PERMISSIONS.CANCEL_TRIP,
  ],

  [ROLES.SAFETY_OFFICER]: [
    // View-only access to fleet, drivers, trips, maintenance
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_DRIVERS,
    PERMISSIONS.VIEW_TRIPS,
    PERMISSIONS.VIEW_MAINTENANCE,
  ],

  [ROLES.FINANCIAL_ANALYST]: [
    // Financial data and analytics
    PERMISSIONS.VIEW_FUEL_EXPENSES,
    PERMISSIONS.ADD_FUEL_LOG,
    PERMISSIONS.EDIT_FUEL_LOG,
    PERMISSIONS.ADD_EXPENSE,
    PERMISSIONS.EDIT_EXPENSE,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role, permission) {
  if (!role || !permission) return false;
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role, permissions) {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role, permissions) {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a specific role
 */
export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Returns the default redirect path for a given role.
 * Used by route guards when a user tries to access a page they can't access.
 */
export function getDefaultRoute(role) {
  switch (role) {
    case ROLES.FLEET_MANAGER:   return '/dashboard';
    case ROLES.DISPATCHER:      return '/trips';
    case ROLES.SAFETY_OFFICER:  return '/vehicles';
    case ROLES.FINANCIAL_ANALYST: return '/fuel-expenses';
    default:                    return '/login';
  }
}

/**
 * Maps each route to the permission(s) required to access it.
 * Returns true if no specific permission is required.
 */
export function canAccessRoute(role, route) {
  const routePermissions = {
    '/dashboard':      [PERMISSIONS.VIEW_TRIPS, PERMISSIONS.VIEW_VEHICLES, PERMISSIONS.VIEW_DRIVERS],
    '/vehicles':       [PERMISSIONS.VIEW_VEHICLES],
    '/vehicles/add':   [PERMISSIONS.ADD_VEHICLE],
    '/drivers':        [PERMISSIONS.VIEW_DRIVERS],
    '/trips':          [PERMISSIONS.VIEW_TRIPS],
    '/maintenance':    [PERMISSIONS.VIEW_MAINTENANCE],
    '/fuel-expenses':  [PERMISSIONS.VIEW_FUEL_EXPENSES],
    '/reports':        [PERMISSIONS.VIEW_REPORTS],
    '/settings':       [PERMISSIONS.VIEW_SETTINGS],
  };

  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) return true;
  return hasAnyPermission(role, requiredPermissions);
}

/**
 * Get user-friendly error message for unauthorized action
 */
export function getUnauthorizedMessage(role, action) {
  const messages = {
    [ROLES.DISPATCHER]:        'Dispatchers can only manage trips. Contact your Fleet Manager for other operations.',
    [ROLES.SAFETY_OFFICER]:    'Safety Officers have view-only access. Contact your Fleet Manager to make changes.',
    [ROLES.FINANCIAL_ANALYST]: 'Financial Analysts can only manage fuel logs and expenses. Contact your Fleet Manager for other operations.',
  };

  return messages[role] || 'You do not have permission to perform this action. Contact your administrator.';
}
