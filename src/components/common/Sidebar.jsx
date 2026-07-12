import { NavLink, useNavigate } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/vehicles", label: "Fleet", icon: "local_shipping" },
  { to: "/drivers", label: "Drivers", icon: "badge" },
  { to: "/trips", label: "Trips", icon: "route" },
  { to: "/maintenance", label: "Maintenance", icon: "build" },
  { to: "/fuel-expenses", label: "Fuel & Expenses", icon: "local_gas_station" },
  { to: "/reports", label: "Analytics", icon: "analytics" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { signOut } = useAppData();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-sidebar_width z-40 flex flex-col pt-header_height bg-white border-r border-outline-variant">
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 px-2 mb-8">
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
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
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
          <a className="text-secondary hover:bg-surface-container-low flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-body-md font-body-md" href="#support">
            <span className="material-symbols-outlined text-[20px]">contact_support</span>
            Support
          </a>
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
