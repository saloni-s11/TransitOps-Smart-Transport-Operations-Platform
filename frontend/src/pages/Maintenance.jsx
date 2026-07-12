import { useState } from "react";
import { useAppData } from "../context/AppDataContext";

const SERVICE_TYPES = [
  "Oil Change",
  "Brake Inspection",
  "Tyre Replacement",
  "Engine Overhaul",
  "AC Service",
  "Battery Replacement",
  "Transmission Service",
  "Other",
];

export default function Maintenance() {
  const { vehicles, maintenanceLogs, addMaintenanceLog, completeMaintenanceLog } = useAppData();

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [customServiceType, setCustomServiceType] = useState("");
  const [cost, setCost] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Only show vehicles that aren't retired
  const eligibleVehicles = vehicles.filter(v => v.status !== "Retired");

  const finalServiceType = serviceType === "Other" ? customServiceType : serviceType;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    if (!selectedVehicle || !finalServiceType || !cost || !serviceDate) {
      setFormError("Please fill in all required fields.");
      return;
    }

    addMaintenanceLog({
      vehicleId: selectedVehicle,
      serviceType: finalServiceType,
      cost: parseFloat(cost),
      serviceDate,
      notes,
    });

    // Reset form
    setSelectedVehicle("");
    setServiceType("");
    setCustomServiceType("");
    setCost("");
    setServiceDate("");
    setNotes("");
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const getVehicle = (id) => vehicles.find(v => v.id === id);
  const getVehicleReg = (id) => getVehicle(id)?.registrationNo || id;

  // Filtered logs
  const filteredLogs = maintenanceLogs.filter(log => {
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    const reg = getVehicleReg(log.vehicleId).toLowerCase();
    const matchesSearch = !searchQuery || reg.includes(searchQuery.toLowerCase()) || log.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats
  const activeLogs = maintenanceLogs.filter(l => l.status === "Active");
  const completedLogs = maintenanceLogs.filter(l => l.status === "Completed");
  const totalCost = maintenanceLogs.reduce((sum, l) => sum + l.cost, 0);
  const inShopVehicles = vehicles.filter(v => v.status === "In Shop");

  // Export CSV
  const handleExport = () => {
    const headers = ["Vehicle", "Service Type", "Date", "Cost", "Status", "Notes"];
    const rows = filteredLogs.map(log => [
      getVehicleReg(log.vehicleId),
      log.serviceType,
      log.serviceDate,
      log.cost,
      log.status,
      log.notes || "",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "maintenance_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-amber-600">build</span>
          </div>
          <div>
            <p className="text-label-caps text-secondary uppercase tracking-wider">Active Jobs</p>
            <p className="text-2xl font-bold text-on-surface">{activeLogs.length}</p>
          </div>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-green-600">check_circle</span>
          </div>
          <div>
            <p className="text-label-caps text-secondary uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-on-surface">{completedLogs.length}</p>
          </div>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-600">garage</span>
          </div>
          <div>
            <p className="text-label-caps text-secondary uppercase tracking-wider">In Shop</p>
            <p className="text-2xl font-bold text-on-surface">{inShopVehicles.length}</p>
          </div>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">payments</span>
          </div>
          <div>
            <p className="text-label-caps text-secondary uppercase tracking-wider">Total Spend</p>
            <p className="text-2xl font-bold text-on-surface">₹{totalCost.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Column: Form */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">

          {/* Log Service Record Card */}
          <section className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-headline-md font-headline-md text-on-surface">Log Service Record</h2>
              <span className="material-symbols-outlined text-primary">history_edu</span>
            </div>

            {formSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="text-body-md font-bold">Service record saved! Vehicle moved to In Shop.</span>
              </div>
            )}
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span className="text-body-md">{formError}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-body-md font-body-md mb-1.5 text-secondary">Vehicle <span className="text-error">*</span></label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full bg-white border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-2.5 text-body-md"
                >
                  <option value="">Select Vehicle</option>
                  {eligibleVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNo} — {v.model}
                      {v.status === "In Shop" ? " (In Shop)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-body-md font-body-md mb-1.5 text-secondary">Service Type <span className="text-error">*</span></label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-white border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-2.5 text-body-md"
                >
                  <option value="">Select Service Type</option>
                  {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {serviceType === "Other" && (
                  <input
                    value={customServiceType}
                    onChange={(e) => setCustomServiceType(e.target.value)}
                    className="w-full border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-2.5 text-body-md mt-2"
                    placeholder="Describe the service..."
                    type="text"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-md font-body-md mb-1.5 text-secondary">Cost (₹) <span className="text-error">*</span></label>
                  <input
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-2.5 text-body-md"
                    placeholder="0.00"
                    type="number"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-body-md font-body-md mb-1.5 text-secondary">Date <span className="text-error">*</span></label>
                  <input
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-2.5 text-body-md"
                    type="date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-body-md font-body-md mb-1.5 text-secondary">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-2.5 text-body-md resize-none"
                  placeholder="Optional notes about this service..."
                  rows={3}
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5">info</span>
                <p className="text-body-sm text-amber-800">Logging a new record sets the vehicle status to <strong>In Shop</strong> and removes it from the dispatch pool.</p>
              </div>

              <button
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:brightness-90 transition-all shadow-md active:scale-95"
                type="submit"
              >
                Save Service Record
              </button>
            </form>
          </section>

          {/* In Shop Vehicles Card */}
          <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-label-caps text-secondary uppercase tracking-widest mb-4">Currently In Shop</h3>
            {inShopVehicles.length === 0 ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="text-body-md font-medium">All vehicles operational!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {inShopVehicles.map(v => {
                  const activeLog = maintenanceLogs.find(l => l.vehicleId === v.id && l.status === "Active");
                  return (
                    <div key={v.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-body-md font-bold text-amber-800">{v.registrationNo}</p>
                        <span className="material-symbols-outlined text-amber-600 text-[18px]">build</span>
                      </div>
                      <p className="text-body-sm text-amber-700 mt-0.5">{activeLog?.serviceType || "Maintenance in progress"}</p>
                      {activeLog?.notes && <p className="text-body-sm text-amber-600 mt-0.5 italic">"{activeLog.notes}"</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Table */}
        <div className="flex-1 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low">
            <div>
              <h2 className="text-headline-md font-headline-md text-on-surface">Service Log</h2>
              <p className="text-body-md text-secondary">Historical and ongoing maintenance records</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-8 pr-3 py-2 border border-outline rounded-lg text-body-md focus:ring-1 focus:ring-primary focus:border-primary w-36"
                />
              </div>
              {/* Status Filter */}
              <div className="flex rounded-lg border border-outline-variant overflow-hidden text-body-md">
                {["All", "Active", "Completed"].map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-2 transition-colors font-medium ${statusFilter === f ? "bg-primary text-on-primary" : "bg-white hover:bg-surface-container-low text-secondary"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {/* Export */}
              <button
                onClick={handleExport}
                className="bg-white border border-outline-variant px-4 py-2 rounded-lg text-body-md font-medium hover:bg-surface-container-high transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
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
                  <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Notes</th>
                  <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredLogs.map(log => {
                  const vehicle = getVehicle(log.vehicleId);
                  return (
                    <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-secondary text-[16px]">local_shipping</span>
                          </div>
                          <div>
                            <p className="text-body-md font-bold text-on-surface">{vehicle?.registrationNo || log.vehicleId}</p>
                            <p className="text-body-sm text-secondary">{vehicle?.model || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md text-on-surface">{log.serviceType}</td>
                      <td className="px-6 py-4 text-body-md text-secondary">{log.serviceDate}</td>
                      <td className="px-6 py-4 text-body-md font-bold text-on-surface text-right">
                        ₹{log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-body-sm text-secondary max-w-[180px]">
                        <span className="line-clamp-2">{log.notes || <span className="italic text-outline">—</span>}</span>
                      </td>
                      <td className="px-6 py-4">
                        {log.status === "Active" ? (
                          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-label-caps font-bold rounded-full uppercase inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block"></span>
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-label-caps font-bold rounded-full inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">check</span>
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {log.status === "Active" ? (
                          <button
                            onClick={() => completeMaintenanceLog(log.id)}
                            className="flex items-center gap-1.5 text-primary font-bold text-body-md hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">task_alt</span>
                            Mark Complete
                          </button>
                        ) : (
                          <span className="text-secondary text-body-sm italic">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-16">
                      <span className="material-symbols-outlined text-4xl text-outline mb-3 block">build_circle</span>
                      <p className="text-secondary text-body-md">No records found matching your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
            <p className="text-body-sm text-secondary">{filteredLogs.length} record(s) shown</p>
            <p className="text-body-sm font-bold text-on-surface">
              Filtered Total: ₹{filteredLogs.reduce((sum, l) => sum + l.cost, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
