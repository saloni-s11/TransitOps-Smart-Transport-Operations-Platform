// Mock/dummy data standing in for the Supabase backend described in supabase_schema.txt
// Shapes loosely follow: vehicles, drivers, trips, maintenance_logs, fuel_logs, expenses, users/roles

export const roles = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"];

export const currentUser = {
  id: "u-1001",
  name: "Dispenser RX",
  email: "manager@transitops.io",
  role: "Fleet Manager",
  region: "Region K",
};

export const vehicles = [
  { id: "v-1", registrationNo: "KA-01-AB-1234", model: "Tata Ultra 1918", type: "Truck", maxCapacityKg: 9000, odometerKm: 84210, acquisitionCost: 3200000, status: "Available", region: "Region K" },
  { id: "v-2", registrationNo: "KA-02-CD-5566", model: "Ashok Leyland Dost", type: "Van", maxCapacityKg: 1500, odometerKm: 32110, acquisitionCost: 950000, status: "On Trip", region: "Region K" },
  { id: "v-3", registrationNo: "KA-03-EF-7788", model: "Eicher Pro 3015", type: "Truck", maxCapacityKg: 5500, odometerKm: 121340, acquisitionCost: 2450000, status: "In Shop", region: "Region B" },
  { id: "v-4", registrationNo: "KA-04-GH-9900", model: "Mahindra Bolero Pickup", type: "Van", maxCapacityKg: 1200, odometerKm: 55210, acquisitionCost: 780000, status: "Available", region: "Region Z" },
  { id: "v-5", registrationNo: "KA-05-IJ-2233", model: "BharatBenz 1617R", type: "Special", maxCapacityKg: 8000, odometerKm: 44210, acquisitionCost: 3600000, status: "On Trip", region: "Region K" },
  { id: "v-6", registrationNo: "KA-06-KL-4455", model: "Tata Ace Gold", type: "Van", maxCapacityKg: 750, odometerKm: 19340, acquisitionCost: 520000, status: "Retired", region: "Region B" },
  { id: "v-7", registrationNo: "KA-07-MN-6677", model: "Volvo FMX 400", type: "Truck", maxCapacityKg: 12000, odometerKm: 68210, acquisitionCost: 5200000, status: "Available", region: "Region K" },
];

export const drivers = [
  { id: "d-1", name: "Arjun Mehta", licenseNo: "DL-0420110012345", licenseCategory: "HMV", licenseExpiry: "2027-03-14", contactNo: "+91 98765 43210", safetyScore: 96, status: "Available" },
  { id: "d-2", name: "Priya Nair", licenseNo: "DL-0420110023456", licenseCategory: "LMV", licenseExpiry: "2026-11-02", contactNo: "+91 98765 43211", safetyScore: 88, status: "On Trip" },
  { id: "d-3", name: "Ramesh Iyer", licenseNo: "DL-0420110034567", licenseCategory: "HMV", licenseExpiry: "2026-08-20", contactNo: "+91 98765 43212", safetyScore: 74, status: "Suspended" },
  { id: "d-4", name: "Sana Sheikh", licenseNo: "DL-0420110045678", licenseCategory: "HMV", licenseExpiry: "2028-01-09", contactNo: "+91 98765 43213", safetyScore: 99, status: "Available" },
  { id: "d-5", name: "Vikram Rao", licenseNo: "DL-0420110056789", licenseCategory: "LMV", licenseExpiry: "2026-09-30", contactNo: "+91 98765 43214", safetyScore: 81, status: "Off Duty" },
  { id: "d-6", name: "Neha Kulkarni", licenseNo: "DL-0420110067890", licenseCategory: "HMV", licenseExpiry: "2027-05-17", contactNo: "+91 98765 43215", safetyScore: 91, status: "On Trip" },
];

export const trips = [
  { id: "t-1", source: "Bengaluru DC", destination: "Chennai Hub", vehicleId: "v-2", driverId: "d-2", cargoWeightKg: 1200, plannedDistanceKm: 350, status: "Dispatched", createdAt: "2026-07-10", dispatchedAt: "2026-07-10" },
  { id: "t-2", source: "Bengaluru DC", destination: "Hyderabad Hub", vehicleId: "v-5", driverId: "d-6", cargoWeightKg: 6200, plannedDistanceKm: 570, status: "Dispatched", createdAt: "2026-07-11", dispatchedAt: "2026-07-11" },
  { id: "t-3", source: "Mysuru Depot", destination: "Bengaluru DC", vehicleId: "v-1", driverId: "d-1", cargoWeightKg: 7800, plannedDistanceKm: 145, status: "Completed", createdAt: "2026-07-08", dispatchedAt: "2026-07-08", completedAt: "2026-07-08" },
  { id: "t-4", source: "Bengaluru DC", destination: "Coimbatore Hub", vehicleId: "v-4", driverId: "d-5", cargoWeightKg: 900, plannedDistanceKm: 365, status: "Draft" },
  { id: "t-5", source: "Bengaluru DC", destination: "Pune Hub", vehicleId: "v-7", driverId: "d-4", cargoWeightKg: 11000, plannedDistanceKm: 840, status: "Cancelled", createdAt: "2026-07-05" },
];

export const maintenanceLogs = [
  { id: "m-1", vehicleId: "v-3", serviceType: "Engine Overhaul", cost: 45000, serviceDate: "2026-07-09", status: "Active", notes: "Awaiting parts delivery" },
  { id: "m-2", vehicleId: "v-1", serviceType: "Brake Inspection", cost: 3200, serviceDate: "2026-06-28", status: "Completed", notes: "Passed inspection" },
  { id: "m-3", vehicleId: "v-6", serviceType: "Decommission Check", cost: 0, serviceDate: "2026-05-15", status: "Completed", notes: "Vehicle retired from fleet" },
  { id: "m-4", vehicleId: "v-7", serviceType: "Tyre Replacement", cost: 18500, serviceDate: "2026-07-01", status: "Completed", notes: "All 6 tyres replaced" },
];

export const fuelLogs = [
  { id: "f-1", vehicleId: "v-2", tripId: "t-1", liters: 42.5, cost: 4250, date: "2026-07-10" },
  { id: "f-2", vehicleId: "v-5", tripId: "t-2", liters: 96.2, cost: 9620, date: "2026-07-11" },
  { id: "f-3", vehicleId: "v-1", tripId: "t-3", liters: 28.4, cost: 2840, date: "2026-07-08" },
];

export const expenses = [
  { id: "e-1", vehicleId: "v-2", tripId: "t-1", type: "Toll", amount: 850, date: "2026-07-10" },
  { id: "e-2", vehicleId: "v-5", tripId: "t-2", type: "Toll", amount: 1620, date: "2026-07-11" },
  { id: "e-3", vehicleId: "v-1", tripId: "t-3", type: "Misc", amount: 300, date: "2026-07-08" },
];
