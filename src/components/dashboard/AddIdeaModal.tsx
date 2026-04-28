import React, { useState } from "react";
import { X, Tag, Lightbulb } from "lucide-react";

const COLORS = ["blue", "purple", "green", "yellow", "red", "cyan", "pink"] as const;
type IdeaColor = typeof COLORS[number];

const COLOR_HEX: Record<IdeaColor, string> = {
  blue: "var(--dash-teal)", purple: "var(--dash-purple)", green: "var(--dash-green)",
  yellow: "var(--dash-orange)", red: "var(--dash-red)", cyan: "var(--dash-teal)", pink: "var(--dash-purple)",
};

export interface ProjectOption { _id: string; name: string; color: string; isDefault?: boolean; }

interface AddIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; tags: string[]; color: IdeaColor }) => void;
  isLoading?: boolean;
  projectId?: string | null;
  projects?: ProjectOption[];
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--dash-surface-2)',
  border: '1.5px solid var(--dash-border)',
  borderRadius: 10,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: 14,
  fontWeight: 400,
  color: 'var(--dash-text)',
  padding: '10px 13px',
  outline: 'none',
  transition: 'border-color 0.18s, box-shadow 0.18s',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--dash-text-mid)',
  marginBottom: 6,
  display: 'block',
};

export function AddIdeaModal({ isOpen, onClose, onSubmit, isLoading, projectId: initialProjectId, projects = [] }: AddIdeaModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [color, setColor] = useState<IdeaColor>("purple");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId ?? null);

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().replace(/^#/, "");
      if (!tags.includes(t)) setTags(prev => [...prev, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), content: content.trim(), tags, color });
    setTitle(""); setContent(""); setTags([]); setTagInput(""); setColor("purple");
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />

      {/* Panel */}
      <div
        style={{
          position: 'relative', width: '100%', maxWidth: 480, zIndex: 10,
          background: 'var(--dash-surface)',
          border: '1px solid var(--dash-border)',
          borderRadius: 18,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--dash-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--dash-purple-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lightbulb style={{ width: 16, height: 16, color: 'var(--dash-purple)' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--dash-text)', margin: 0 }}>Capture an Idea</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'var(--dash-text-muted)' }}>Staged locally — you choose what gets saved</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s, color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--dash-surface-2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--dash-text)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--dash-text-muted)'; }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Project selector */}
          {projects.length > 0 && (
            <div>
              <label style={labelStyle}>Project</label>
              <select
                value={selectedProjectId ?? ""}
                onChange={e => setSelectedProjectId(e.target.value || null)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => {
                  (e.currentTarget as HTMLSelectElement).style.borderColor = 'var(--dash-purple)';
                  (e.currentTarget as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)';
                }}
                onBlur={e => {
                  (e.currentTarget as HTMLSelectElement).style.borderColor = 'var(--dash-border)';
                  (e.currentTarget as HTMLSelectElement).style.boxShadow = 'none';
                }}
              >
                <option value="">General (Default)</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              id="add-idea-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What's your idea?"
              required
              style={{ ...inputStyle }}
              onFocus={e => {
                (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--dash-purple)';
                (e.currentTarget as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)';
              }}
              onBlur={e => {
                (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--dash-border)';
                (e.currentTarget as HTMLInputElement).style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Content */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              id="add-idea-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Elaborate on your idea..."
              rows={3}
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
              onFocus={e => {
                (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--dash-purple)';
                (e.currentTarget as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)';
              }}
              onBlur={e => {
                (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--dash-border)';
                (e.currentTarget as HTMLTextAreaElement).style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags <span style={{ opacity: 0.6, fontWeight: 400 }}>(press Enter to add)</span></label>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {tags.map(tag => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, background: 'var(--dash-surface-2)', color: 'var(--dash-text-mid)', padding: '4px 12px', borderRadius: 99, border: '1px solid var(--dash-border)' }}>
                    <Tag style={{ width: 10, height: 10 }} />
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, opacity: 0.6, lineHeight: 1, fontSize: 12 }}>✕</button>
                  </span>
                ))}
              </div>
            )}
            <input
              id="add-idea-tags"
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag + Enter"
              style={{ ...inputStyle }}
              onFocus={e => {
                (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--dash-purple)';
                (e.currentTarget as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)';
              }}
              onBlur={e => {
                (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--dash-border)';
                (e.currentTarget as HTMLInputElement).style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Color */}
          <div>
            <label style={labelStyle}>Card Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button
                  key={c} type="button" onClick={() => setColor(c)}
                  title={c}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', padding: 0, border: 'none', cursor: 'pointer',
                    backgroundColor: COLOR_HEX[c],
                    outline: color === c ? `2px solid ${COLOR_HEX[c]}` : '2px solid transparent',
                    outlineOffset: 2,
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s, outline 0.15s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid var(--dash-border)' }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--dash-text-mid)', background: 'var(--dash-surface-2)', border: '1.5px solid var(--dash-border)', borderRadius: 99, padding: '10px 16px', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dash-purple)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--dash-purple)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dash-border)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--dash-text-mid)';
              }}
            >
              Cancel
            </button>
            <button type="submit"
              disabled={!title.trim() || isLoading}
              style={{ flex: 1, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 14, color: '#FFFFFF', background: 'var(--dash-purple)', border: 'none', borderRadius: 99, padding: '10px 16px', cursor: !title.trim() || isLoading ? 'not-allowed' : 'pointer', opacity: !title.trim() || isLoading ? 0.5 : 1, transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => {
                if (!(!title.trim() || isLoading)) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(108,92,231,0.35)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLButtonElement).style.transform = 'none';
              }}
            >
              {isLoading ? "Staging…" : "Stage Idea →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
