import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useEffect, useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location.pathname]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-[#0f0a1f] to-black text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-hidden h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
