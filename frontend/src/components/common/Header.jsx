import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext";

export default function Header() {
  const { user, role, vehicles, drivers, trips, maintenanceLogs } = useAppData();
  const navigate = useNavigate();
  
  // Search state
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  
  // Help state
  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef(null);

  // Close notifications if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate dynamic notifications
  const notifications = [];
  
  const activeMaintenance = maintenanceLogs.filter(m => m.status === "Active");
  if (activeMaintenance.length > 0) {
    notifications.push({
      id: "maint",
      title: "Maintenance Alerts",
      desc: `${activeMaintenance.length} vehicle(s) currently in shop.`,
      icon: "build",
      color: "text-error",
      bg: "bg-error-container"
    });
  }

  const pendingTrips = trips.filter(t => t.status === "Draft");
  if (pendingTrips.length > 0) {
    notifications.push({
      id: "trips",
      title: "Pending Dispatches",
      desc: `${pendingTrips.length} trip(s) waiting for dispatch.`,
      icon: "schedule",
      color: "text-secondary",
      bg: "bg-secondary-container"
    });
  }

  if (notifications.length === 0) {
    notifications.push({
      id: "none",
      title: "All caught up!",
      desc: "No new notifications at this time.",
      icon: "check_circle",
      color: "text-green-600",
      bg: "bg-green-100"
    });
  }

  // Search logic
  const searchResults = () => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    // Vehicles
    vehicles
      .filter((v) => v.registrationNo.toLowerCase().includes(lowerQuery) || v.type.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .forEach((v) => results.push({ type: "Vehicle", title: v.registrationNo, subtitle: v.type, link: "/vehicles" }));
    
    // Drivers
    drivers
      .filter((d) => d.name.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .forEach((d) => results.push({ type: "Driver", title: d.name, subtitle: `Status: ${d.status}`, link: "/drivers" }));
    
    // Trips
    trips
      .filter((t) => t.id.toLowerCase().includes(lowerQuery) || t.status.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .forEach((t) => results.push({ type: "Trip", title: t.id.toUpperCase(), subtitle: t.status, link: "/trips" }));
      
    return results;
  };

  const results = searchResults();

  return (
    <header className="fixed top-0 right-0 left-0 h-header_height z-50 flex items-center justify-between px-container_padding bg-surface border-b border-outline-variant">
      <div className="flex items-center gap-8 w-full max-w-7xl mx-auto">
        <div className="text-headline-lg font-headline-lg font-bold text-primary shrink-0 cursor-pointer" onClick={() => navigate("/")}>
          TransitOps
        </div>
        <div className="flex-grow max-w-md ml-8 relative">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
              search
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-body-md font-body-md focus:ring-2 focus:ring-primary-container transition-all"
              placeholder="Search vehicles, drivers, trips..."
              type="text"
            />
          </div>
          
          {/* Search Dropdown */}
          {isFocused && query && (
            <div className="absolute top-full mt-2 w-full bg-white border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
              {results.length > 0 ? (
                <ul className="divide-y divide-outline-variant">
                  {results.map((res, i) => (
                    <li 
                      key={i} 
                      onClick={() => {
                        navigate(res.link);
                        setQuery("");
                      }}
                      className="p-3 hover:bg-surface-container-low cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-body-md font-bold text-on-surface">{res.title}</p>
                          <p className="text-label-caps text-secondary">{res.subtitle}</p>
                        </div>
                        <span className="text-label-caps font-bold text-primary px-2 py-1 bg-primary-container rounded-md">
                          {res.type}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-secondary text-body-md">No results found for "{query}"</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-6 ml-auto">
          <div className="text-body-md font-body-md text-secondary">{user?.region ?? "Region K"}</div>
          <div className="flex items-center gap-2">
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full hover:bg-surface-container-high transition-colors relative ${showNotifications ? 'bg-surface-container-high' : ''}`}
              >
                <span className="material-symbols-outlined text-secondary">notifications</span>
                {notifications.length > 0 && notifications[0].id !== "none" && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                    <h4 className="text-headline-md font-bold text-on-surface">Notifications</h4>
                    <span className="text-label-caps text-primary cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <ul className="max-h-64 overflow-y-auto divide-y divide-outline-variant">
                    {notifications.map((n) => (
                      <li key={n.id} className="p-4 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.bg}`}>
                          <span className={`material-symbols-outlined ${n.color}`}>{n.icon}</span>
                        </div>
                        <div>
                          <p className="text-body-md font-bold text-on-surface">{n.title}</p>
                          <p className="text-body-sm text-secondary mt-1">{n.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-3 border-t border-outline-variant text-center">
                    <span className="text-body-md text-primary font-bold cursor-pointer hover:underline">View All Activity</span>
                  </div>
                </div>
              )}
            </div>

            {/* Help Button */}
            <div className="relative" ref={helpRef}>
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className={`p-2 rounded-full hover:bg-surface-container-high transition-colors relative ${showHelp ? 'bg-surface-container-high' : ''}`}
              >
                <span className="material-symbols-outlined text-secondary">help</span>
              </button>
              
              {/* Help Dropdown */}
              {showHelp && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-outline-variant bg-surface-container-lowest">
                    <h4 className="text-body-md font-bold text-on-surface">Help & Resources</h4>
                  </div>
                  <ul className="divide-y divide-outline-variant">
                    <li className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-3" onClick={() => setShowHelp(false)}>
                      <span className="material-symbols-outlined text-secondary text-[18px]">menu_book</span>
                      <span className="text-body-md text-on-surface">Documentation</span>
                    </li>
                    <li className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-3" onClick={() => setShowHelp(false)}>
                      <span className="material-symbols-outlined text-secondary text-[18px]">support_agent</span>
                      <span className="text-body-md text-on-surface">Contact Support</span>
                    </li>
                    <li className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-3" onClick={() => setShowHelp(false)}>
                      <span className="material-symbols-outlined text-secondary text-[18px]">keyboard</span>
                      <span className="text-body-md text-on-surface">Shortcuts</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
            <div className="text-right">
              <p className="text-body-md font-body-md font-bold text-on-surface">{user?.name ?? "Guest"}</p>
              <p className="text-label-caps font-label-caps text-secondary">{(role ?? "").toUpperCase()}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-outline-variant">
              <span className="material-symbols-outlined text-on-primary-fixed-variant">account_circle</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
