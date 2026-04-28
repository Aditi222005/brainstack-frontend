import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BoardModal } from "@/components/dashboard/BoardModal";
import { Plus, LayoutDashboard, Trash2, ArrowUpRight, Layers, Calendar, ArrowLeft, Lightbulb } from "lucide-react";

const API = "http://localhost:5000/api";

function authHdr(): Record<string, string> {
  const t = localStorage.getItem("token");
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

interface Board {
  _id: string;
  name: string;
  description?: string;
  projectId: string;
  createdAt: string;
}

interface Project {
  _id: string;
  name: string;
  color: string;
  description?: string;
}

const COLOR_HEX: Record<string, string> = {
  blue: "#00D2C8", purple: "#7C6FFF", green: "#10B981",
  yellow: "#F59E0B", red: "#EF4444", cyan: "#00D2C8", pink: "#EC4899",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ProjectBoards() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [pr, br] = await Promise.all([
        fetch(`${API}/projects/${projectId}`, { credentials: "include", headers: authHdr() }),
        fetch(`${API}/boards?projectId=${projectId}`, { credentials: "include", headers: authHdr() }),
      ]);
      const [pj, bj] = await Promise.all([pr.json(), br.json()]);
      if (pj.success) setProject(pj.data);
      if (bj.success) setBoards(bj.data ?? []);
    } catch { }
    finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreateBoard = async (data: { name: string; description: string }) => {
    if (!projectId) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/boards`, {
        method: "POST", credentials: "include", headers: authHdr(),
        body: JSON.stringify({ ...data, projectId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBoards(prev => [json.data, ...prev]);
        setBoardModalOpen(false);
      }
    } catch { }
    finally { setCreating(false); }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm("Delete this board and all its ideas?")) return;
    try {
      await fetch(`${API}/boards/${boardId}`, { method: "DELETE", credentials: "include", headers: authHdr() });
      setBoards(prev => prev.filter(b => b._id !== boardId));
    } catch { }
  };

  const openBoard = (board: Board) => {
    navigate("/ai-board", {
      state: {
        boardId: board._id,
        projectId,
        boardContext: { boardName: board.name, projectName: project?.name },
      },
    });
  };

  const openProjectCanvas = () => {
    navigate("/ai-board", {
      state: {
        projectId,
        boardContext: { projectName: project?.name },
      },
    });
  };

  const dot = COLOR_HEX[project?.color ?? "blue"] ?? "#7C6FFF";

  return (
    <div style={{ minHeight: "100vh", background: "var(--dash-bg)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "24px 40px", background: "var(--dash-surface)",
        borderBottom: "1px solid var(--dash-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "var(--dash-surface-2)",
              border: "1px solid var(--dash-border)", borderRadius: 10, padding: "8px 14px",
              color: "var(--dash-text-mid)", cursor: "pointer", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--dash-text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--dash-text-mid)"; }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} /> Dashboard
          </button>
          <div style={{ width: 1, height: 28, background: "var(--dash-border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: dot }} />
            <div>
              <h1 style={{
                fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700,
                color: "var(--dash-text)", margin: 0,
              }}>
                {loading ? "Loading…" : project?.name ?? "Project"}
              </h1>
              {project?.description && (
                <p style={{ fontSize: 13, color: "var(--dash-text-mid)", margin: "2px 0 0" }}>
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={openProjectCanvas}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--dash-surface-2)", border: "1.5px solid var(--dash-border)",
              color: "var(--dash-text-mid)", borderRadius: 99, padding: "10px 20px",
              fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = dot; (e.currentTarget as HTMLButtonElement).style.color = dot; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--dash-border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--dash-text-mid)"; }}
          >
            <Lightbulb style={{ width: 15, height: 15 }} /> All Ideas Canvas
          </button>
          <button
            onClick={() => setBoardModalOpen(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--dash-purple)", color: "#fff", border: "none",
              borderRadius: 99, padding: "10px 20px",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(124,111,255,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(124,111,255,0.5)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(124,111,255,0.35)"; }}
          >
            <Plus style={{ width: 15, height: 15 }} /> New Board
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: "36px 40px" }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <Layers style={{ width: 16, height: 16, color: "var(--dash-text-muted)" }} />
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--dash-text-muted)" }}>
            {boards.length} {boards.length === 1 ? "Board" : "Boards"}
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--dash-border)" }} />
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 180, borderRadius: 18,
                background: "linear-gradient(90deg, var(--dash-surface-2) 25%, var(--dash-border) 50%, var(--dash-surface-2) 75%)",
                backgroundSize: "200% 100%", animation: "shimmerSlide 1.6s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", gap: 14 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20, marginBottom: 4,
              background: "rgba(124,111,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <LayoutDashboard style={{ width: 32, height: 32, color: "var(--dash-purple)" }} />
            </div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 20, color: "var(--dash-text)", margin: 0 }}>No boards yet</h2>
            <p style={{ fontSize: 14, color: "var(--dash-text-muted)", margin: 0, textAlign: "center", maxWidth: 320 }}>
              Create a board to organize your ideas visually on a dedicated canvas.
            </p>
            <button
              onClick={() => setBoardModalOpen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--dash-purple)", color: "#fff", border: "none",
                borderRadius: 99, padding: "12px 26px", fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(124,111,255,0.3)", marginTop: 8,
              }}
            >
              <Plus style={{ width: 15, height: 15 }} /> Create First Board
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            <AnimatePresence>
              {boards.map((board, i) => (
                <motion.div
                  key={board._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  whileHover={{ y: -4, scale: 1.015 }}
                  onClick={() => openBoard(board)}
                  className="group"
                  style={{
                    background: "var(--dash-surface)",
                    border: `1px solid var(--dash-border)`,
                    borderLeft: `3px solid ${dot}`,
                    borderRadius: 16,
                    padding: "22px 24px",
                    cursor: "pointer",
                    transition: "box-shadow 0.25s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px ${dot}33`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  {/* Glow accent */}
                  <div style={{
                    position: "absolute", top: -30, right: -30, width: 120, height: 120,
                    borderRadius: "50%", background: `${dot}08`, pointerEvents: "none",
                  }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Icon + Name */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: `${dot}14`, display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <LayoutDashboard style={{ width: 16, height: 16, color: dot }} />
                        </div>
                        <h3 style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 16,
                          color: "var(--dash-text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {board.name}
                        </h3>
                      </div>

                      {/* Action buttons (shown on hover via className) */}
                      <div style={{ display: "flex", gap: 6, opacity: 0, transition: "opacity 0.2s" }} className="group-hover:!opacity-100">
                        <button
                          onClick={e => { e.stopPropagation(); openBoard(board); }}
                          title="Open board"
                          style={{
                            width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer",
                            background: `${dot}18`, color: dot, display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <ArrowUpRight style={{ width: 13, height: 13 }} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteBoard(board._id); }}
                          title="Delete board"
                          style={{
                            width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(239,68,68,0.25)", cursor: "pointer",
                            background: "var(--dash-red-soft)", color: "var(--dash-red)", display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <Trash2 style={{ width: 12, height: 12 }} />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    {board.description && (
                      <p style={{
                        fontSize: 13, color: "var(--dash-text-mid)", lineHeight: 1.55,
                        margin: "0 0 14px",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden",
                      }}>
                        {board.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                      <Calendar style={{ width: 11, height: 11, color: "var(--dash-text-muted)" }} />
                      <span style={{ fontSize: 11, color: "var(--dash-text-muted)" }}>{formatDate(board.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <style>{`
        @keyframes shimmerSlide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <BoardModal
        isOpen={boardModalOpen}
        onClose={() => setBoardModalOpen(false)}
        onSubmit={handleCreateBoard}
        isLoading={creating}
      />
    </div>
  );
}
