import { useState } from "react";
import { useAppData } from "../context/AppDataContext";

export default function Maintenance() {
  const { vehicles, maintenanceLogs, addMaintenanceLog, completeMaintenanceLog } = useAppData();

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [cost, setCost] = useState("");
  const [serviceDate, setServiceDate] = useState("");

  // Only show vehicles that aren't retired
  const eligibleVehicles = vehicles.filter(v => v.status !== "Retired");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVehicle || !serviceType || !cost || !serviceDate) return;

    addMaintenanceLog({
      vehicleId: selectedVehicle,
      serviceType,
      cost: parseFloat(cost),
      serviceDate,
      notes: ""
    });

    // Reset form
    setSelectedVehicle("");
    setServiceType("");
    setCost("");
    setServiceDate("");
  };

  const getVehicleReg = (id) => vehicles.find(v => v.id === id)?.registrationNo || id;

  return (
    <>
      {/* Left Column: Form & Analytics */}
      <div className="w-[400px] flex flex-col gap-grid_gutter shrink-0">
        {/* Log Service Record Card */}
        <section className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-headline-md font-headline-md text-on-surface">Log Service Record</h2>
            <span className="material-symbols-outlined text-primary-container">history_edu</span>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-body-md font-body-md mb-1.5 text-secondary">Vehicle</label>
              <select 
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full bg-white border border-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-lg p-2.5 text-body-md"
              >
                <option value="">Select Vehicle</option>
                {eligibleVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registrationNo} - {v.model}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-body-md font-body-md mb-1.5 text-secondary">Service Type</label>
              <input 
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full border border-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-lg p-2.5 text-body-md" 
                placeholder="e.g., Oil Change, Engine Check" 
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-md font-body-md mb-1.5 text-secondary">Cost ($)</label>
                <input 
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full border border-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-lg p-2.5 text-body-md" 
                  placeholder="0.00" 
                  type="number"
                />
              </div>
              <div>
                <label className="block text-body-md font-body-md mb-1.5 text-secondary">Date</label>
                <input 
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full border border-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-lg p-2.5 text-body-md" 
                  type="date"
                />
              </div>
            </div>
            <div>
              <label className="block text-body-md font-body-md mb-1.5 text-secondary">Initial Status</label>
              <div className="flex gap-4 items-center mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input checked readOnly className="text-primary-container focus:ring-primary-container" name="status" type="radio"/>
                  <span className="text-body-md font-medium text-on-surface">Active (Sets vehicle to In Shop)</span>
                </label>
              </div>
            </div>
            <button className="w-full bg-primary-container text-on-primary py-3 rounded-lg font-bold hover:brightness-95 transition-all shadow-md active:scale-95 mt-4" type="submit">
              Save Service Record
            </button>
          </form>
        </section>

        {/* Availability Logic & Legend Card */}
        <section className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
          <h3 className="text-label-caps font-label-caps text-secondary uppercase tracking-widest mb-6">System Availability Logic</h3>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-label-caps font-bold rounded-full">Available</span>
                <span className="text-body-md text-secondary">Ready for dispatch</span>
              </div>
              <div className="relative flex items-center justify-between py-2">
                <div className="flex flex-col items-center z-10 bg-white px-2">
                  <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-label-caps font-bold rounded-full line-through">Available</span>
                </div>
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-outline-variant"></div>
                <span className="material-symbols-outlined text-error z-10 bg-white px-2">arrow_forward</span>
                <div className="flex flex-col items-center z-10 bg-white px-2">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-label-caps font-bold rounded-full uppercase">In Shop</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-label-caps font-bold rounded-full uppercase">In Shop</span>
                <span className="text-body-md text-secondary">Maintenance in progress</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-surface-container rounded-lg border border-outline-variant">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                <p className="text-body-md text-on-surface italic">
                  Note: In Shop vehicles are removed from the dispatcher pool until maintenance is marked as complete.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Table */}
      <div className="flex-1 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div>
            <h2 className="text-headline-md font-headline-md text-on-surface">Service Log</h2>
            <p className="text-body-md text-secondary">Historical and ongoing maintenance records</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-surface border border-outline-variant px-4 py-2 rounded-lg text-body-md font-medium hover:bg-surface-container-high transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">download</span>
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-left border-b border-outline-variant">
                <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Vehicle</th>
                <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Service</th>
                <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest text-right">Cost</th>
                <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {maintenanceLogs.map(log => (
                <tr key={log.id} className="hover:bg-primary-fixed/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">local_shipping</span>
                      <span className="text-table-data font-table-data text-on-surface">{getVehicleReg(log.vehicleId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-table-data font-table-data text-secondary">{log.serviceType}</td>
                  <td className="px-6 py-4 text-table-data font-table-data text-secondary">{log.serviceDate}</td>
                  <td className="px-6 py-4 text-table-data font-table-data text-on-surface text-right">{log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">
                    {log.status === "Active" ? (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-label-caps font-bold rounded-full uppercase">Active</span>
                    ) : (
                      <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-label-caps font-bold rounded-full">Completed</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {log.status === "Active" && (
                      <button 
                        onClick={() => completeMaintenanceLog(log.id)}
                        className="text-primary font-bold text-body-md hover:underline bg-primary/10 px-3 py-1 rounded"
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {maintenanceLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-secondary">No maintenance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
