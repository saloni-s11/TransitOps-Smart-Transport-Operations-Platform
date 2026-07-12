import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

export default function Dashboard() {
  const { vehicles, trips, drivers } = useAppData();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterRegion, setFilterRegion] = useState("All Regions");

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const typeMatch = filterType === "All Types" || v.type === filterType.replace(/s$/, ""); // Truck(s), Van(s)
      const statusMatch = filterStatus === "All Status" || 
                         (filterStatus === "Maintenance" ? v.status === "In Shop" : v.status === filterStatus);
      const regionMatch = filterRegion === "All Regions" || v.region === filterRegion;
      return typeMatch && statusMatch && regionMatch;
    });
  }, [vehicles, filterType, filterStatus, filterRegion]);

  // Computations based on filtered vehicles
  const activeVehicles = filteredVehicles.length;
  const availableVehicles = filteredVehicles.filter((v) => v.status === "Available").length;
  const inMaintenance = filteredVehicles.filter((v) => v.status === "In Shop").length;
  const retiredVehicles = filteredVehicles.filter((v) => v.status === "Retired").length;
  const onTripVehicles = filteredVehicles.filter((v) => v.status === "On Trip").length;

  const activeTrips = trips.filter((t) => t.status === "Dispatched").length;
  const pendingTrips = trips.filter((t) => t.status === "Draft").length;

  const driversOnDuty = drivers.filter((d) => d.status === "On Trip").length;

  // Fleet utilization = (On Trip + Available) / Total Active (non-retired)
  // Actually, utilization usually means (On Trip / Total Active)
  const activeFleet = activeVehicles - retiredVehicles;
  const fleetUtilization = activeFleet > 0 ? Math.round((onTripVehicles / activeFleet) * 100) : 0;

  const recentTrips = useMemo(() => trips.slice(0, 5), [trips]);

  const getVehicleReg = (id) => vehicles.find(v => v.id === id)?.registrationNo || id;
  const getDriverName = (id) => drivers.find(d => d.id === id)?.name || "Unassigned";

  return (
    <>
      <div className="p-container_padding max-w-7xl mx-auto space-y-6">
        {/* Filters Row */}
        <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border border-outline-variant shadow-sm">
          <div className="space-y-1 shrink-0">
            <label className="text-label-caps font-label-caps text-secondary block">VEHICLE TYPE</label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-surface-container-low border-outline-variant rounded-lg text-body-md font-body-md px-4 py-2 focus:ring-primary min-w-[160px]">
              <option>All Types</option>
              <option>Trucks</option>
              <option>Vans</option>
              <option>Special</option>
            </select>
          </div>
          <div className="space-y-1 shrink-0">
            <label className="text-label-caps font-label-caps text-secondary block">STATUS</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-surface-container-low border-outline-variant rounded-lg text-body-md font-body-md px-4 py-2 focus:ring-primary min-w-[160px]">
              <option>All Status</option>
              <option>Available</option>
              <option>On Trip</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div className="space-y-1 shrink-0">
            <label className="text-label-caps font-label-caps text-secondary block">REGION</label>
            <select 
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-surface-container-low border-outline-variant rounded-lg text-body-md font-body-md px-4 py-2 focus:ring-primary min-w-[160px]">
              <option>All Regions</option>
              <option>Region K</option>
              <option>Region B</option>
              <option>Region Z</option>
            </select>
          </div>
          <button 
            onClick={() => navigate('/trips')}
            className="ml-auto flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-bold text-body-md hover:bg-opacity-90 transition-all active:scale-95 shadow-lg">
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Dispatch
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
            <p className="text-label-caps font-label-caps text-secondary mb-1">TOTAL FLEET</p>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-display text-on-surface">{activeVehicles}</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "100%" }}></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
            <p className="text-label-caps font-label-caps text-secondary mb-1">AVAILABLE</p>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-display text-on-surface">{availableVehicles}</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: `${(availableVehicles/activeVehicles)*100}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
            <p className="text-label-caps font-label-caps text-secondary mb-1">IN MAINTENANCE</p>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-display text-on-surface">{inMaintenance}</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-error h-full" style={{ width: `${(inMaintenance/activeVehicles)*100}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
            <p className="text-label-caps font-label-caps text-secondary mb-1">ACTIVE TRIPS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-display text-on-surface">{activeTrips}</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full" style={{ width: "50%" }}></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
            <p className="text-label-caps font-label-caps text-secondary mb-1">PENDING TRIPS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-display text-on-surface">{pendingTrips}</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: "30%" }}></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
            <p className="text-label-caps font-label-caps text-secondary mb-1">DRIVERS ON DUTY</p>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-display text-on-surface">{driversOnDuty}</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full" style={{ width: `${(driversOnDuty/drivers.length)*100}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
            <p className="text-label-caps font-label-caps text-secondary mb-1">UTILIZATION</p>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-display text-on-surface">{fleetUtilization}%</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${fleetUtilization}%` }}></div>
            </div>
          </div>
        </div>

        {/* Bento Layout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-headline-md font-headline-md text-on-surface">Recent Trips</h3>
              <button 
                onClick={() => navigate('/trips')}
                className="text-body-md font-body-md text-primary hover:underline">
                View All Trips
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-3 text-label-caps font-label-caps text-secondary">TRIP ID</th>
                    <th className="px-6 py-3 text-label-caps font-label-caps text-secondary">VEHICLE</th>
                    <th className="px-6 py-3 text-label-caps font-label-caps text-secondary">DRIVER</th>
                    <th className="px-6 py-3 text-label-caps font-label-caps text-secondary">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {recentTrips.map(trip => (
                    <tr key={trip.id} className="hover:bg-primary-fixed/20 transition-colors group">
                      <td className="px-6 py-4 text-mono-data font-mono-data font-bold">{trip.id.toUpperCase()}</td>
                      <td className="px-6 py-4 text-table-data font-table-data">{getVehicleReg(trip.vehicleId)}</td>
                      <td className="px-6 py-4 text-table-data font-table-data">{getDriverName(trip.driverId)}</td>
                      <td className="px-6 py-4">
                        {trip.status === "Dispatched" && <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 uppercase">On Trip</span>}
                        {trip.status === "Completed" && <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700 uppercase">Completed</span>}
                        {trip.status === "Draft" && <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 uppercase">Draft</span>}
                        {trip.status === "Cancelled" && <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 uppercase">Cancelled</span>}
                      </td>
                    </tr>
                  ))}
                  {recentTrips.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-4 text-secondary">No trips found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md font-headline-md text-on-surface">Vehicle Status</h3>
              <span 
                onClick={() => navigate('/vehicles')}
                title="View Vehicles"
                className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">
                more_vert
              </span>
            </div>
            <div className="space-y-6 flex-grow flex flex-col justify-center">
              <div className="space-y-2">
                <div className="flex justify-between text-body-md font-body-md">
                  <span className="text-secondary">Available</span>
                  <span className="font-bold">{availableVehicles}</span>
                </div>
                <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${(availableVehicles/activeVehicles)*100}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-body-md font-body-md">
                  <span className="text-secondary">On Trip</span>
                  <span className="font-bold">{onTripVehicles}</span>
                </div>
                <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${(onTripVehicles/activeVehicles)*100}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-body-md font-body-md">
                  <span className="text-secondary">In Shop</span>
                  <span className="font-bold">{inMaintenance}</span>
                </div>
                <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="bg-error h-full transition-all duration-1000" style={{ width: `${(inMaintenance/activeVehicles)*100}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-body-md font-body-md">
                  <span className="text-secondary">Retired</span>
                  <span className="font-bold">{retiredVehicles}</span>
                </div>
                <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="bg-gray-400 h-full transition-all duration-1000" style={{ width: `${(retiredVehicles/activeVehicles)*100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Dispatch Map */}
        <div className="grid grid-cols-1 gap-6">
          <div className="relative h-80 rounded-xl overflow-hidden shadow-sm border border-outline-variant">
            <div className="absolute inset-0 z-0 bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-secondary opacity-20">map</span>
            </div>
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-3 rounded-lg border border-outline-variant shadow-lg max-w-xs">
              <h4 className="text-body-md font-bold text-on-surface mb-2">Live Dispatch View</h4>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-label-caps font-label-caps text-secondary">ALL REGIONS ACTIVE</p>
              </div>
              <p className="text-body-md font-body-md text-secondary">Systems nominal. Monitoring {activeTrips} active trips.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
