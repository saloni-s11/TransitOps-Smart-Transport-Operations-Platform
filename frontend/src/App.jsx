import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppDataProvider } from "./context/AppDataContext";
import { useAppData } from "./context/AppDataContext";
import { canAccessRoute, getDefaultRoute } from "./lib/permissions";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import Drivers from "./pages/Drivers";
import AddDriver from "./pages/AddDriver";
import Trips from "./pages/Trips";
import Maintenance from "./pages/Maintenance";
import FuelExpenses from "./pages/FuelExpenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Support from "./pages/Support";

/**
 * Wraps a route element so it redirects to the role's default page
 * when the current user doesn't have permission to access it.
 */
function RequirePermission({ children }) {
  const { role } = useAppData();
  const location = useLocation();

  // Normalize pathname — strip trailing slashes, keep /vehicles/add intact
  const path = location.pathname.replace(/\/$/, '') || '/';

  if (!canAccessRoute(role, path)) {
    return <Navigate to={getDefaultRoute(role)} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard"     element={<RequirePermission><Dashboard /></RequirePermission>} />
            <Route path="/vehicles"      element={<RequirePermission><Vehicles /></RequirePermission>} />
            <Route path="/vehicles/add"  element={<RequirePermission><AddVehicle /></RequirePermission>} />
            <Route path="/drivers"       element={<RequirePermission><Drivers /></RequirePermission>} />
            <Route path="/drivers/add"   element={<RequirePermission><AddDriver /></RequirePermission>} />
            <Route path="/trips"         element={<RequirePermission><Trips /></RequirePermission>} />
            <Route path="/maintenance"   element={<RequirePermission><Maintenance /></RequirePermission>} />
            <Route path="/fuel-expenses" element={<RequirePermission><FuelExpenses /></RequirePermission>} />
            <Route path="/reports"       element={<RequirePermission><Reports /></RequirePermission>} />
            <Route path="/settings"      element={<RequirePermission><Settings /></RequirePermission>} />
            <Route path="/support"       element={<Support />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}
