import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("Fleet Manager");
  const [loading, setLoading] = useState(true);

  // ─── Data fetching ────────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [
      { data: v },
      { data: d },
      { data: t },
      { data: m },
      { data: f },
      { data: e },
    ] = await Promise.all([
      supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
      supabase.from("drivers").select("*").order("created_at", { ascending: false }),
      supabase.from("trips").select("*").order("created_at", { ascending: false }),
      supabase.from("maintenance_logs").select("*").order("service_date", { ascending: false }),
      supabase.from("fuel_logs").select("*, vehicles(registration_no, model), trips(source, destination)").order("date", { ascending: false }),
      supabase.from("expenses").select("*, vehicles(registration_no, model), trips(source, destination)").order("date", { ascending: false }),
    ]);
    // Normalize snake_case → camelCase for compatibility with all pages
    if (v) setVehicles(v.map(normalizeVehicle));
    if (d) setDrivers(d.map(normalizeDriver));
    if (t) setTrips(t.map(normalizeTrip));
    if (m) setMaintenanceLogs(m.map(normalizeMaintenanceLog));
    if (f) setFuelLogs(f);
    if (e) setExpenses(e);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Normalizers (DB snake_case → app camelCase) ──────────────────────────────

  function normalizeVehicle(v) {
    return {
      id: v.id,
      registrationNo: v.registration_no,
      model: v.model,
      type: v.type,
      maxCapacityKg: v.max_capacity_kg,
      odometerKm: v.odometer_km,
      acquisitionCost: v.acquisition_cost,
      status: v.status,
      region: "Region K", // Legacy field for compatibility
    };
  }

  function normalizeDriver(d) {
    return {
      id: d.id,
      name: d.name,
      licenseNo: d.license_no,
      licenseCategory: d.license_category,
      licenseExpiry: d.license_expiry,
      contactNo: d.contact_no,
      safetyScore: d.safety_score,
      status: d.status,
    };
  }

  function normalizeTrip(t) {
    return {
      id: t.id,
      source: t.source,
      destination: t.destination,
      vehicleId: t.vehicle_id,
      driverId: t.driver_id,
      cargoWeightKg: t.cargo_weight_kg,
      plannedDistanceKm: t.planned_distance_km,
      status: t.status,
      createdAt: t.created_at?.slice(0, 10),
      dispatchedAt: t.dispatched_at?.slice(0, 10),
      completedAt: t.completed_at?.slice(0, 10),
    };
  }

  function normalizeMaintenanceLog(m) {
    return {
      id: m.id,
      vehicleId: m.vehicle_id,
      serviceType: m.service_type,
      cost: m.cost,
      serviceDate: m.service_date,
      status: m.status,
      notes: m.notes ?? "",
    };
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────────

  const signIn = async (selectedRole, email, password) => {
    // Try Supabase auth; fall back to demo mode if not configured
    if (supabase && email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        setUser({ id: data.user.id, name: data.user.email, email: data.user.email, role: selectedRole, region: "Region K" });
        if (selectedRole) setRole(selectedRole);
        return { ok: true };
      }
    }
    // Demo / offline mode
    setUser({ id: "demo", name: "Demo User", email: "demo@transitops.io", role: selectedRole, region: "Region K" });
    if (selectedRole) setRole(selectedRole);
    return { ok: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ─── Vehicles ─────────────────────────────────────────────────────────────────

  const addVehicle = async (vehicle) => {
    const { data, error } = await supabase.from("vehicles").insert([{
      registration_no: vehicle.registrationNo,
      model: vehicle.model,
      type: vehicle.type,
      max_capacity_kg: vehicle.maxCapacityKg,
      odometer_km: vehicle.odometerKm ?? 0,
      acquisition_cost: vehicle.acquisitionCost ?? 0,
      status: "Available",
      region: vehicle.region ?? "Region K", // Legacy field
    }]).select().single();
    if (!error && data) setVehicles((prev) => [normalizeVehicle(data), ...prev]);
    return { ok: !error, error };
  };

  const updateVehicleStatus = async (id, status) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    await supabase.from("vehicles").update({ status }).eq("id", id);
  };

  // ─── Drivers ─────────────────────────────────────────────────────────────────

  const addDriver = async (driver) => {
    const { data, error } = await supabase.from("drivers").insert([{
      name: driver.name,
      license_no: driver.licenseNo,
      license_category: driver.licenseCategory,
      license_expiry: driver.licenseExpiry,
      contact_no: driver.contactNo,
      safety_score: driver.safetyScore ?? 100,
      status: "Available",
    }]).select().single();
    if (!error && data) setDrivers((prev) => [normalizeDriver(data), ...prev]);
    return { ok: !error, error };
  };

  const updateDriverStatus = async (id, status) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    await supabase.from("drivers").update({ status }).eq("id", id);
  };

  // ─── Trips ────────────────────────────────────────────────────────────────────

  const dispatchTrip = async (tripDraft) => {
    const vehicle = vehicles.find((v) => v.id === tripDraft.vehicleId);
    const driver = drivers.find((d) => d.id === tripDraft.driverId);
    if (!vehicle || vehicle.status !== "Available") return { ok: false, reason: "Vehicle is not available." };
    if (!driver || driver.status !== "Available") return { ok: false, reason: "Driver is not available." };
    if (new Date(driver.licenseExpiry) < new Date()) return { ok: false, reason: "Driver license has expired." };
    if (tripDraft.cargoWeightKg > vehicle.maxCapacityKg) return { ok: false, reason: "Cargo weight exceeds vehicle capacity." };

    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase.from("trips").insert([{
      source: tripDraft.source,
      destination: tripDraft.destination,
      vehicle_id: tripDraft.vehicleId,
      driver_id: tripDraft.driverId,
      cargo_weight_kg: tripDraft.cargoWeightKg,
      planned_distance_km: tripDraft.plannedDistanceKm,
      status: "Dispatched",
      dispatched_at: today,
    }]).select().single();

    if (error) return { ok: false, reason: error.message };
    const trip = normalizeTrip(data);
    setTrips((prev) => [trip, ...prev]);
    await updateVehicleStatus(vehicle.id, "On Trip");
    await updateDriverStatus(driver.id, "On Trip");
    return { ok: true, trip };
  };

  const completeTrip = async (tripId) => {
    const today = new Date().toISOString().slice(0, 10);
    setTrips((prev) => prev.map((t) => t.id === tripId ? { ...t, status: "Completed", completedAt: today } : t));
    await supabase.from("trips").update({ status: "Completed", completed_at: today }).eq("id", tripId);
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      await updateVehicleStatus(trip.vehicleId, "Available");
      await updateDriverStatus(trip.driverId, "Available");
    }
  };

  const cancelTrip = async (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status: "Cancelled" } : t)));
    await supabase.from("trips").update({ status: "Cancelled" }).eq("id", tripId);
    if (trip) {
      await updateVehicleStatus(trip.vehicleId, "Available");
      await updateDriverStatus(trip.driverId, "Available");
    }
  };

  // ─── Maintenance ──────────────────────────────────────────────────────────────

  const addMaintenanceLog = async (log) => {
    const { data, error } = await supabase.from("maintenance_logs").insert([{
      vehicle_id: log.vehicleId,
      service_type: log.serviceType,
      cost: log.cost,
      service_date: log.serviceDate,
      status: "Active",
      notes: log.notes ?? "",
    }]).select().single();
    if (!error && data) {
      setMaintenanceLogs((prev) => [normalizeMaintenanceLog(data), ...prev]);
      await updateVehicleStatus(log.vehicleId, "In Shop");
    }
    return { ok: !error, error };
  };

  const completeMaintenanceLog = async (logId) => {
    setMaintenanceLogs((prev) => prev.map((l) => (l.id === logId ? { ...l, status: "Completed" } : l)));
    await supabase.from("maintenance_logs").update({ status: "Completed" }).eq("id", logId);
    const log = maintenanceLogs.find((l) => l.id === logId);
    if (log) await updateVehicleStatus(log.vehicleId, "Available");
  };

  // ─── Fuel & Expenses (managed by FuelExpenses page directly via supabase) ────
  // These are kept in context for cross-page stats (Dashboard, etc.)

  const addFuelLog = async (log) => {
    const { data, error } = await supabase.from("fuel_logs").insert([{
      vehicle_id: log.vehicleId,
      trip_id: log.tripId ?? null,
      liters: log.liters,
      cost: log.cost,
      date: log.date,
      status: log.status ?? "Pending Review",
    }]).select().single();
    if (!error && data) setFuelLogs((prev) => [data, ...prev]);
    return { ok: !error, error };
  };

  const addExpense = async (exp) => {
    const { data, error } = await supabase.from("expenses").insert([{
      vehicle_id: exp.vehicleId,
      trip_id: exp.tripId ?? null,
      type: exp.type,
      amount: exp.amount,
      date: exp.date,
      notes: exp.notes ?? null,
    }]).select().single();
    if (!error && data) setExpenses((prev) => [data, ...prev]);
    return { ok: !error, error };
  };

  // ─── Context value ────────────────────────────────────────────────────────────

  const value = useMemo(
    () => ({
      user, role, loading,
      signIn, signOut, setRole,
      vehicles, drivers, trips, maintenanceLogs, fuelLogs, expenses,
      addVehicle, updateVehicleStatus,
      addDriver, updateDriverStatus,
      dispatchTrip, completeTrip, cancelTrip,
      addMaintenanceLog, completeMaintenanceLog,
      addFuelLog, addExpense,
      refreshAll: fetchAll,
    }),
    [user, role, loading, vehicles, drivers, trips, maintenanceLogs, fuelLogs, expenses]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
