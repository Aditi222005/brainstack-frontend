import {
  Brain,
  LayoutDashboard,
  Sparkles,
  FileText,
  Folder,
  History,
  Hash,
  PenTool,
  Settings,
  LogOut
} from "lucide-react";

import { NavLink } from "@/components/NavLink";

import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 
                      bg-gradient-to-b from-black via-[#0f0a1f] to-black
                      border-r border-purple-500/20 
                      text-gray-300 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-purple-500/20">
        <Brain className="text-purple-500" size={28} />
        <h1 className="text-xl font-semibold text-white">SecondBrain</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <SidebarLink to="/ai-board" icon={<Sparkles size={18} />} label="AI Visual Board" />
        <SidebarLink to="/thoughts" icon={<FileText size={18} />} label="Thoughts" />
        <SidebarLink to="/projects" icon={<Folder size={18} />} label="Projects" />
        <SidebarLink to="/tags" icon={<Hash size={18} />} label="Smart Tags" />
        <SidebarLink to="/copywriter" icon={<PenTool size={18} />} label="AI Copywriter" />
        <SidebarLink to="/history" icon={<History size={18} />} label="Chat History" />

      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-purple-500/20 space-y-2">
        <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition duration-300 text-left"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}


function SidebarLink({ to, icon, label }: any) {
  return (
    <NavLink
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded-lg
                 hover:bg-purple-600/20 
                 hover:text-purple-400
                 transition duration-300"
      activeClassName="bg-purple-600/20 text-purple-400"
    >
      {icon}
      {label}
    </NavLink>
  );
}
