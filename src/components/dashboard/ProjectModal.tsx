import React, { useState } from "react";
import { X, Folder } from "lucide-react";

const COLORS = ["blue", "purple", "green", "yellow", "red", "cyan", "pink"] as const;
type ProjectColor = typeof COLORS[number];

const COLOR_DOT: Record<ProjectColor, string> = {
  blue: "var(--dash-teal)", purple: "var(--dash-purple)", green: "var(--dash-green)",
  yellow: "var(--dash-orange)", red: "var(--dash-red)", cyan: "var(--dash-teal)", pink: "var(--dash-purple)",
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; color: ProjectColor }) => void;
  isLoading?: boolean;
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

export function ProjectModal({ isOpen, onClose, onSubmit, isLoading }: ProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<ProjectColor>("purple");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), color });
    setName(""); setDescription(""); setColor("purple");
  };

  const handleClose = () => { setName(""); setDescription(""); setColor("purple"); onClose(); };

  if (!isOpen) return null;

  const selectedDot = COLOR_DOT[color];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={handleClose} />

      <div
        style={{
          position: 'relative', width: '100%', maxWidth: 440, zIndex: 10,
          background: 'var(--dash-surface)',
          border: `1px solid var(--dash-border)`,
          borderRadius: 18,
          boxShadow: `0 10px 40px rgba(0,0,0,0.1)`,
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--dash-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--dash-purple-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Folder style={{ width: 16, height: 16, color: 'var(--dash-purple)' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--dash-text)', margin: 0 }}>New Project</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'var(--dash-text-muted)' }}>Organize your ideas</div>
            </div>
          </div>
          <button onClick={handleClose}
            style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s, color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--dash-surface-2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--dash-text)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--dash-text-muted)'; }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Project Name *</label>
            <input
              id="project-name-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. ML Research"
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

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              id="project-desc-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this project about?"
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

          {/* Color picker */}
          <div>
            <label style={labelStyle}>Project Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {COLORS.map(c => (
                <button
                  key={c} type="button" onClick={() => setColor(c)}
                  title={c}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', padding: 0, border: 'none', cursor: 'pointer',
                    backgroundColor: COLOR_DOT[c],
                    outline: color === c ? `2px solid ${COLOR_DOT[c]}` : '2px solid transparent',
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
            <button type="button" onClick={handleClose}
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
              disabled={!name.trim() || isLoading}
              style={{ flex: 1, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 14, color: '#FFFFFF', background: 'var(--dash-purple)', border: 'none', borderRadius: 99, padding: '10px 16px', cursor: !name.trim() || isLoading ? 'not-allowed' : 'pointer', opacity: !name.trim() || isLoading ? 0.5 : 1, transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => {
                if (!(!name.trim() || isLoading)) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(108,92,231,0.35)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLButtonElement).style.transform = 'none';
              }}
            >
              {isLoading ? "Creating…" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
