import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AddIdeaModal } from "@/components/dashboard/AddIdeaModal";
import { ProjectModal } from "@/components/dashboard/ProjectModal";
import { ProjectsSidebar, Project } from "@/components/dashboard/ProjectsSidebar";
import { DashboardIdeaCard } from "@/components/dashboard/DashboardIdeaCard";
import { PendingIdeaDrawer, PendingIdea } from "@/components/dashboard/PendingIdeaDrawer";
import { Plus, Zap, Inbox, Sparkles, Layers } from "lucide-react";

const API = "http://localhost:5000/api";

const DUMMY_IDEAS: any[] = [
  { _id: "d1", title: "Build a Second Brain", content: "Capture and retrieve information effortlessly with AI assistance.", tags: ["productivity", "habit"], color: "green", createdAt: new Date(Date.now() - 3_600_000).toISOString(), projectId: null },
  { _id: "d2", title: "AI-Powered Connections", content: "Link semantically similar notes so you never lose an insight again.", tags: ["AI", "ml"], color: "cyan", createdAt: new Date(Date.now() - 7_200_000).toISOString(), projectId: null },
];

function authHdr(): Record<string, string> {
  const t = localStorage.getItem("token");
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

export default function Dashboard() {
  const navigate = useNavigate();


  const [projects, setProjects] = useState<Project[]>([]);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [addIdeaOpen, setAddIdeaOpen] = useState(false);

  // Navigate to boards page when a real project is selected
  const handleSelectProject = (id: string | null) => {
    if (id === null) {
      setSelectedProjectId(null);
    } else {
      navigate(`/projects/${id}/boards`);
    }
  };

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [autoConnecting, setAutoConnecting] = useState(false);

  // ── Pending (unsaved) ideas staging queue ──────────────────────────────
  const [pendingIdeas, setPendingIdeas] = useState<PendingIdea[]>([]);
  const [savingPending, setSavingPending] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API}/projects`, { credentials: "include", headers: authHdr() });
      const json = await res.json();
      if (json.success) setProjects(json.data ?? []);
    } catch { }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ir, er] = await Promise.all([
        fetch(`${API}/ideas`, { credentials: "include", headers: authHdr() }),
        fetch(`${API}/edges`, { credentials: "include", headers: authHdr() }),
      ]);
      const [id, ed] = await Promise.all([ir.ok ? ir.json() : null, er.ok ? er.json() : null]);
      setIdeas(id?.success ? (id.data ?? []) : DUMMY_IDEAS);
      setEdges(ed?.success ? (ed.data ?? []) : []);
    } catch {
      setIdeas(DUMMY_IDEAS);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Step 1: Capture idea locally — DO NOT save to DB yet ────────────────
  const handleAddIdea = (data: { title: string; content: string; tags: string[]; color: string }) => {
    const staged: PendingIdea = {
      localId: `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: data.title,
      content: data.content,
      tags: data.tags,
      color: data.color,
      projectId: selectedProjectId,
      createdAt: new Date().toISOString(),
    };
    setPendingIdeas(prev => [staged, ...prev]);
    setAddIdeaOpen(false);
  };

  // ── Step 2: User picks which pending ideas to persist ───────────────────
  const handleSavePending = async (selectedLocalIds: string[]) => {
    if (selectedLocalIds.length === 0) return;
    setSavingPending(true);

    const toSave = pendingIdeas.filter(p => selectedLocalIds.includes(p.localId));
    const saved: any[] = [];

    await Promise.all(
      toSave.map(async (idea) => {
        try {
          const body = {
            title: idea.title,
            content: idea.content,
            tags: idea.tags,
            color: idea.color,
            projectId: idea.projectId || undefined,
            x: Math.random() * 800,
            y: Math.random() * 600,
          };
          const res = await fetch(`${API}/ideas`, {
            method: "POST",
            credentials: "include",
            headers: authHdr(),
            body: JSON.stringify(body),
          });
          const json = await res.json();
          if (json.success && json.data) {
            saved.push(json.data);
          }
        } catch {
          // fallback: keep locally with fake id
          saved.push({ ...idea, _id: idea.localId });
        }
      })
    );

    // Add saved ideas to the main list
    setIdeas(prev => [...saved, ...prev]);
    // Remove saved ones from pending
    setPendingIdeas(prev => prev.filter(p => !selectedLocalIds.includes(p.localId)));
    setSavingPending(false);
  };

  // ── Discard pending ideas ───────────────────────────────────────────────
  const handleDiscardPending = (localIds: string[]) => {
    setPendingIdeas(prev => prev.filter(p => !localIds.includes(p.localId)));
  };

  const handleCreateProject = async (data: { name: string; description: string; color: string }) => {
    setCreatingProject(true);
    try {
      const res = await fetch(`${API}/projects`, { method: "POST", credentials: "include", headers: authHdr(), body: JSON.stringify(data) });
      const json = await res.json();
      if (json.success && json.data) { setProjects(prev => [json.data, ...prev]); setProjectModalOpen(false); }
    } catch { } finally { setCreatingProject(false); }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Delete project?")) return;
    try {
      await fetch(`${API}/projects/${id}`, { method: "DELETE", credentials: "include", headers: authHdr() });
      setProjects(prev => prev.filter(p => p._id !== id));
      if (selectedProjectId === id) setSelectedProjectId(null);
    } catch { }
  };

  const handleAutoConnect = async () => {
    setAutoConnecting(true);
    try {
      const res = await fetch(`${API}/edges/auto-connect`, { method: "POST", credentials: "include", headers: authHdr() });
      const json = await res.json();
      if (json.success && json.edges) {
        setEdges(prev => {
          const ids = new Set(prev.map(e => e._id));
          const newE = json.edges.filter((e: any) => !ids.has(e.id ?? e._id)).map((e: any) => ({ _id: e.id ?? e._id, source: e.source, target: e.target }));
          return [...prev, ...newE];
        });
      }
    } catch { } finally { setAutoConnecting(false); }
  };

  const displayedIdeas = useMemo(() => {
    let filtered = ideas;
    if (selectedProjectId) {
      filtered = ideas.filter(i => i.projectId === selectedProjectId);
    }
    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [ideas, selectedProjectId]);

  const selectedProject = useMemo(() => projects.find(p => p._id === selectedProjectId), [projects, selectedProjectId]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--dash-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <ProjectsSidebar
        projects={projects}
        selectedId={selectedProjectId}
        onSelect={handleSelectProject}
        onCreateProject={() => setProjectModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        loading={loading}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', background: 'var(--dash-surface)', borderBottom: '1px solid var(--dash-border)' }}>
          <div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--dash-text)', margin: '0 0 4px' }}>
              {selectedProject ? selectedProject.name : 'All Ideas'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--dash-text-mid)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              {displayedIdeas.length} {displayedIdeas.length === 1 ? 'idea' : 'ideas'} saved
              {pendingIdeas.length > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: 'rgba(108,92,231,0.12)', color: 'var(--dash-purple)',
                  padding: '2px 10px', borderRadius: 99,
                  border: '1px solid rgba(108,92,231,0.25)',
                }}>
                  ✦ {pendingIdeas.length} pending
                </span>
              )}
              {selectedProject && selectedProject.description ? ` • ${selectedProject.description}` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleAutoConnect}
              disabled={autoConnecting}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--dash-surface-2)', border: '1.5px solid var(--dash-border)',
                color: 'var(--dash-text-mid)', borderRadius: 99, padding: '10px 22px',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600,
                cursor: autoConnecting ? 'not-allowed' : 'pointer', opacity: autoConnecting ? 0.5 : 1,
              }}
            >
              <Zap style={{ width: 16, height: 16 }} /> {autoConnecting ? 'Connecting...' : 'Auto-Connect'}
            </button>
            <button
              onClick={() => setAddIdeaOpen(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--dash-purple)', color: '#FFFFFF', border: 'none',
                borderRadius: 99, padding: '10px 22px',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(108,92,231,0.3)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(108,92,231,0.45)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(108,92,231,0.3)';
              }}
            >
              <Plus style={{ width: 16, height: 16 }} /> New Idea
            </button>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', paddingBottom: pendingIdeas.length > 0 ? '80px' : '28px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{
                  height: 200, borderRadius: 18, overflow: 'hidden',
                  background: 'linear-gradient(90deg, var(--dash-surface-2) 25%, var(--dash-border) 50%, var(--dash-surface-2) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmerSlide 1.6s ease-in-out infinite',
                  animationDelay: `${i * 0.1}s`,
                }} />
              ))}
            </div>
          ) : displayedIdeas.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '60vh', gap: 12,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'var(--dash-purple-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 8,
              }}>
                <Inbox style={{ width: 32, height: 32, color: 'var(--dash-purple)' }} />
              </div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--dash-text)', margin: 0 }}>No ideas saved yet</h2>
              <p style={{ fontSize: 14, color: 'var(--dash-text-muted)', margin: '0 0 20px', textAlign: 'center', maxWidth: 320 }}>
                {pendingIdeas.length > 0
                  ? `You have ${pendingIdeas.length} pending idea${pendingIdeas.length > 1 ? 's' : ''} waiting to be saved. Review them below ↓`
                  : selectedProjectId ? 'This project has no ideas. Add your first one!' : 'Capture ideas freely — you choose which ones get saved to your library.'}
              </p>
              <button
                onClick={() => setAddIdeaOpen(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--dash-purple)', color: '#FFFFFF', border: 'none',
                  borderRadius: 99, padding: '12px 26px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(108,92,231,0.3)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(108,92,231,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(108,92,231,0.3)';
                }}
              >
                <Sparkles style={{ width: 15, height: 15 }} />
                Capture an idea
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
              }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: 'var(--dash-text-muted)',
                }}>
                  {displayedIdeas.length} {displayedIdeas.length === 1 ? 'Idea' : 'Ideas'} saved
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--dash-border)' }} />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: 18,
              }}>
                {displayedIdeas.map((idea, i) => (
                  <div
                    key={idea._id}
                    style={{
                      opacity: 0,
                      animation: 'cardFadeUp 0.4s ease forwards',
                      animationDelay: `${Math.min(i * 55, 500)}ms`,
                    }}
                  >
                    <DashboardIdeaCard idea={idea} index={i} projects={projects} />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
        <style>{`
          @keyframes shimmerSlide {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes cardFadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      {/* ── Pending Ideas Drawer ── */}
      <PendingIdeaDrawer
        pending={pendingIdeas}
        isSaving={savingPending}
        onSaveSelected={handleSavePending}
        onDiscard={handleDiscardPending}
      />

      <AddIdeaModal
        isOpen={addIdeaOpen}
        onClose={() => setAddIdeaOpen(false)}
        onSubmit={handleAddIdea}
        isLoading={false}
        projectId={selectedProjectId}
        projects={projects}
      />
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={handleCreateProject}
        isLoading={creatingProject}
      />
    </div>
  );
}
