import { useState, useEffect } from "react";
import {
  CloudUpload, Trash2, CheckSquare, Square, X,
  Lightbulb, Tag, ChevronUp, ChevronDown,
} from "lucide-react";

export interface PendingIdea {
  localId: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  projectId?: string | null;
  createdAt: string;
}

const COLOR_ACCENT: Record<string, string> = {
  blue: "#7B93FF", purple: "#C084FC", green: "#34D399",
  yellow: "#FCD34D", red: "#F87171", cyan: "#22D3EE",
  pink: "#F472B6", orange: "#FB923C",
};

interface Props {
  pending: PendingIdea[];
  isSaving: boolean;
  onSaveSelected: (ids: string[]) => void;
  onDiscard: (ids: string[]) => void;
}

export function PendingIdeaDrawer({ pending, isSaving, onSaveSelected, onDiscard }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);

  // Auto-select all newly added pending ideas
  useEffect(() => {
    setSelected(new Set(pending.map(p => p.localId)));
  }, [pending.length]);

  if (pending.length === 0) return null;

  const toggleOne = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(prev =>
      prev.size === pending.length ? new Set() : new Set(pending.map(p => p.localId))
    );

  const selectedIds = [...selected];
  const unselectedIds = pending.filter(p => !selected.has(p.localId)).map(p => p.localId);

  return (
    <>
      {/* Backdrop overlay when expanded */}
      {!collapsed && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 990,
            background: "rgba(0,0,0,0.18)",
            animation: "fadeInOverlay 0.2s ease",
          }}
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          zIndex: 995,
          background: "#1E1B4B",
          borderTop: "1.5px solid rgba(124,111,255,0.35)",
          boxShadow: "0 -12px 40px rgba(0,0,0,0.35)",
          borderRadius: "20px 20px 0 0",
          transform: collapsed ? "translateY(calc(100% - 60px))" : "translateY(0)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          maxHeight: "65vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Drag handle / collapsed header ── */}
        <div
          onClick={() => setCollapsed(c => !c)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 24px",
            height: 60,
            cursor: "pointer",
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(124,111,255,0.18)",
              border: "1.5px solid rgba(124,111,255,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Lightbulb style={{ width: 18, height: 18, color: "#A78BFA" }} />
            </div>
            <div>
              <span style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700, fontSize: 15, color: "#E5E7EB",
              }}>
                Pending Ideas
              </span>
              <span style={{
                marginLeft: 10, fontSize: 11, fontWeight: 700,
                background: "rgba(124,111,255,0.25)", color: "#A78BFA",
                padding: "2px 9px", borderRadius: 99, letterSpacing: "0.06em",
              }}>
                {pending.length} unsaved
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!collapsed && (
              <span style={{
                fontSize: 12, color: "rgba(255,255,255,0.4)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                Select ideas to save to DB
              </span>
            )}
            {collapsed
              ? <ChevronUp style={{ width: 18, height: 18, color: "rgba(255,255,255,0.5)" }} />
              : <ChevronDown style={{ width: 18, height: 18, color: "rgba(255,255,255,0.5)" }} />
            }
          </div>
        </div>

        {/* ── Expanded body ── */}
        {!collapsed && (
          <>
            {/* Toolbar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "0 24px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              flexShrink: 0,
            }}>
              <button
                onClick={toggleAll}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 99, padding: "6px 14px", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              >
                {selected.size === pending.length
                  ? <CheckSquare style={{ width: 14, height: 14 }} />
                  : <Square style={{ width: 14, height: 14 }} />
                }
                {selected.size === pending.length ? "Deselect All" : "Select All"}
              </button>

              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {selected.size} of {pending.length} selected
              </span>

              <div style={{ flex: 1 }} />

              {/* Discard unselected */}
              {unselectedIds.length > 0 && (
                <button
                  onClick={() => onDiscard(unselectedIds)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 99, padding: "7px 16px", cursor: "pointer",
                    fontSize: 12, fontWeight: 600, color: "#F87171",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                >
                  <Trash2 style={{ width: 13, height: 13 }} />
                  Discard Unselected ({unselectedIds.length})
                </button>
              )}

              {/* Save selected */}
              <button
                onClick={() => onSaveSelected(selectedIds)}
                disabled={selectedIds.length === 0 || isSaving}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: selectedIds.length === 0 ? "rgba(124,111,255,0.3)" : "#6C5CE7",
                  border: "none", borderRadius: 99, padding: "8px 20px",
                  cursor: selectedIds.length === 0 || isSaving ? "not-allowed" : "pointer",
                  fontSize: 13, fontWeight: 700, color: "#fff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: selectedIds.length > 0 ? "0 4px 16px rgba(108,92,231,0.45)" : "none",
                  transition: "background 0.15s, box-shadow 0.15s, transform 0.15s",
                  opacity: isSaving ? 0.65 : 1,
                }}
                onMouseEnter={e => {
                  if (selectedIds.length > 0 && !isSaving) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(108,92,231,0.55)";
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    selectedIds.length > 0 ? "0 4px 16px rgba(108,92,231,0.45)" : "none";
                }}
              >
                <CloudUpload style={{ width: 15, height: 15 }} />
                {isSaving ? "Saving…" : `Save ${selectedIds.length > 0 ? `${selectedIds.length} ` : ""}to Library`}
              </button>
            </div>

            {/* Ideas list */}
            <div style={{
              overflowY: "auto", padding: "16px 24px 24px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {pending.map(idea => {
                const accent = COLOR_ACCENT[idea.color] ?? "#A78BFA";
                const isChosen = selected.has(idea.localId);
                return (
                  <div
                    key={idea.localId}
                    onClick={() => toggleOne(idea.localId)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      background: isChosen ? "rgba(124,111,255,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${isChosen ? "rgba(124,111,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 14, padding: "14px 16px",
                      cursor: "pointer",
                      transition: "background 0.18s, border-color 0.18s, transform 0.15s",
                      transform: isChosen ? "scale(1.005)" : "scale(1)",
                    }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.background = isChosen
                        ? "rgba(124,111,255,0.15)"
                        : "rgba(255,255,255,0.07)")
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.background = isChosen
                        ? "rgba(124,111,255,0.1)"
                        : "rgba(255,255,255,0.04)")
                    }
                  >
                    {/* Checkbox */}
                    <div style={{
                      marginTop: 2, width: 20, height: 20, flexShrink: 0,
                      borderRadius: 6, border: `2px solid ${isChosen ? accent : "rgba(255,255,255,0.2)"}`,
                      background: isChosen ? accent : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                      {isChosen && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Color dot */}
                    <div style={{
                      marginTop: 4, width: 8, height: 8, borderRadius: "50%",
                      background: accent, flexShrink: 0,
                      boxShadow: `0 0 8px ${accent}88`,
                    }} />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 700, fontSize: 14, color: isChosen ? "#E5E7EB" : "rgba(229,231,235,0.65)",
                        marginBottom: 4,
                        transition: "color 0.15s",
                      }}>
                        {idea.title}
                      </div>
                      {idea.content && (
                        <div style={{
                          fontSize: 12, color: "rgba(255,255,255,0.4)",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          lineHeight: 1.5,
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                          marginBottom: 8,
                        }}>
                          {idea.content.replace(/[#*_`>]/g, "").trim()}
                        </div>
                      )}
                      {idea.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {idea.tags.map(t => (
                            <span key={t} style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
                              background: `${accent}18`, color: accent,
                              padding: "2px 8px", borderRadius: 99,
                              border: `1px solid ${accent}33`,
                            }}>
                              <Tag style={{ width: 8, height: 8 }} />{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Discard single */}
                    <button
                      onClick={e => { e.stopPropagation(); onDiscard([idea.localId]); }}
                      style={{
                        flexShrink: 0, background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: 8, width: 28, height: 28,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#F87171",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                    >
                      <X style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  );
}
