import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { useAppData } from "../context/AppDataContext";

export default function AppLayout() {
  const { user } = useAppData();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Header />
      <Sidebar />
      <main className="ml-[240px] pt-header_height min-h-screen">
        <div className="p-container_padding max-w-7xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
