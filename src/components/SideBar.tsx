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
  LogOut,
  User
} from "lucide-react";

import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) { }
    }
  }, []);

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
    <aside className="h-screen w-64 relative z-40
                      bg-sidebar-background/95 backdrop-blur-xl
                      border-r border-sidebar-border shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]
                      text-sidebar-foreground flex flex-col transition-all duration-300">

      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
          <img src="/favicon.png" alt="BrainStack" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary leading-none">
            BrainStack
          </h1>
          <span className="text-[10px] text-sidebar-muted font-semibold tracking-widest uppercase mt-1 opacity-70">Intelligence</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-6 overflow-y-auto custom-scrollbar pb-6">

        <div>
          <SectionHeader label="Core" />
          <div className="space-y-1">
            <SidebarLink to="/ai-board" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarLink to="/visual-board" icon={<Sparkles size={18} />} label="AI Visual Board" />
          </div>
        </div>

        <div>
          <SectionHeader label="Knowledge" />
          <div className="space-y-1">
            <SidebarLink to="/thoughts" icon={<FileText size={18} />} label="Thoughts" />
            <SidebarLink to="/projects" icon={<Folder size={18} />} label="Projects" />
            <SidebarLink to="/tags" icon={<Hash size={18} />} label="Smart Tags" />
          </div>
        </div>

        <div>
          <SectionHeader label="Tools" />
          <div className="space-y-1">
            <SidebarLink to="/copywriter" icon={<PenTool size={18} />} label="AI Copywriter" />
            <SidebarLink to="/history" icon={<History size={18} />} label="Chat History" />
          </div>
        </div>

      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-2 bg-sidebar-background/50">
        <ThemeToggle />
        <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />

        {/* User Profile */}
        <div className="mt-4 px-3 py-3 rounded-xl bg-sidebar-foreground/5 border border-sidebar-border flex items-center gap-3 group transition-all hover:bg-sidebar-foreground/10 hover:border-sidebar-border/80">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs ring-2 ring-background shadow-md">
            {user?.name?.[0] || <User size={14} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-sidebar-foreground">{user?.name || "Guest User"}</p>
            <p className="text-[10px] text-sidebar-muted truncate">Professional Plan</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-sidebar-muted transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 mb-3">
      <h3 className="text-[10px] font-bold text-sidebar-muted uppercase tracking-[0.15em] whitespace-nowrap">
        {label}
      </h3>
      <div className="h-px flex-1 bg-gradient-to-r from-sidebar-border to-transparent" />
    </div>
  );
}

function SidebarLink({ to, icon, label }: any) {
  return (
    <NavLink
      to={to}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl relative group
                 text-sidebar-foreground/70 text-sm font-medium border border-transparent
                 hover:bg-primary/5 
                 hover:text-primary
                 transition-all duration-200"
      activeClassName="bg-primary/10 border-primary/20 !text-primary shadow-[0_4px_15px_hsl(var(--primary)/0.08)] active-link"
    >
      <span className="relative z-10 transition-transform group-hover:scale-110 duration-200 group-[.active-link]:scale-110">{icon}</span>
      <span className="relative z-10">{label}</span>

      {/* Active Indicator Bar */}
      <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary opacity-0 scale-y-0 transition-transform duration-300 group-[.active-link]:scale-y-100 group-[.active-link]:opacity-100 shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
    </NavLink>
  );
}
