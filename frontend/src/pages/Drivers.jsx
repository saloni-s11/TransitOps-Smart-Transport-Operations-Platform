import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { ProtectedAction } from "../components/common/ProtectedAction";
import { PERMISSIONS } from "../lib/permissions";

export default function Drivers() {
  const { drivers, updateDriverStatus } = useAppData();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  
  const itemsPerPage = 5;

  const getStatusBadgeStyle = (status) => {
    switch(status?.toUpperCase()) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'ON TRIP': return 'bg-blue-100 text-blue-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'OFF DUTY': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDrivers = drivers.filter(d => 
    statusFilter === "ALL" || d.status.toUpperCase() === statusFilter
  );
  
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage) || 1;
  const paginatedDrivers = filteredDrivers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  return (
    <>
      {/* Header & Action Row */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-display font-display text-on-surface">Drivers & Safety Profiles</h1>
          <p className="text-body-md text-secondary mt-1">Manage personnel, safety compliance, and operational availability.</p>
        </div>
        <ProtectedAction permission={PERMISSIONS.MANAGE_DRIVERS} mode="hide">
          <Link to="/drivers/add" className="bg-primary-container text-on-primary-container font-bold px-6 py-2.5 rounded shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined">person_add</span>
            Add Driver
          </Link>
        </ProtectedAction>
      </div>

      {/* Filter & Toggle Bar */}
      <div className="bg-white border border-outline-variant p-4 rounded mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex rounded border border-outline overflow-hidden">
            <button 
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-1.5 text-label-caps font-bold border-r border-outline ${statusFilter === 'ALL' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'}`}>ALL</button>
            <button 
              onClick={() => setStatusFilter("AVAILABLE")}
              className={`px-4 py-1.5 text-label-caps font-bold border-r border-outline ${statusFilter === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-surface-container-high text-secondary'}`}>AVAILABLE</button>
            <button 
              onClick={() => setStatusFilter("ON TRIP")}
              className={`px-4 py-1.5 text-label-caps font-bold border-r border-outline ${statusFilter === 'ON TRIP' ? 'bg-blue-100 text-blue-800' : 'bg-surface-container-high text-secondary'}`}>ON TRIP</button>
            <button 
              onClick={() => setStatusFilter("OFF DUTY")}
              className={`px-4 py-1.5 text-label-caps font-bold border-r border-outline ${statusFilter === 'OFF DUTY' ? 'bg-gray-200 text-gray-800' : 'bg-surface-container-high text-secondary'}`}>OFF DUTY</button>
            <button 
              onClick={() => setStatusFilter("SUSPENDED")}
              className={`px-4 py-1.5 text-label-caps font-bold ${statusFilter === 'SUSPENDED' ? 'bg-red-100 text-red-800' : 'bg-surface-container-high text-secondary'}`}>SUSPENDED</button>
          </div>
          <div className="h-8 w-px bg-outline-variant"></div>
          <p className="text-body-md text-error italic flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">info</span>
            Expiring license or suspended status - blocked from trip assignment.
          </p>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white border border-outline-variant rounded overflow-hidden">
        <table className="w-full text-left zebra-table border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-4 py-3 text-label-caps text-secondary uppercase">Driver</th>
              <th className="px-4 py-3 text-label-caps text-secondary uppercase">License No.</th>
              <th className="px-4 py-3 text-label-caps text-secondary uppercase">Category</th>
              <th className="px-4 py-3 text-label-caps text-secondary uppercase">Expiry</th>
              <th className="px-4 py-3 text-label-caps text-secondary uppercase">Contact</th>
              <th className="px-4 py-3 text-label-caps text-secondary uppercase">Safety</th>
              <th className="px-4 py-3 text-label-caps text-secondary uppercase text-center">Status</th>
              <th className="px-4 py-3 text-label-caps text-secondary uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-table-data">
            {filteredDrivers.length === 0 ? (
              <tr><td colSpan="8" className="px-4 py-8 text-center text-secondary">No drivers found.</td></tr>
            ) : (
              paginatedDrivers.map((driver) => {
                const isExpired = new Date(driver.licenseExpiry) < new Date();
                const initals = driver.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                
                return (
                  <tr key={driver.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant">
                          {initals}
                        </div>
                        <span className="font-bold text-on-surface">{driver.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono-data text-secondary">{driver.licenseNo}</td>
                    <td className="px-4 py-4">{driver.licenseCategory}</td>
                    <td className={`px-4 py-4 ${isExpired ? 'text-error font-bold' : ''}`}>
                      {driver.licenseExpiry} {isExpired && 'EXPIRED'}
                    </td>
                    <td className="px-4 py-4 text-secondary">{driver.contactNo}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{driver.safetyScore}%</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-3 h-2 rounded-sm ${i < Math.round(driver.safetyScore / 20) ? (driver.safetyScore > 80 ? 'bg-green-500' : driver.safetyScore > 60 ? 'bg-orange-500' : 'bg-red-500') : 'bg-surface-container-highest'}`}></div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-label-caps ${getStatusBadgeStyle(driver.status)}`}>
                        {driver.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center relative">
                      <ProtectedAction permission={PERMISSIONS.MANAGE_DRIVERS} mode="tooltip">
                        <button
                          onClick={() => setActiveActionMenu(activeActionMenu === driver.id ? null : driver.id)}
                          className="material-symbols-outlined text-secondary hover:text-primary transition-colors"
                        >
                          more_vert
                        </button>
                      </ProtectedAction>
                      {activeActionMenu === driver.id && (
                        <div className="absolute right-8 top-8 w-36 bg-white shadow-lg border border-outline-variant rounded z-10 flex flex-col text-left py-1">
                          <button onClick={() => { updateDriverStatus(driver.id, 'Available'); setActiveActionMenu(null); }} className="px-4 py-2 hover:bg-surface-container-low text-sm">Set Available</button>
                          <button onClick={() => { updateDriverStatus(driver.id, 'Off Duty'); setActiveActionMenu(null); }} className="px-4 py-2 hover:bg-surface-container-low text-sm">Set Off Duty</button>
                          <button onClick={() => { updateDriverStatus(driver.id, 'Suspended'); setActiveActionMenu(null); }} className="px-4 py-2 hover:bg-surface-container-low text-sm text-red-600">Suspend</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low">
          <p className="text-body-md text-secondary">
            Showing {filteredDrivers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredDrivers.length)} of {filteredDrivers.length} drivers
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${currentPage === page ? 'bg-primary text-on-primary font-bold' : 'border border-outline-variant hover:bg-white'}`}
              >
                {page}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-4 gap-grid_gutter mt-8">
        <div className="bg-white border border-outline-variant p-5 rounded relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-label-caps text-secondary uppercase">Total Drivers</span>
            <span className="material-symbols-outlined text-primary">groups</span>
          </div>
          <h4 className="text-display font-display text-on-surface">{drivers.length}</h4>
          <div className="absolute bottom-0 left-0 h-1 bg-primary w-full transition-all duration-500"></div>
        </div>
        <div className="bg-white border border-outline-variant p-5 rounded relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-label-caps text-secondary uppercase">Available</span>
            <span className="material-symbols-outlined text-green-600">verified</span>
          </div>
          <h4 className="text-display font-display text-on-surface">{drivers.filter(d => d.status === 'Available').length}</h4>
          <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full"></div>
        </div>
        <div className="bg-white border border-outline-variant p-5 rounded relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-label-caps text-secondary uppercase">Compliance Alerts</span>
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <h4 className="text-display font-display text-on-surface">{drivers.filter(d => new Date(d.licenseExpiry) < new Date()).length}</h4>
          <div className="absolute bottom-0 left-0 h-1 bg-error w-full transition-all duration-500"></div>
        </div>
        <div className="bg-white border border-outline-variant p-5 rounded relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-label-caps text-secondary uppercase">Suspended</span>
            <span className="material-symbols-outlined text-red-600">block</span>
          </div>
          <h4 className="text-display font-display text-on-surface">{drivers.filter(d => d.status === 'Suspended').length}</h4>
          <div className="absolute bottom-0 left-0 h-1 bg-red-500 w-full transition-all duration-500"></div>
        </div>
      </div>
    </>
  );
}
