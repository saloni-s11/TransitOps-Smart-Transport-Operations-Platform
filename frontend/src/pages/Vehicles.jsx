import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { ProtectedAction } from "../components/common/ProtectedAction";
import { PERMISSIONS } from "../lib/permissions";

export default function Vehicles() {
  const { vehicles, updateVehicleStatus } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState("bottom");
  const [typeFilter, setTypeFilter] = useState("Type: All");
  const [statusFilter, setStatusFilter] = useState("Status: All");
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'On Trip': return 'bg-blue-100 text-blue-800';
      case 'In Shop': return 'bg-orange-100 text-orange-800';
      case 'Retired': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    // Note: AppDataContext uses mockData property names (e.g., registrationNo instead of registration_no)
    const regNo = v.registrationNo || v.registration_no || "";
    const model = v.model || "";
    const type = v.type || "";
    const status = v.status || "";

    const matchesSearch = regNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "Type: All" || type === typeFilter;
    const matchesStatus = statusFilter === "Status: All" || status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeActionMenu && !e.target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeActionMenu]);

  return (
    <>
{/* Page Header / Filter Bar */}
<div className="flex flex-col gap-6 mb-8">
<div className="flex items-center justify-between">
<div>
<h1 className="text-display font-display text-on-surface">Vehicle Registry</h1>
<p className="text-body-md text-secondary mt-1">Manage and monitor your entire operational fleet assets.</p>
</div>
<ProtectedAction permission={PERMISSIONS.ADD_VEHICLE} mode="hide">
  <Link to="/vehicles/add" className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded shadow-sm hover:opacity-90 active:scale-95 transition-all font-bold flex items-center gap-2">
    <span className="material-symbols-outlined">add_circle</span>
    Add Vehicle
  </Link>
</ProtectedAction>
</div>
{/* Filters */}
<div className="bg-white p-4 border border-outline-variant flex items-center gap-4 flex-wrap">
<div className="flex-1 min-w-[200px]">
<label className="text-label-caps text-secondary block mb-1">Search Registry</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
<input 
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container focus:border-transparent" 
  placeholder="Reg no., name..." 
  type="text"
/>
</div>
</div>
<div className="w-48">
<label className="text-label-caps text-secondary block mb-1">Vehicle Type</label>
<select 
  value={typeFilter}
  onChange={(e) => setTypeFilter(e.target.value)}
  className="w-full px-3 py-2 border border-outline-variant rounded bg-background focus:ring-1 focus:ring-primary-container"
>
<option>Type: All</option>
<option value="Truck">Truck</option>
<option value="Van">Van</option>
<option value="Mini">Mini</option>
<option value="Special">Special</option>
</select>
</div>
<div className="w-48">
<label className="text-label-caps text-secondary block mb-1">Current Status</label>
<select 
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="w-full px-3 py-2 border border-outline-variant rounded bg-background focus:ring-1 focus:ring-primary-container"
>
<option>Status: All</option>
<option value="Available">Available</option>
<option value="On Trip">On Trip</option>
<option value="In Shop">In Shop</option>
<option value="Retired">Retired</option>
</select>
</div>
<div className="flex items-end pb-1 h-full">
<button 
  onClick={() => {
    setSearchTerm("");
    setTypeFilter("Type: All");
    setStatusFilter("Status: All");
    setCurrentPage(1);
  }}
  className="p-2 text-secondary hover:bg-surface-container rounded transition-colors" 
  title="Reset Filters"
>
<span className="material-symbols-outlined">refresh</span>
</button>
</div>
</div>
</div>
{/* Vehicle Table Container */}
<div className="bg-white border border-outline-variant rounded-sm shadow-sm mb-6">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-4 py-3 text-label-caps text-secondary">Reg. No.</th>
<th className="px-4 py-3 text-label-caps text-secondary">Name/Model</th>
<th className="px-4 py-3 text-label-caps text-secondary">Type</th>
<th className="px-4 py-3 text-label-caps text-secondary">Capacity</th>
<th className="px-4 py-3 text-label-caps text-secondary text-right">Odometer</th>
<th className="px-4 py-3 text-label-caps text-secondary text-right">Acq. Cost</th>
<th className="px-4 py-3 text-label-caps text-secondary text-center">Status</th>
<th className="px-4 py-3 text-label-caps text-secondary text-center">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{filteredVehicles.length === 0 ? (
  <tr><td colSpan="8" className="px-4 py-8 text-center text-secondary">No vehicles found.</td></tr>
) : (
  paginatedVehicles.map((vehicle) => (
  <tr key={vehicle.id} className="table-row-hover transition-colors">
  <td className="px-4 py-4 font-mono-data text-on-surface">{vehicle.registrationNo || vehicle.registration_no}</td>
  <td className="px-4 py-4 text-table-data font-bold">{vehicle.model}</td>
  <td className="px-4 py-4 text-table-data">{vehicle.type}</td>
  <td className="px-4 py-4 text-table-data">{vehicle.maxCapacityKg || vehicle.max_capacity_kg} kg</td>
  <td className="px-4 py-4 text-table-data text-right font-mono-data">{(Number(vehicle.odometerKm || vehicle.odometer_km) || 0).toLocaleString()} km</td>
  <td className="px-4 py-4 text-table-data text-right font-mono-data">₹ {(Number(vehicle.acquisitionCost || vehicle.acquisition_cost) || 0).toLocaleString()}</td>
  <td className="px-4 py-4 text-center">
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase ${getStatusBadgeStyle(vehicle.status)}`}>{vehicle.status}</span>
  </td>
  <td className="px-4 py-4 text-center relative action-menu-container">
  <ProtectedAction permission={PERMISSIONS.EDIT_VEHICLE} mode="tooltip">
    <button 
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setMenuPosition(spaceBelow < 120 ? "top" : "bottom");
        setActiveActionMenu(activeActionMenu === vehicle.id ? null : vehicle.id);
      }}
      className="material-symbols-outlined text-secondary hover:text-primary transition-colors"
    >
      more_vert
    </button>
  </ProtectedAction>
  {activeActionMenu === vehicle.id && (
    <div className={`absolute right-8 w-36 bg-white shadow-lg border border-outline-variant rounded z-50 flex flex-col text-left py-1 ${
      menuPosition === "top" ? "bottom-8" : "top-8"
    }`}>
      <button onClick={() => { updateVehicleStatus(vehicle.id, 'Available'); setActiveActionMenu(null); }} className="px-4 py-2 hover:bg-surface-container-low text-sm">Set Available</button>
      <button onClick={() => { updateVehicleStatus(vehicle.id, 'In Shop'); setActiveActionMenu(null); }} className="px-4 py-2 hover:bg-surface-container-low text-sm">Send to Shop</button>
      <button onClick={() => { updateVehicleStatus(vehicle.id, 'Retired'); setActiveActionMenu(null); }} className="px-4 py-2 hover:bg-surface-container-low text-sm text-red-600">Retire</button>
    </div>
  )}
  </td>
  </tr>
  ))
)}
</tbody>
</table>
</div>
{/* Rule Note */}
<div className="flex items-start gap-3 p-4 bg-surface-container-high rounded border-l-4 border-primary">
<span className="material-symbols-outlined text-primary">info</span>
<div>
<p className="text-body-md font-bold text-on-surface">Registry Constraint Policy</p>
<p className="text-body-md text-secondary">Registration number must be unique. Vehicles marked as <span className="font-bold">Retired</span> or <span className="font-bold">In Shop</span> are automatically filtered out from the Trip Dispatcher pool to prevent operational assignment errors.</p>
</div>
</div>
{/* Bottom Pagination/Status */}
<div className="mt-8 flex items-center justify-between text-secondary">
<p className="text-body-md">Showing {filteredVehicles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} registered assets</p>
<div className="flex items-center gap-2">
<button 
  disabled={currentPage === 1}
  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
  className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
<span className="material-symbols-outlined text-[20px]">chevron_left</span>
</button>

{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
  <button 
    key={page}
    onClick={() => setCurrentPage(page)}
    className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${currentPage === page ? 'bg-primary text-on-primary font-bold' : 'border border-outline-variant hover:bg-surface-container-high'}`}
  >
    {page}
  </button>
))}

<button 
  disabled={currentPage === totalPages}
  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
  className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
<span className="material-symbols-outlined text-[20px]">chevron_right</span>
</button>
</div>
</div>    </>
  );
}
