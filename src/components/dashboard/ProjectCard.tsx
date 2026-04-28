import { motion } from "framer-motion";
import { Lightbulb, Link2, Calendar, Trash2, ArrowUpRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Project {
  _id: string;
  name: string;
  description: string;
  color: string;
  isDefault: boolean;
  ideaCount: number;
  edgeCount: number;
  createdAt: string;
}

const COLOR_HEX: Record<string, string> = {
  blue: "var(--dash-teal)", purple: "var(--dash-purple)", green: "var(--dash-green)",
  yellow: "var(--dash-orange)", red: "var(--dash-red)", cyan: "var(--dash-teal)", pink: "var(--dash-purple)", orange: "var(--dash-orange)",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Props {
  project: Project;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, index, isSelected, onSelect, onDelete }: Props) {
  const navigate = useNavigate();
  const dot = COLOR_HEX[project.color] ?? "var(--dash-purple)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, scale: 1.012 }}
      onClick={() => onSelect(project._id)}
      style={{
        position: 'relative',
        background: isSelected ? 'var(--dash-purple-soft)' : 'var(--dash-surface)',
        border: '1px solid',
        borderColor: isSelected ? dot : 'var(--dash-border)',
        borderLeft: `3px solid ${dot}`,
        borderRadius: 14,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
        boxShadow: isSelected ? `0 4px 16px rgba(108,92,231,0.15)` : '0 1px 4px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
      className="group"
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {project.isDefault && (
              <Star style={{ width: 16, height: 16, flexShrink: 0, color: dot, fill: dot, opacity: 0.85 }} />
            )}
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--dash-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project.name}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, opacity: 0, transition: 'opacity 0.2s' }} className="group-hover:!opacity-100">
            <button
              onClick={e => { e.stopPropagation(); navigate("/ai-board"); }}
              style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dash-surface-2)', color: dot, border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
              title="Open in AI Board"
            >
              <ArrowUpRight style={{ width: 14, height: 14 }} />
            </button>
            {!project.isDefault && onDelete && (
              <button
                onClick={e => { e.stopPropagation(); onDelete(project._id); }}
                style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dash-red-soft)', color: 'var(--dash-red)', border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer', transition: 'background 0.15s' }}
                title="Delete project"
              >
                <Trash2 style={{ width: 13, height: 13 }} />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'var(--dash-text-mid)', lineHeight: 1.55, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </p>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--dash-surface-2)', padding: '4px 10px', borderRadius: 99 }}>
            <Lightbulb style={{ width: 12, height: 12, color: dot }} />
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--dash-text)' }}>{project.ideaCount}</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'var(--dash-text-mid)' }}>ideas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--dash-surface-2)', padding: '4px 10px', borderRadius: 99 }}>
            <Link2 style={{ width: 12, height: 12, color: dot }} />
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--dash-text)' }}>{project.edgeCount}</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'var(--dash-text-mid)' }}>connections</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: 'var(--dash-text-muted)' }}>
            <Calendar style={{ width: 11, height: 11 }} />
            {formatDate(project.createdAt)}
          </div>
          {isSelected && (
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--dash-purple)', color: '#fff', padding: '4px 12px', borderRadius: 99 }}>
              Active
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
