import React, { useState } from "react";
import { X, LayoutDashboard } from "lucide-react";

interface BoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  isLoading?: boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  color: 'var(--color-text)',
  padding: '9px 12px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.1em',
  color: 'rgba(232,234,240,0.4)', marginBottom: 6, display: 'block',
};

export function BoardModal({ isOpen, onClose, onSubmit, isLoading }: BoardModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() });
    setName(""); setDescription("");
  };

  const handleClose = () => { setName(""); setDescription(""); onClose(); };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }} onClick={handleClose} />

      <div
        style={{
          position: 'relative', width: '100%', maxWidth: 440, zIndex: 10,
          background: 'rgba(11,15,26,0.98)',
          border: '0.5px solid rgba(0,210,200,0.2)',
          borderRadius: 18,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: 'rgba(0,210,200,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard style={{ width: 15, height: 15, color: 'var(--color-secondary)' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>New Board</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(232,234,240,0.4)' }}>Create a visual workspace</div>
            </div>
          </div>
          <button onClick={handleClose}
            style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(232,234,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s, color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,234,240,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,234,240,0.3)'; }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Board Name *</label>
            <input
              id="board-name-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Chapter 1 Layout"
              required
              style={{ ...inputStyle }}
              onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(0,210,200,0.45)'; }}
              onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              id="board-desc-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this board about?"
              rows={3}
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
              onFocus={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'rgba(0,210,200,0.45)'; }}
              onBlur={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 4, borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={handleClose}
              style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: 'rgba(232,234,240,0.55)', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '9px 16px', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
            >
              Cancel
            </button>
            <button type="submit"
              disabled={!name.trim() || isLoading}
              style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: '#fff', background: 'var(--color-secondary)', border: 'none', borderRadius: 999, padding: '9px 16px', cursor: !name.trim() || isLoading ? 'not-allowed' : 'pointer', opacity: !name.trim() || isLoading ? 0.5 : 1, boxShadow: '0 4px 14px rgba(0,210,200,0.25)' }}
            >
              {isLoading ? "Creating…" : "Create Board →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
