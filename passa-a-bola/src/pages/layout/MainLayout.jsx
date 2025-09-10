import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex bg-white">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}