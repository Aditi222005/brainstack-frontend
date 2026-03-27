import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useEffect, useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location.pathname]);

  // Still loading auth state
  if (isAuthenticated === null) {
    return null;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-8 overflow-hidden h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
