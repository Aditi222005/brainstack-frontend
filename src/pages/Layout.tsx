import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useEffect, useState } from "react";
import { useSilentRefresh } from "@/hooks/useSilentRefresh";

export default function Layout() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useSilentRefresh();

  useEffect(() => { setIsAuthenticated(!!localStorage.getItem("token")); }, [location.pathname]);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setSidebarCollapsed(true);
  }, []);

  const handleToggle = () => {
    setSidebarCollapsed(prev => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  if (isAuthenticated === null) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggle} />
      <main style={{ flex: 1, overflowY: "auto", height: "100vh", display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
