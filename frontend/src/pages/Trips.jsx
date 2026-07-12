import { useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { ProtectedAction } from "../components/common/ProtectedAction";
import { usePermissions } from "../hooks/usePermissions";
import { PERMISSIONS } from "../lib/permissions";

export default function Trips() {
  const { vehicles, drivers, trips, dispatchTrip, completeTrip, cancelTrip } = useAppData();
  const { can } = usePermissions();

  const [source, setSource] = useState("Gandhinagar Depot");
  const [destination, setDestination] = useState("Ahmedabad Hub");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [cargoWeightKg, setCargoWeightKg] = useState("");
  const [plannedDistanceKm, setPlannedDistanceKm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const availableVehicles = vehicles.filter(v => v.status === "Available");
  const availableDrivers = drivers.filter(d => d.status === "Available");

  const selectedVehicle = vehicles.find(v => v.id === vehicleId);
  const capacityExceeded = selectedVehicle && Number(cargoWeightKg) > selectedVehicle.maxCapacityKg;
  const selectedTripForLifecycle = trips.find(t => t.id === selectedTripId);

  const currentStatus = selectedTripForLifecycle?.status || 'Draft';
  let progressWidth = '0%';
  if (currentStatus === 'Dispatched') progressWidth = '50%';
  if (currentStatus === 'Completed' || currentStatus === 'Cancelled') progressWidth = '100%';
  const isCancelled = currentStatus === 'Cancelled';

  const handleDispatch = () => {
    if (!vehicleId || !driverId || !cargoWeightKg || !plannedDistanceKm) {
      setErrorMsg("Please fill in all fields to dispatch.");
      return;
    }
    
    const result = dispatchTrip({
      source,
      destination,
      vehicleId,
      driverId,
      cargoWeightKg: Number(cargoWeightKg),
      plannedDistanceKm: Number(plannedDistanceKm)
    });
    
    if (!result.ok) {
      setErrorMsg(result.reason);
    } else {
      setErrorMsg("");
      setVehicleId("");
      setDriverId("");
      setCargoWeightKg("");
      setPlannedDistanceKm("");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Dispatched': return 'bg-tertiary-container text-on-tertiary-container';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-error-container text-on-error-container';
      case 'Draft': return 'bg-surface-container-high text-secondary';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto">
        {/* Trip Lifecycle Header */}
        <div className="bg-white border border-outline-variant p-8 rounded-xl mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <p className="text-label-caps text-secondary uppercase font-bold tracking-wider">
              {selectedTripForLifecycle ? `Trip Lifecycle: ${selectedTripForLifecycle.id.toUpperCase()}` : "Trip Lifecycle (Select a trip)"}
            </p>
            {selectedTripForLifecycle && (
              <span className={`px-3 py-1 text-label-caps rounded-full font-bold ${getStatusStyle(currentStatus)}`}>
                {currentStatus}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between relative px-4 sm:px-12">
            {/* Progress Line Background */}
            <div className="absolute top-5 left-[15%] right-[15%] h-1.5 bg-surface-container-high rounded-full z-0 overflow-hidden">
              {/* Active Progress Line */}
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-in-out ${isCancelled ? 'bg-error' : 'bg-primary'}`}
                style={{ width: progressWidth }}
              ></div>
            </div>
            
            {/* Draft Stage */}
            <div className="flex flex-col items-center gap-3 z-10 w-24">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-sm transition-colors duration-500 ${isCancelled ? 'bg-error' : 'bg-primary'}`}>
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </div>
              <span className={`text-label-caps font-bold tracking-wide ${isCancelled ? 'text-error' : 'text-primary'}`}>Draft</span>
            </div>
            
            {/* Dispatched Stage */}
            <div className={`flex flex-col items-center gap-3 z-10 w-24 ${currentStatus === 'Draft' ? 'opacity-40 grayscale' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-sm transition-colors duration-500 ${currentStatus === 'Draft' ? 'bg-secondary' : (isCancelled ? 'bg-error' : 'bg-primary')}`}>
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              </div>
              <span className={`text-label-caps font-bold tracking-wide ${currentStatus === 'Draft' ? 'text-secondary' : (isCancelled ? 'text-error' : 'text-primary')}`}>Dispatched</span>
            </div>
            
            {/* Final Stage (Completed / Cancelled) */}
            <div className={`flex flex-col items-center gap-3 z-10 w-24 ${(currentStatus === 'Draft' || currentStatus === 'Dispatched') ? 'opacity-40 grayscale' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-sm transition-colors duration-500 ${(currentStatus === 'Draft' || currentStatus === 'Dispatched') ? 'bg-surface-container-high text-secondary' : (isCancelled ? 'bg-error' : 'bg-green-600')}`}>
                <span className="material-symbols-outlined text-[20px]">{isCancelled ? 'cancel' : 'check_circle'}</span>
              </div>
              <span className={`text-label-caps font-bold tracking-wide ${(currentStatus === 'Draft' || currentStatus === 'Dispatched') ? 'text-secondary' : (isCancelled ? 'text-error' : 'text-green-600')}`}>
                {isCancelled ? 'Cancelled' : 'Completed'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Trip Form (Left Column) */}
          <section className="lg:col-span-7 bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h2 className="text-headline-md font-bold text-on-surface">Create Trip</h2>
              {!can(PERMISSIONS.CREATE_TRIP) && (
                <span className="flex items-center gap-1.5 text-secondary text-body-sm bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  View only
                </span>
              )}
            </div>
            <div className="p-6 flex-1 space-y-6">
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!can(PERMISSIONS.CREATE_TRIP) ? 'pointer-events-none opacity-60' : ''}`}>
                {/* Source */}
                <div className="flex flex-col gap-2">
                  <label className="text-body-md font-semibold text-secondary">SOURCE</label>
                  <select 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md appearance-none">
                    <option>Gandhinagar Depot</option>
                    <option>Ahmedabad Hub</option>
                    <option>Sanand Warehouse</option>
                    <option>Bengaluru DC</option>
                    <option>Mysuru Depot</option>
                  </select>
                </div>
                {/* Destination */}
                <div className="flex flex-col gap-2">
                  <label className="text-body-md font-semibold text-secondary">DESTINATION</label>
                  <select 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md appearance-none">
                    <option>Ahmedabad Hub</option>
                    <option>Gandhinagar Depot</option>
                    <option>Kalol Depot</option>
                    <option>Chennai Hub</option>
                    <option>Hyderabad Hub</option>
                  </select>
                </div>
                {/* Vehicle */}
                <div className="flex flex-col gap-2">
                  <label className="text-body-md font-semibold text-secondary">VEHICLE (AVAILABLE ONLY)</label>
                  <select 
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md appearance-none">
                    <option value="">Select a vehicle...</option>
                    {availableVehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.registrationNo} ({v.maxCapacityKg} kg capacity)</option>
                    ))}
                  </select>
                </div>
                {/* Driver */}
                <div className="flex flex-col gap-2">
                  <label className="text-body-md font-semibold text-secondary">DRIVER (AVAILABLE ONLY)</label>
                  <select 
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md appearance-none">
                    <option value="">Select a driver...</option>
                    {availableDrivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} (License: {d.licenseCategory})</option>
                    ))}
                  </select>
                </div>
                {/* Cargo Weight */}
                <div className="flex flex-col gap-2">
                  <label className="text-body-md font-semibold text-secondary">CARGO WEIGHT (kg)</label>
                  <input 
                    type="number" 
                    value={cargoWeightKg}
                    onChange={(e) => setCargoWeightKg(e.target.value)}
                    className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md" 
                    placeholder="e.g. 700"
                  />
                </div>
                {/* Planned Distance */}
                <div className="flex flex-col gap-2">
                  <label className="text-body-md font-semibold text-secondary">PLANNED DISTANCE (km)</label>
                  <input 
                    type="number" 
                    value={plannedDistanceKm}
                    onChange={(e) => setPlannedDistanceKm(e.target.value)}
                    className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md" 
                    placeholder="e.g. 150"
                  />
                </div>
              </div>
              
              {/* Validation Message Box */}
              {(errorMsg || capacityExceeded) && (
                <div className="p-4 bg-error-container border border-error rounded-lg flex items-start gap-4">
                  <span className="material-symbols-outlined text-error mt-0.5">error</span>
                  <div>
                    <p className="text-body-md font-bold text-on-error-container">
                      {capacityExceeded ? `Capacity exceeded by ${Number(cargoWeightKg) - selectedVehicle.maxCapacityKg} kg` : "Validation Error"}
                    </p>
                    <p className="text-body-md text-on-error-container opacity-80">
                      {errorMsg || "Dispatcher blocked — please reduce load or select a larger vehicle."}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Info Box */}
              {selectedVehicle && !capacityExceeded && (
                <div className="p-4 bg-surface-container-high rounded-lg flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  <div className="text-body-md text-secondary">
                    <p>Vehicle Capacity: <span className="font-bold">{selectedVehicle.maxCapacityKg}</span> kg</p>
                    <p>Cargo Weight: <span className="font-bold">{cargoWeightKg || 0}</span> kg</p>
                    <p>Remaining: <span className="font-bold">{selectedVehicle.maxCapacityKg - Number(cargoWeightKg || 0)}</span> kg</p>
                  </div>
                </div>
              )}
            </div>
            {/* Actions */}
            <div className="p-6 bg-surface-container-low flex items-center justify-end gap-4 border-t border-outline-variant">
              <button 
                onClick={() => { setVehicleId(""); setDriverId(""); setCargoWeightKg(""); setPlannedDistanceKm(""); setErrorMsg(""); }}
                className="px-6 py-2.5 border border-outline text-on-surface font-semibold rounded hover:bg-surface-container transition-all">
                Clear
              </button>
              <ProtectedAction permission={PERMISSIONS.DISPATCH_TRIP} mode="tooltip">
                <button 
                  onClick={handleDispatch}
                  disabled={capacityExceeded || !vehicleId || !driverId || !cargoWeightKg || !plannedDistanceKm}
                  className="px-10 py-2.5 bg-primary text-white font-bold rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  Dispatch
                </button>
              </ProtectedAction>
            </div>
          </section>
          
          {/* Live Board (Right Column) */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border border-outline-variant rounded-lg flex flex-col h-[700px]">
              <div className="p-6 border-b border-outline-variant flex items-center justify-between shrink-0">
                <h2 className="text-headline-md font-bold text-on-surface">Live Board</h2>
                <span 
                  onClick={handleRefresh}
                  className={`material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-all ${isRefreshing ? 'animate-spin text-primary' : ''}`}
                >
                  refresh
                </span>
              </div>
              <div className={`overflow-y-auto flex-1 divide-y divide-outline-variant transition-opacity ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                {trips.length === 0 ? (
                  <div className="p-8 text-center text-secondary">No trips available.</div>
                ) : (
                  trips.map(trip => {
                    const tDriver = drivers.find(d => d.id === trip.driverId);
                    const tVehicle = vehicles.find(v => v.id === trip.vehicleId);
                    
                    return (
                      <div 
                        key={trip.id} 
                        onClick={() => setSelectedTripId(trip.id)}
                        className={`p-6 hover:bg-surface-container-lowest transition-colors group cursor-pointer ${selectedTripId === trip.id ? 'bg-surface-container-low border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-body-lg font-bold text-on-surface uppercase">{trip.id}</p>
                            <p className="text-body-md text-secondary">{trip.source} &rarr; {trip.destination}</p>
                          </div>
                          <span className={`px-3 py-1 text-label-caps rounded-full font-bold ${getStatusStyle(trip.status)}`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[18px]">person</span>
                            <span className="text-body-md font-medium">{tDriver?.name || "Unassigned"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[18px]">local_shipping</span>
                            <span className="text-body-md font-medium">{tVehicle?.registrationNo || "N/A"}</span>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {trip.status === "Dispatched" && (
                              <>
                                <ProtectedAction permission={PERMISSIONS.COMPLETE_TRIP} mode="tooltip">
                                  <button onClick={(e) => { e.stopPropagation(); completeTrip(trip.id); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200" title="Complete Trip">
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                  </button>
                                </ProtectedAction>
                                <ProtectedAction permission={PERMISSIONS.CANCEL_TRIP} mode="tooltip">
                                  <button onClick={(e) => { e.stopPropagation(); cancelTrip(trip.id); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200" title="Cancel Trip">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                  </button>
                                </ProtectedAction>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="p-6 border-t border-outline-variant shrink-0">
                <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-between">
                  <p className="text-label-caps text-secondary uppercase">Quick Flow</p>
                  <p className="text-body-md font-medium text-secondary">Odometer &rarr; Fuel Log &rarr; Expense &rarr; Available</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
