import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, ExternalLink, BookOpen, Clock, Pencil, ChevronRight, Plus } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

interface Session {
  _id: string; title: string; ideaCount: number; createdAt: string;
}

interface SessionDetail {
  _id: string; title: string; ideaCount: number; createdAt: string;
  ideas: Array<{ localId: string; title: string; content: string; tags: string[]; color: string; x: number; y: number; }>;
  edges: Array<{ sourceLocalId: string; targetLocalId: string; type: string; }>;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ChatHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<SessionDetail | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/scratch-sessions`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setSessions(data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this session? This cannot be undone.')) return;
    try {
      await fetch(`${API_BASE}/scratch-sessions/${id}`, { method: 'DELETE', credentials: 'include' });
      setSessions(prev => prev.filter(s => s._id !== id));
      if (preview?._id === id) setPreview(null);
    } catch (e) { console.error(e); }
  };

  const handlePreview = async (id: string) => {
    if (preview?._id === id) { setPreview(null); return; }
    setPreviewLoading(true);
    try {
      const res = await fetch(`${API_BASE}/scratch-sessions/${id}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setPreview(data.data);
    } catch (e) { console.error(e); } finally { setPreviewLoading(false); }
  };

  const handleRestoreOnBoard = (session: SessionDetail) => {
    navigate('/ai-board', { state: { projectId: null, boardId: null, boardContext: null, restoredSession: { ideas: session.ideas, edges: session.edges, title: session.title } } });
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/scratch-sessions/${id}/title`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSessions(prev => prev.map(s => s._id === id ? { ...s, title: editTitle.trim() } : s));
        if (preview?._id === id) setPreview(prev => prev ? { ...prev, title: editTitle.trim() } : null);
      }
    } catch (e) { console.error(e); } finally { setEditingId(null); }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dash-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', background: 'var(--dash-surface)', borderBottom: '1px solid var(--dash-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--dash-purple-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History style={{ width: 20, height: 20, color: 'var(--dash-purple)' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--dash-text)', margin: '0 0 4px' }}>
              History
            </h1>
            <p style={{ fontSize: 14, color: 'var(--dash-text-mid)', margin: 0 }}>
              Your saved scratch board sessions
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => navigate('/ai-board', { state: { projectId: null, boardId: null, boardContext: null } })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--dash-purple)', color: '#FFFFFF', border: 'none',
              borderRadius: 99, padding: '10px 22px',
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(108,92,231,0.25)', transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <Plus style={{ width: 16, height: 16 }} /> New Board
          </button>
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ padding: 24, background: 'var(--dash-surface)', borderRadius: 16, border: '1px solid var(--dash-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', color: 'var(--dash-text-mid)', fontWeight: 500 }}>
            Loading sessions...
          </div>
        </div>
      ) : sessions.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ maxWidth: 400, width: '100%', background: 'var(--dash-surface)', borderRadius: 24, border: '1px solid var(--dash-border)', padding: 40, textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--dash-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <BookOpen style={{ width: 32, height: 32, color: 'var(--dash-text-muted)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--dash-text)', margin: '0 0 12px' }}>No sessions found</h2>
            <p style={{ fontSize: 14, color: 'var(--dash-text-mid)', margin: '0 0 32px', lineHeight: 1.6 }}>
              Open the scratch board, brainstorm your ideas, and save your progress to view it here.
            </p>
            <button
              onClick={() => navigate('/ai-board', { state: { projectId: null, boardId: null, boardContext: null } })}
              style={{
                background: 'var(--dash-purple)', color: '#FFFFFF', border: 'none',
                borderRadius: 99, padding: '12px 28px',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Open Scratch Board →
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', minHeight: 0, padding: 32, gap: 24, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          
          {/* Left: Session list */}
          <div style={{ width: '40%', display: 'flex', flexDirection: 'column', background: 'var(--dash-surface)', borderRadius: 20, border: '1px solid var(--dash-border)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--dash-border)', background: 'var(--dash-surface)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--dash-text)', margin: 0 }}>All Sessions</h3>
              <p style={{ fontSize: 13, color: 'var(--dash-text-muted)', margin: '4px 0 0' }}>{sessions.length} total</p>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {sessions.map((session) => {
                const isActive = preview?._id === session._id;
                return (
                  <div
                    key={session._id}
                    onClick={() => handlePreview(session._id)}
                    style={{
                      padding: '16px 24px',
                      borderBottom: '1px solid var(--dash-border)',
                      cursor: 'pointer',
                      background: isActive ? 'var(--dash-purple-soft)' : 'transparent',
                      transition: 'background 0.2s',
                      display: 'flex', alignItems: 'center', gap: 16
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--dash-surface-2)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {editingId === session._id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleRename(session._id); if (e.key === 'Escape') setEditingId(null); }}
                            style={{ flex: 1, background: 'var(--dash-surface)', border: '1.5px solid var(--dash-purple)', borderRadius: 8, padding: '6px 10px', fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none' }}
                          />
                          <button onClick={() => handleRename(session._id)} style={{ background: 'var(--dash-purple)', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                        </div>
                      ) : (
                        <h4 style={{ fontSize: 15, fontWeight: 600, color: isActive ? 'var(--dash-purple)' : 'var(--dash-text)', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {session.title}
                        </h4>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--dash-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock style={{ width: 12, height: 12 }} /> {timeAgo(session.createdAt)}
                        </span>
                        <span>•</span>
                        <span style={{ fontWeight: 500 }}>{session.ideaCount} idea{session.ideaCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: isActive ? 1 : 0.6 }}>
                      <button onClick={(e) => { e.stopPropagation(); setEditingId(session._id); setEditTitle(session.title); }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--dash-surface-2)'; e.currentTarget.style.color = 'var(--dash-text)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--dash-text-muted)'; }}
                        title="Rename">
                        <Pencil style={{ width: 14, height: 14 }} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(session._id); }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--dash-red-soft)'; e.currentTarget.style.color = 'var(--dash-red)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--dash-text-muted)'; }}
                        title="Delete">
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                      <ChevronRight style={{ width: 16, height: 16, color: isActive ? 'var(--dash-purple)' : 'var(--dash-border)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Preview panel */}
          <div style={{ width: '60%', display: 'flex', flexDirection: 'column', background: 'var(--dash-surface)', borderRadius: 20, border: '1px solid var(--dash-border)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
            {!preview && !previewLoading ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--dash-text-muted)', padding: 32, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--dash-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <History style={{ width: 24, height: 24, opacity: 0.5 }} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>Select a session to preview</p>
              </div>
            ) : previewLoading ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ padding: '12px 24px', background: 'var(--dash-surface-2)', borderRadius: 99, fontSize: 14, fontWeight: 500, color: 'var(--dash-text-mid)' }}>
                  Loading preview...
                </div>
              </div>
            ) : preview && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Preview Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--dash-text)', margin: '0 0 8px' }}>
                      {preview.title}
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--dash-text-muted)', margin: 0 }}>
                      Created on {formatDate(preview.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestoreOnBoard(preview)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'var(--dash-surface)', border: '1.5px solid var(--dash-border)',
                      color: 'var(--dash-text)', borderRadius: 99, padding: '8px 16px',
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      transition: 'border-color 0.2s, background 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--dash-purple)'; e.currentTarget.style.color = 'var(--dash-purple)'; e.currentTarget.style.background = 'var(--dash-purple-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dash-border)'; e.currentTarget.style.color = 'var(--dash-text)'; e.currentTarget.style.background = 'var(--dash-surface)'; }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} /> Restore Session
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
                  {/* Ideas Grid */}
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dash-text-muted)', margin: '0 0 16px' }}>
                      Ideas ({preview.ideas.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                      {preview.ideas.map((idea, idx) => (
                        <div key={idx} style={{ padding: 16, background: 'var(--dash-surface-2)', borderRadius: 12, border: '1px solid var(--dash-border)' }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)', margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {idea.title}
                          </h4>
                          <p style={{ fontSize: 13, color: 'var(--dash-text-mid)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {idea.content || <span style={{ opacity: 0.5, fontStyle: 'italic' }}>No description</span>}
                          </p>
                          {idea.tags?.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                              {idea.tags.map((t, ti) => (
                                <span key={ti} style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-purple)', background: 'var(--dash-purple-soft)', padding: '2px 8px', borderRadius: 99 }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Edges List */}
                  {preview.edges.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dash-text-muted)', margin: '0 0 16px' }}>
                        Connections ({preview.edges.length})
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {preview.edges.map((edge, i) => {
                          const src = preview.ideas.find(x => x.localId === edge.sourceLocalId);
                          const tgt = preview.ideas.find(x => x.localId === edge.targetLocalId);
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'var(--dash-surface-2)', borderRadius: 8, fontSize: 13, color: 'var(--dash-text-mid)' }}>
                              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{src?.title ?? 'Unknown'}</span>
                              <span style={{ color: 'var(--dash-border)' }}>→</span>
                              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{tgt?.title ?? 'Unknown'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
