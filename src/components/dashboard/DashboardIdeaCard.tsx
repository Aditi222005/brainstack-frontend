import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, ExternalLink, Clock, X, Layout, Lightbulb } from "lucide-react";

interface DashboardIdea {
  _id: string; title: string; content: string;
  tags: string[]; color: string; createdAt: string; projectId?: string | null;
}

const COLOR_MAP: Record<string, { bg: string; accent: string; glow: string; soft: string }> = {
  blue:   { bg: 'linear-gradient(135deg,#1a1f6e 0%,#2a3085 100%)', accent: '#7B93FF', glow: 'rgba(123,147,255,0.25)', soft: 'rgba(123,147,255,0.12)' },
  purple: { bg: 'linear-gradient(135deg,#3b1f6e 0%,#5a2b96 100%)', accent: '#C084FC', glow: 'rgba(192,132,252,0.25)', soft: 'rgba(192,132,252,0.12)' },
  green:  { bg: 'linear-gradient(135deg,#064e3b 0%,#065f46 100%)', accent: '#34D399', glow: 'rgba(52,211,153,0.25)', soft: 'rgba(52,211,153,0.12)' },
  yellow: { bg: 'linear-gradient(135deg,#78350f 0%,#92400e 100%)', accent: '#FCD34D', glow: 'rgba(252,211,77,0.25)', soft: 'rgba(252,211,77,0.12)' },
  red:    { bg: 'linear-gradient(135deg,#7f1d1d 0%,#991b1b 100%)', accent: '#F87171', glow: 'rgba(248,113,113,0.25)', soft: 'rgba(248,113,113,0.12)' },
  cyan:   { bg: 'linear-gradient(135deg,#164e63 0%,#0e7490 100%)', accent: '#22D3EE', glow: 'rgba(34,211,238,0.25)', soft: 'rgba(34,211,238,0.12)' },
  pink:   { bg: 'linear-gradient(135deg,#831843 0%,#9d174d 100%)', accent: '#F472B6', glow: 'rgba(244,114,182,0.25)', soft: 'rgba(244,114,182,0.12)' },
  orange: { bg: 'linear-gradient(135deg,#7c2d12 0%,#9a3412 100%)', accent: '#FB923C', glow: 'rgba(251,146,60,0.25)', soft: 'rgba(251,146,60,0.12)' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface Props {
  idea: DashboardIdea; index: number;
  projects?: { _id: string; name: string; color: string }[];
}

export function DashboardIdeaCard({ idea, index, projects = [] }: Props) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const theme = COLOR_MAP[idea.color] ?? COLOR_MAP.blue;
  const cleanContent = idea.content?.replace(/[#*_`>]/g, '').trim() || 'No description.';
  const project = projects.find(p => p._id === idea.projectId);

  const openOnBoard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/ai-board', {
      state: {
        projectId: idea.projectId || null,
        boardContext: { projectName: project?.name ?? 'All Ideas' },
      }
    });
  };

  const delay = `${index * 60}ms`;

  return (
    <>
      {/* ── Card ── */}
      <div
        ref={cardRef}
        onClick={() => setModalOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--dash-surface)',
          border: '1.5px solid var(--dash-border)',
          borderRadius: 18,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border-color 0.2s ease',
          transform: hovered ? 'translateY(-5px) scale(1.015)' : 'translateY(0) scale(1)',
          boxShadow: hovered ? `0 16px 40px ${theme.glow}, 0 4px 12px rgba(0,0,0,0.08)` : '0 2px 8px rgba(0,0,0,0.05)',
          borderColor: hovered ? theme.accent + '55' : 'var(--dash-border)',
          animationDelay: delay,
        }}
      >
        {/* Coloured header band */}
        <div style={{
          background: theme.bg,
          padding: '20px 20px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative orb */}
          <div style={{
            position: 'absolute', right: -20, top: -20,
            width: 90, height: 90, borderRadius: '50%',
            background: theme.accent, opacity: 0.15, filter: 'blur(20px)',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.4)' : 'scale(1)',
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: theme.soft,
              border: `1.5px solid ${theme.accent}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lightbulb style={{ width: 16, height: 16, color: theme.accent }} />
            </div>
            {project && (
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)',
                padding: '3px 10px', borderRadius: 99,
              }}>
                {project.name}
              </span>
            )}
          </div>
          <h3 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 16, fontWeight: 700, color: '#FFFFFF',
            margin: 0, lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {idea.title}
          </h3>
        </div>

        {/* Card body */}
        <div style={{ padding: '16px 20px 18px' }}>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13, color: 'var(--dash-text-mid)', lineHeight: 1.6,
            margin: '0 0 14px',
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {cleanContent}
          </p>

          {/* Tags */}
          {idea.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {idea.tags.slice(0, 4).map(t => (
                <span key={t} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                  background: theme.soft, color: theme.accent,
                  padding: '3px 9px', borderRadius: 99,
                  border: `1px solid ${theme.accent}33`,
                }}>
                  <Tag style={{ width: 9, height: 9 }} />{t}
                </span>
              ))}
              {idea.tags.length > 4 && (
                <span style={{
                  fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)',
                  padding: '3px 8px',
                }}>+{idea.tags.length - 4}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, color: 'var(--dash-text-muted)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <Clock style={{ width: 11, height: 11 }} />
              {timeAgo(idea.createdAt)}
            </span>
            <button
              onClick={openOnBoard}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 700, color: theme.accent,
                background: theme.soft, border: `1px solid ${theme.accent}33`,
                borderRadius: 99, padding: '5px 12px', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = theme.accent + '28';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = theme.soft;
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              <Layout style={{ width: 10, height: 10 }} />
              Open Board
            </button>
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeInOverlay 0.2s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--dash-surface)',
              borderRadius: 22, overflow: 'hidden',
              width: '100%', maxWidth: 520,
              boxShadow: `0 32px 80px rgba(0,0,0,0.22), 0 0 0 1.5px ${theme.accent}44`,
              animation: 'slideUpModal 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Modal header band */}
            <div style={{ background: theme.bg, padding: '28px 28px 36px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', right: -30, top: -30,
                width: 130, height: 130, borderRadius: '50%',
                background: theme.accent, opacity: 0.12, filter: 'blur(30px)',
              }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: theme.soft,
                  border: `1.5px solid ${theme.accent}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                }}>
                  <Lightbulb style={{ width: 20, height: 20, color: theme.accent }} />
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 99,
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
                    transition: 'background 0.15s',
                  }}
                >
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
              <h2 style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.3,
              }}>
                {idea.title}
              </h2>
              {project && (
                <span style={{
                  display: 'inline-block', marginTop: 10,
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                  background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)',
                  padding: '4px 12px', borderRadius: 99,
                }}>
                  📁 {project.name}
                </span>
              )}
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px 28px 28px' }}>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14, color: 'var(--dash-text-mid)', lineHeight: 1.75,
                margin: '0 0 20px', whiteSpace: 'pre-wrap',
              }}>
                {cleanContent}
              </p>

              {idea.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
                  {idea.tags.map(t => (
                    <span key={t} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                      background: theme.soft, color: theme.accent,
                      padding: '4px 12px', borderRadius: 99,
                      border: `1px solid ${theme.accent}33`,
                    }}>
                      <Tag style={{ width: 10, height: 10 }} />{t}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={openOnBoard}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: theme.accent, color: '#fff', border: 'none', borderRadius: 12,
                    padding: '12px 20px', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    boxShadow: `0 6px 24px ${theme.glow}`,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 10px 30px ${theme.glow}`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 24px ${theme.glow}`;
                  }}
                >
                  <ExternalLink style={{ width: 15, height: 15 }} />
                  Open on AI Board
                </button>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 12, color: 'var(--dash-text-muted)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  <Clock style={{ width: 12, height: 12 }} />
                  {timeAgo(idea.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
