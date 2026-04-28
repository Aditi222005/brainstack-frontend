import {
  LayoutDashboard, Sparkles, FileText, Hash, Settings, LogOut,
  Plus, ChevronRight, ChevronLeft, History, PenTool,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProjectModal } from "@/components/dashboard/ProjectModal";
import { BoardModal } from "@/components/dashboard/BoardModal";

interface SidebarProps { collapsed?: boolean; onToggle?: () => void; }

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const s = localStorage.getItem("user");
    if (s) { try { setUser(JSON.parse(s)); } catch { } }
  }, []);

  const handleLogout = async () => {
    try { await fetch("http://localhost:5000/api/auth/logout", { method: "POST", credentials: "include" }); } catch { }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const w = collapsed ? "56px" : "220px";

  return (
    <aside
      style={{
        width: w,
        minWidth: w,
        maxWidth: w,
        transition: "width 0.15s ease",
        height: "100vh",
        position: "relative",
        zIndex: 40,
        background: "#0D1120",
        borderRight: "0.5px solid var(--color-border)",
        color: "var(--color-text)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: collapsed ? "16px 12px" : "16px 14px",
          borderBottom: "0.5px solid var(--color-border)",
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 17,
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
              flex: 1,
            }}
          >
            Brain<span style={{ color: "var(--color-primary)" }}>Stack</span>
          </span>
        )}
        {collapsed && (
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 16,
              color: "var(--color-primary)",
              flex: 1,
              textAlign: "center",
            }}
          >
            B
          </span>
        )}
        <button
          onClick={onToggle}
          title={collapsed ? "Expand" : "Collapse"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-muted)",
            display: "flex",
            alignItems: "center",
            padding: 4,
            borderRadius: "var(--radius-sm)",
            transition: "color 0.2s, background 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-primary)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,111,255,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-muted)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav
        className="custom-scrollbar"
        style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}
      >
        {!collapsed && <SectionLabel>Core</SectionLabel>}
        <SLink to="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" collapsed={collapsed} />
        <SLink to="/ai-board" icon={<Sparkles size={15} />} label="AI Board" collapsed={collapsed} />

        {!collapsed && <SectionLabel>Knowledge</SectionLabel>}
        <SLink to="/thoughts" icon={<FileText size={15} />} label="Thoughts" collapsed={collapsed} />
        <SLink to="/tags" icon={<Hash size={15} />} label="Smart Tags" collapsed={collapsed} />

        {!collapsed && <ProjectsNav />}

        {!collapsed && <SectionLabel>Tools</SectionLabel>}
        <SLink to="/ai-tools" icon={<Sparkles size={15} />} label="AI Content Tools" collapsed={collapsed} />
        <SLink to="/copywriter" icon={<PenTool size={15} />} label="Copywriter" collapsed={collapsed} />
        <SLink to="/history" icon={<History size={15} />} label="History" collapsed={collapsed} />
      </nav>

      {/* Bottom */}
      <div
        style={{
          borderTop: "0.5px solid var(--color-border)",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <SLink to="/settings" icon={<Settings size={15} />} label="Settings" collapsed={collapsed} />

        {/* User tile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            background: "var(--color-surface-2)",
            border: "0.5px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            justifyContent: collapsed ? "center" : undefined,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "rgba(124,111,255,0.2)",
              border: "1px solid rgba(124,111,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              color: "var(--color-primary)",
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--color-text)",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name || "Guest"}
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                    color: "var(--color-muted)",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Pro Plan
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-muted)",
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                  transition: "color 0.2s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
              >
                <LogOut size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "12px 14px 4px" }}>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-muted)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function SLink({ to, icon, label, collapsed }: { to: string; icon: React.ReactNode; label: string; collapsed: boolean }) {
  return (
    <NavLink
      to={to}
      className={`flex items-center gap-2 px-3 py-2 transition-colors ${collapsed ? "justify-center" : ""}`}
      activeClassName="active-nav-link"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        color: "var(--color-muted)",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: collapsed ? "8px 12px" : "7px 14px",
        justifyContent: collapsed ? "center" : undefined,
        borderLeft: "2px solid transparent",
        transition: "color 0.2s, background 0.2s, border-color 0.2s",
      }}
    >
      <span style={{ flexShrink: 0 }}>{icon}</span>
      {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}

      <style>{`
        a[aria-current="page"], .active-nav-link {
          color: var(--color-primary) !important;
          background: rgba(124,111,255,0.08);
          border-left-color: var(--color-primary) !important;
        }
        .active-nav-link:hover {
          color: var(--color-primary) !important;
        }
      `}</style>
    </NavLink>
  );
}

const P_COLORS: Record<string, string> = {
  blue: "#3B82F6", purple: "#A855F7", green: "#10B981",
  yellow: "#F59E0B", red: "#EF4444", cyan: "#06B6D4", pink: "#EC4899",
};

function ProjectsNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);
  const [open, setOpen] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [boardTarget, setBoardTarget] = useState<string | null>(null);
  const [creatingP, setCreatingP] = useState(false);
  const [creatingB, setCreatingB] = useState(false);

  const selectedBoardId = (location.state as any)?.boardId ?? null;
  const selectedProjectId = (location.state as any)?.projectId ?? null;

  const authH = () => {
    const t = localStorage.getItem("token");
    return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
  };

  const load = () => {
    const h = authH();
    fetch("http://localhost:5000/api/projects", { credentials: "include", headers: h })
      .then(r => r.json()).then(d => d.success && setProjects(d.data ?? [])).catch(() => {});
    fetch("http://localhost:5000/api/boards", { credentials: "include", headers: h })
      .then(r => r.json()).then(d => d.success && setBoards(d.data ?? [])).catch(() => {});
  };

  useEffect(() => { load(); }, [location.pathname]);

  const handleCreateProject = async (data: any) => {
    setCreatingP(true);
    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST", credentials: "include", headers: authH(), body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProjects(p => [json.data, ...p]);
        setProjectModalOpen(false);
        navigate(`/projects/${json.data._id}/boards`);
      }
    } catch { } finally { setCreatingP(false); }
  };

  const handleCreateBoard = async (data: any) => {
    if (!boardTarget) return;
    setCreatingB(true);
    try {
      const res = await fetch("http://localhost:5000/api/boards", {
        method: "POST", credentials: "include", headers: authH(),
        body: JSON.stringify({ ...data, projectId: boardTarget }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const proj = projects.find(p => p._id === boardTarget);
        setBoards(b => [json.data, ...b]);
        setBoardModalOpen(false);
        navigate("/ai-board", {
          state: { projectId: boardTarget, boardId: json.data._id, boardContext: { projectName: proj?.name, boardName: json.data.name } },
        });
      }
    } catch { } finally { setCreatingB(false); }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Delete project?")) return;
    const res = await fetch(`http://localhost:5000/api/projects/${id}`, { method: "DELETE", credentials: "include", headers: authH() });
    const json = await res.json();
    if (json.success) { setProjects(p => p.filter(x => x._id !== id)); setBoards(b => b.filter(x => x.projectId !== id)); }
  };

  const handleDeleteBoard = async (id: string) => {
    if (!window.confirm("Delete board?")) return;
    const res = await fetch(`http://localhost:5000/api/boards/${id}`, { method: "DELETE", credentials: "include", headers: authH() });
    const json = await res.json();
    if (json.success) { setBoards(b => b.filter(x => x._id !== id)); }
  };

  if (!projects.length) return null;

  return (
    <div>
      <div style={{ padding: "12px 14px 4px", display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-muted)", flex: 1, transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
        >
          Projects {open ? "▾" : "▸"}
        </button>
        <button
          onClick={() => setProjectModalOpen(true)}
          title="New Project"
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", display: "flex", alignItems: "center", padding: "2px 4px", transition: "background 0.2s", borderRadius: 4 }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,111,255,0.12)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Plus size={12} />
        </button>
      </div>

      {open && (
        <div>
          {projects.map(p => {
            const pBoards = boards.filter(b => b.projectId === p._id);
            const dot = P_COLORS[p.color] ?? "var(--color-primary)";
            const isActiveProject = selectedProjectId === p._id;

            return (
              <div key={p._id}>
                {/* Project row */}
                <div
                  className="group"
                  style={{
                    display: "flex", alignItems: "center", padding: "6px 14px", cursor: "pointer",
                    borderLeft: `2px solid ${isActiveProject ? dot : "transparent"}`,
                    background: isActiveProject ? "rgba(124,111,255,0.06)" : "transparent",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onClick={() => navigate(`/projects/${p._id}/boards`)}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(124,111,255,0.06)";
                    (e.currentTarget as HTMLDivElement).style.borderLeftColor = dot;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = isActiveProject ? "rgba(124,111,255,0.06)" : "transparent";
                    (e.currentTarget as HTMLDivElement).style.borderLeftColor = isActiveProject ? dot : "transparent";
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, display: "inline-block", marginRight: 8, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--color-text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                  {pBoards.length > 0 && (
                    <span style={{ fontSize: 10, color: "var(--color-primary)", background: "rgba(124,111,255,0.12)", borderRadius: 4, padding: "1px 5px", marginRight: 4, flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>
                      {pBoards.length}
                    </span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); setBoardTarget(p._id); setBoardModalOpen(true); }}
                    title="New Board"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", fontSize: 14, padding: "0 2px", opacity: 0, transition: "opacity 0.2s", lineHeight: 1, flexShrink: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                  >
                    +
                  </button>
                  {!p.isDefault && (
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteProject(p._id); }}
                      title="Delete"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 10, padding: "0 2px", opacity: 0, transition: "opacity 0.2s", flexShrink: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Board rows — always visible */}
                {pBoards.map(b => {
                  const isActiveBoard = selectedBoardId === b._id;
                  return (
                    <div
                      key={b._id}
                      className="group"
                      style={{
                        display: "flex", alignItems: "center",
                        paddingLeft: 30, paddingRight: 14, paddingTop: 5, paddingBottom: 5,
                        cursor: "pointer",
                        borderLeft: `2px solid ${isActiveBoard ? dot : "transparent"}`,
                        background: isActiveBoard ? "rgba(124,111,255,0.06)" : "transparent",
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                      onClick={() => navigate("/ai-board", { state: { projectId: p._id, boardId: b._id, boardContext: { projectName: p.name, boardName: b.name } } })}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.background = "rgba(124,111,255,0.06)";
                        (e.currentTarget as HTMLDivElement).style.borderLeftColor = dot;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.background = isActiveBoard ? "rgba(124,111,255,0.06)" : "transparent";
                        (e.currentTarget as HTMLDivElement).style.borderLeftColor = isActiveBoard ? dot : "transparent";
                      }}
                    >
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ marginRight: 7, flexShrink: 0, color: isActiveBoard ? dot : "var(--color-muted)", opacity: 0.7 }}>
                        <rect x="0.5" y="0.5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                        <rect x="2" y="2" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.8" />
                        <rect x="5.5" y="2" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.8" />
                        <rect x="2" y="5.5" width="6" height="2" rx="0.5" fill="currentColor" opacity="0.5" />
                      </svg>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                        color: isActiveBoard ? "var(--color-primary)" : "var(--color-muted)",
                        fontWeight: isActiveBoard ? 600 : 400,
                        flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {b.name}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); handleDeleteBoard(b._id); }}
                        title="Delete board"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 10, padding: "0 2px", opacity: 0, transition: "opacity 0.2s", flexShrink: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                {/* Empty hint */}
                {pBoards.length === 0 && (
                  <div
                    style={{ paddingLeft: 30, paddingRight: 14, paddingTop: 3, paddingBottom: 4, cursor: "pointer" }}
                    onClick={() => { setBoardTarget(p._id); setBoardModalOpen(true); }}
                  >
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "var(--color-muted)", opacity: 0.45, fontStyle: "italic" }}>
                      + add a canvas
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ProjectModal isOpen={projectModalOpen} onClose={() => setProjectModalOpen(false)} onSubmit={handleCreateProject} isLoading={creatingP} />
      <BoardModal isOpen={boardModalOpen} onClose={() => setBoardModalOpen(false)} onSubmit={handleCreateBoard} isLoading={creatingB} />
    </div>
  );
}
