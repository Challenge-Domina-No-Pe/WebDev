import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

// Ícone de menu simples (hamburger)
const MenuIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0  bg-opacity-40"
          onClick={() => setIsMobileOpen(false)}
        />

        <div className="absolute inset-y-0 left-0 w-64 bg-[#7c3fb9] text-white shadow-lg p-4">
          <Sidebar />
        </div>
      </div>

      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 bg-purple-200 rounded-lg text-purple-700 hover:bg-purple-300 transition"
          >
            <MenuIcon />
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
}