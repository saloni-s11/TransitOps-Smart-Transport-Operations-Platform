// Custom hook for checking user permissions in components
import { useAppData } from '../context/AppDataContext';
import { hasPermission, hasAnyPermission, hasAllPermissions, canAccessRoute, getUnauthorizedMessage } from '../lib/permissions';

/**
 * Hook for checking user permissions in components
 * @returns {Object} Permission checking functions
 */
export function usePermissions() {
  const { role } = useAppData();

  return {
    /**
     * Check if current user has a specific permission
     * @param {string} permission - Permission to check
     * @returns {boolean}
     */
    can: (permission) => hasPermission(role, permission),

    /**
     * Check if current user has any of the specified permissions
     * @param {string[]} permissions - Array of permissions
     * @returns {boolean}
     */
    canAny: (permissions) => hasAnyPermission(role, permissions),

    /**
     * Check if current user has all of the specified permissions
     * @param {string[]} permissions - Array of permissions
     * @returns {boolean}
     */
    canAll: (permissions) => hasAllPermissions(role, permissions),

    /**
     * Check if current user can access a route
     * @param {string} route - Route path
     * @returns {boolean}
     */
    canAccessRoute: (route) => canAccessRoute(role, route),

    /**
     * Get unauthorized message for current role
     * @param {string} action - Action attempted (optional)
     * @returns {string}
     */
    getUnauthorizedMessage: (action) => getUnauthorizedMessage(role, action),

    /**
     * Current user role
     */
    role,

    /**
     * Check if user is Fleet Manager (super admin)
     */
    isFleetManager: role === 'Fleet Manager',

    /**
     * Check if user is Dispatcher
     */
    isDispatcher: role === 'Dispatcher',

    /**
     * Check if user is Safety Officer
     */
    isSafetyOfficer: role === 'Safety Officer',

    /**
     * Check if user is Financial Analyst
     */
    isFinancialAnalyst: role === 'Financial Analyst'
  };
}
