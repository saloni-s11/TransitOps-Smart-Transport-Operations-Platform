import { createContext, useContext, useMemo, useState } from "react";
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
  const [vehicles, setVehicles] = useState(seedVehicles);
  const [drivers, setDrivers] = useState(seedDrivers);
  const [trips, setTrips] = useState(seedTrips);
  const [maintenanceLogs, setMaintenanceLogs] = useState(seedMaintenanceLogs);
  const [fuelLogs, setFuelLogs] = useState(seedFuelLogs);
  const [expenses, setExpenses] = useState(seedExpenses);
  const [user, setUser] = useState(null); // null until "signed in"
  const [role, setRole] = useState(seedUser.role);

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

  const addMaintenanceLog = (log) =>
    setMaintenanceLogs((prev) => [{ id: nextId("m"), status: "Active", ...log }, ...prev]);

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
