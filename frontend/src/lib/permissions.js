// TransitOps Role-Based Access Control (RBAC) System
// Simplified implementation based on official requirements

export const ROLES = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst'
};

export const PERMISSIONS = {
  // Module-level access (simplified)
  MANAGE_VEHICLES: 'manage_vehicles',
  VIEW_VEHICLES: 'view_vehicles',
  
  MANAGE_DRIVERS: 'manage_drivers',
  VIEW_DRIVERS: 'view_drivers',
  
  MANAGE_TRIPS: 'manage_trips',
  VIEW_TRIPS: 'view_trips',
  
  MANAGE_MAINTENANCE: 'manage_maintenance',
  VIEW_MAINTENANCE: 'view_maintenance',
  
  MANAGE_FUEL_EXPENSES: 'manage_fuel_expenses',
  VIEW_FUEL_EXPENSES: 'view_fuel_expenses',
  
  VIEW_REPORTS: 'view_reports',
  MANAGE_SETTINGS: 'manage_settings',
};

// Role Permission Matrix (Simplified per document)
const ROLE_PERMISSIONS = {
  // Fleet Manager: Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency
  [ROLES.FLEET_MANAGER]: [
    PERMISSIONS.MANAGE_VEHICLES,
    PERMISSIONS.MANAGE_MAINTENANCE,
    PERMISSIONS.VIEW_DRIVERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_SETTINGS,
  ],

  // Dispatcher: Creates trips, assigns vehicles and drivers, and monitors active deliveries
  [ROLES.DISPATCHER]: [
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_DRIVERS,
    PERMISSIONS.MANAGE_TRIPS,
  ],

  // Safety Officer: Ensures driver compliance, tracks license validity, and monitors safety scores
  [ROLES.SAFETY_OFFICER]: [
    PERMISSIONS.MANAGE_DRIVERS,
    PERMISSIONS.VIEW_TRIPS,
    PERMISSIONS.VIEW_VEHICLES,
  ],

  // Financial Analyst: Reviews operational expenses, fuel consumption, maintenance costs, and profitability
  [ROLES.FINANCIAL_ANALYST]: [
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_MAINTENANCE,
    PERMISSIONS.MANAGE_FUEL_EXPENSES,
    PERMISSIONS.VIEW_REPORTS,
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
 */
export function getDefaultRoute(role) {
  switch (role) {
    case ROLES.FLEET_MANAGER:     return '/vehicles';
    case ROLES.DISPATCHER:        return '/trips';
    case ROLES.SAFETY_OFFICER:    return '/drivers';
    case ROLES.FINANCIAL_ANALYST: return '/fuel-expenses';
    default:                      return '/login';
  }
}

/**
 * Maps each route to the permission(s) required to access it.
 */
export function canAccessRoute(role, route) {
  const routePermissions = {
    '/dashboard':      [PERMISSIONS.MANAGE_VEHICLES, PERMISSIONS.VIEW_VEHICLES, PERMISSIONS.MANAGE_TRIPS, PERMISSIONS.MANAGE_FUEL_EXPENSES],
    '/vehicles':       [PERMISSIONS.MANAGE_VEHICLES, PERMISSIONS.VIEW_VEHICLES],
    '/vehicles/add':   [PERMISSIONS.MANAGE_VEHICLES],
    '/drivers':        [PERMISSIONS.MANAGE_DRIVERS, PERMISSIONS.VIEW_DRIVERS],
    '/drivers/add':    [PERMISSIONS.MANAGE_DRIVERS],
    '/trips':          [PERMISSIONS.MANAGE_TRIPS, PERMISSIONS.VIEW_TRIPS],
    '/maintenance':    [PERMISSIONS.MANAGE_MAINTENANCE, PERMISSIONS.VIEW_MAINTENANCE],
    '/fuel-expenses':  [PERMISSIONS.MANAGE_FUEL_EXPENSES, PERMISSIONS.VIEW_FUEL_EXPENSES],
    '/reports':        [PERMISSIONS.VIEW_REPORTS],
    '/settings':       [PERMISSIONS.MANAGE_SETTINGS],
  };

  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) return true; // Support page, etc
  return hasAnyPermission(role, requiredPermissions);
}

/**
 * Get user-friendly error message for unauthorized action
 */
export function getUnauthorizedMessage(role, action) {
  const messages = {
    [ROLES.FLEET_MANAGER]:     'Fleet Managers oversee fleet assets, maintenance, vehicle lifecycle, and operational efficiency.',
    [ROLES.DISPATCHER]:        'Dispatchers create trips, assign vehicles and drivers, and monitor active deliveries.',
    [ROLES.SAFETY_OFFICER]:    'Safety Officers ensure driver compliance, track license validity, and monitor safety scores.',
    [ROLES.FINANCIAL_ANALYST]: 'Financial Analysts review operational expenses, fuel consumption, maintenance costs, and profitability.',
  };

  return messages[role] || 'You do not have permission to perform this action.';
}
