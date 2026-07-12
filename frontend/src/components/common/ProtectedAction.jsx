// Component wrapper to protect actions based on user permissions
import { usePermissions } from '../../hooks/usePermissions';
import { useState } from 'react';

/**
 * Wraps interactive elements to enforce permission checking
 * Hides, disables, or shows tooltip based on permission
 * 
 * @param {string|string[]} permission - Required permission(s)
 * @param {string} mode - How to handle unauthorized: 'hide', 'disable', 'tooltip' (default: 'hide')
 * @param {ReactNode} children - Child elements to protect
 * @param {ReactNode} fallback - Optional fallback content when unauthorized
 * @param {function} onUnauthorized - Optional callback when unauthorized action attempted
 */
export function ProtectedAction({ 
  permission, 
  mode = 'hide', 
  children, 
  fallback = null,
  onUnauthorized 
}) {
  const { can, canAny, getUnauthorizedMessage } = usePermissions();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Check permission(s)
  const hasPermission = Array.isArray(permission) 
    ? canAny(permission) 
    : can(permission);

  // If user has permission, render children normally
  if (hasPermission) {
    return <>{children}</>;
  }

  // Handle unauthorized based on mode
  switch (mode) {
    case 'hide':
      // Hide element completely, show fallback if provided
      return fallback ? <>{fallback}</> : null;

    case 'disable':
      // Disable the element but keep it visible
      return (
        <div className="relative inline-block">
          <div 
            className="opacity-50 cursor-not-allowed pointer-events-none"
            title={getUnauthorizedMessage()}
          >
            {children}
          </div>
        </div>
      );

    case 'tooltip':
      // Show element with tooltip explaining why it's blocked
      return (
        <div className="relative inline-block">
          <div
            className="cursor-not-allowed"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onUnauthorized) {
                onUnauthorized(getUnauthorizedMessage());
              }
            }}
          >
            <div className="opacity-50 pointer-events-none">
              {children}
            </div>
          </div>
          {showTooltip && (
            <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-inverse-surface text-inverse-on-surface text-xs rounded-lg shadow-lg whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                {getUnauthorizedMessage()}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-inverse-surface"></div>
              </div>
            </div>
          )}
        </div>
      );

    default:
      return fallback ? <>{fallback}</> : null;
  }
}

/**
 * Higher-order component to protect entire components/pages
 */
export function withPermission(Component, permission, fallback) {
  return function ProtectedComponent(props) {
    const { can, canAny } = usePermissions();
    
    const hasPermission = Array.isArray(permission) 
      ? canAny(permission) 
      : can(permission);

    if (!hasPermission) {
      return fallback || (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
          <span className="material-symbols-outlined text-[64px] text-secondary opacity-20 mb-4">
            lock
          </span>
          <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
            Access Restricted
          </h2>
          <p className="text-body-md text-secondary max-w-md">
            You don't have permission to access this page. Contact your administrator if you need access.
          </p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Protected button component with built-in permission check
 */
export function ProtectedButton({ 
  permission, 
  onClick, 
  children, 
  className = '',
  mode = 'disable',
  ...props 
}) {
  const { can, canAny, getUnauthorizedMessage } = usePermissions();
  
  const hasPermission = Array.isArray(permission) 
    ? canAny(permission) 
    : can(permission);

  const handleClick = (e) => {
    if (!hasPermission) {
      e.preventDefault();
      alert(getUnauthorizedMessage());
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!hasPermission && mode === 'disable'}
      title={!hasPermission ? getUnauthorizedMessage() : ''}
      className={`${className} ${!hasPermission ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
