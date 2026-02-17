import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

export default function Layout() {
  return (
    <div className="flex min-h-screen 
                    bg-gradient-to-br from-black via-[#0f0a1f] to-black text-white">

      <Sidebar />

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
