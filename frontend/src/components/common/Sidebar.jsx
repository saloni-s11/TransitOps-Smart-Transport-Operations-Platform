import { NavLink, useNavigate } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext";
import { usePermissions } from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../lib/permissions";

const NAV_ITEMS = [
  { 
    to: "/dashboard", 
    label: "Dashboard", 
    icon: "dashboard",
    permission: PERMISSIONS.VIEW_VEHICLES
  },
  { 
    to: "/vehicles", 
    label: "Fleet", 
    icon: "local_shipping",
    permission: PERMISSIONS.VIEW_VEHICLES
  },
  { 
    to: "/drivers", 
    label: "Drivers", 
    icon: "badge",
    permission: PERMISSIONS.VIEW_DRIVERS
  },
  { 
    to: "/trips", 
    label: "Trips", 
    icon: "route",
    permission: PERMISSIONS.VIEW_TRIPS
  },
  { 
    to: "/maintenance", 
    label: "Maintenance", 
    icon: "build",
    permission: PERMISSIONS.VIEW_MAINTENANCE
  },
  { 
    to: "/fuel-expenses", 
    label: "Fuel & Expenses", 
    icon: "local_gas_station",
    permission: PERMISSIONS.VIEW_FUEL_EXPENSES
  },
  { 
    to: "/reports", 
    label: "Analytics", 
    icon: "analytics",
    permission: PERMISSIONS.VIEW_REPORTS
  },
  { 
    to: "/settings", 
    label: "Settings", 
    icon: "settings",
    permission: PERMISSIONS.VIEW_SETTINGS
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { signOut, role, user } = useAppData();
  const { can } = usePermissions();

  // Filter navigation items based on user permissions
  const visibleNavItems = NAV_ITEMS.filter(item => {
    // Show item if no permission required or user has the permission
    return !item.permission || can(item.permission);
  });

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-sidebar_width z-40 flex flex-col pt-header_height bg-white border-r border-outline-variant overflow-hidden">
      <div className="px-4 py-6 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
          </div>
          <div>
            <h2 className="text-headline-md font-headline-md font-black text-on-surface leading-tight">TransitOps</h2>
            <p className="text-label-caps font-label-caps text-secondary">Smart Operations</p>
          </div>
        </div>
        {/* User Role Badge */}
        <div className="px-2 mb-6">
          <div className="bg-primary-container/20 border border-primary-container rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[16px]">person</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-secondary font-medium uppercase tracking-wide">{role}</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="space-y-1">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all text-body-md font-body-md group ${
                  isActive ? "sidebar-active" : "text-secondary hover:bg-surface-container-low"
                }`
              }
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-outline-variant bg-surface-container-lowest">
        <nav className="space-y-1">
          <NavLink
            to="/support"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-body-md font-body-md ${
                isActive ? "sidebar-active" : "text-secondary hover:bg-surface-container-low"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">contact_support</span>
            Support
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full text-left text-error hover:bg-error-container flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-body-md font-body-md"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}
