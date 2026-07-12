import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  vehicles as seedVehicles,
  drivers as seedDrivers,
  trips as seedTrips,
  maintenanceLogs as seedMaintenanceLogs,
  fuelLogs as seedFuelLogs,
  expenses as seedExpenses,
  currentUser as seedUser,
} from "../data/mockData";

const AppDataContext = createContext(null);

let idCounter = 1000;
const nextId = (prefix) => `${prefix}-${idCounter++}`;

export function AppDataProvider({ children }) {
  // Initialize from localStorage or fallback to seed data
  const loadInitialData = (key, seedData) => {
    const saved = localStorage.getItem(`transitops_${key}`);
    return saved ? JSON.parse(saved) : seedData;
  };

  const [vehicles, setVehicles] = useState(() => loadInitialData('vehicles', seedVehicles));
  const [drivers, setDrivers] = useState(() => loadInitialData('drivers', seedDrivers));
  const [trips, setTrips] = useState(() => loadInitialData('trips', seedTrips));
  const [maintenanceLogs, setMaintenanceLogs] = useState(() => loadInitialData('maintenanceLogs', seedMaintenanceLogs));
  const [fuelLogs, setFuelLogs] = useState(() => loadInitialData('fuelLogs', seedFuelLogs));
  const [expenses, setExpenses] = useState(() => loadInitialData('expenses', seedExpenses));
  const [user, setUser] = useState(null); // null until "signed in"
  const [role, setRole] = useState(seedUser.role);

  // Persistence hooks
  useEffect(() => { localStorage.setItem('transitops_vehicles', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('transitops_drivers', JSON.stringify(drivers)); }, [drivers]);
  useEffect(() => { localStorage.setItem('transitops_trips', JSON.stringify(trips)); }, [trips]);
  useEffect(() => { localStorage.setItem('transitops_maintenanceLogs', JSON.stringify(maintenanceLogs)); }, [maintenanceLogs]);
  useEffect(() => { localStorage.setItem('transitops_fuelLogs', JSON.stringify(fuelLogs)); }, [fuelLogs]);
  useEffect(() => { localStorage.setItem('transitops_expenses', JSON.stringify(expenses)); }, [expenses]);

  const signIn = (selectedRole) => {
    setUser(seedUser);
    if (selectedRole) setRole(selectedRole);
  };
  const signOut = () => setUser(null);

  const addVehicle = (vehicle) =>
    setVehicles((prev) => [...prev, { id: nextId("v"), status: "Available", ...vehicle }]);

  const updateVehicleStatus = (id, status) =>
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));

  const addDriver = (driver) =>
    setDrivers((prev) => [...prev, { id: nextId("d"), status: "Available", safetyScore: 100, ...driver }]);

  const updateDriverStatus = (id, status) =>
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));

  // Dispatch validation mirrors the pseudo-code business rule in supabase_schema.txt:
  // vehicle must be Available, driver must be Available, license not expired, cargo <= capacity.
  const dispatchTrip = (tripDraft) => {
    const vehicle = vehicles.find((v) => v.id === tripDraft.vehicleId);
    const driver = drivers.find((d) => d.id === tripDraft.driverId);
    if (!vehicle || vehicle.status !== "Available") return { ok: false, reason: "Vehicle is not available." };
    if (!driver || driver.status !== "Available") return { ok: false, reason: "Driver is not available." };
    if (new Date(driver.licenseExpiry) < new Date()) return { ok: false, reason: "Driver license has expired." };
    if (tripDraft.cargoWeightKg > vehicle.maxCapacityKg)
      return { ok: false, reason: "Cargo weight exceeds vehicle capacity." };

    const trip = {
      id: nextId("t"),
      status: "Dispatched",
      createdAt: new Date().toISOString().slice(0, 10),
      dispatchedAt: new Date().toISOString().slice(0, 10),
      ...tripDraft,
    };
    setTrips((prev) => [trip, ...prev]);
    updateVehicleStatus(vehicle.id, "On Trip");
    updateDriverStatus(driver.id, "On Trip");
    return { ok: true, trip };
  };

  const completeTrip = (tripId) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? { ...t, status: "Completed", completedAt: new Date().toISOString().slice(0, 10) } : t
      )
    );
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      updateVehicleStatus(trip.vehicleId, "Available");
      updateDriverStatus(trip.driverId, "Available");
    }
  };

  const cancelTrip = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status: "Cancelled" } : t)));
    if (trip) {
      updateVehicleStatus(trip.vehicleId, "Available");
      updateDriverStatus(trip.driverId, "Available");
    }
  };

  const addMaintenanceLog = (log) => {
    setMaintenanceLogs((prev) => [{ id: nextId("m"), status: "Active", ...log }, ...prev]);
    updateVehicleStatus(log.vehicleId, "In Shop");
  };

  const completeMaintenanceLog = (logId) => {
    setMaintenanceLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, status: "Completed" } : l))
    );
    const log = maintenanceLogs.find((l) => l.id === logId);
    if (log) {
      updateVehicleStatus(log.vehicleId, "Available");
    }
  };

  const addFuelLog = (log) => setFuelLogs((prev) => [{ id: nextId("f"), ...log }, ...prev]);
  const addExpense = (exp) => setExpenses((prev) => [{ id: nextId("e"), ...exp }, ...prev]);

  const value = useMemo(
    () => ({
      user,
      role,
      signIn,
      signOut,
      setRole,
      vehicles,
      drivers,
      trips,
      maintenanceLogs,
      fuelLogs,
      expenses,
      addVehicle,
      updateVehicleStatus,
      addDriver,
      updateDriverStatus,
      dispatchTrip,
      completeTrip,
      cancelTrip,
      addMaintenanceLog,
      completeMaintenanceLog,
      addFuelLog,
      addExpense,
    }),
    [user, role, vehicles, drivers, trips, maintenanceLogs, fuelLogs, expenses]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
