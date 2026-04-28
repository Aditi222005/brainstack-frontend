import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Folder, Star, Plus, ChevronLeft, ChevronRight, Trash2, FolderOpen, Layers } from "lucide-react";

export interface Project {
  _id: string;
  name: string;
  description: string;
  color: string;
  isDefault: boolean;
  ideaCount: number;
  edgeCount: number;
  boardCount: number;
  createdAt: string;
}

const DOT_HEX: Record<string, string> = {
  blue: "var(--dash-teal)", purple: "var(--dash-purple)", green: "var(--dash-green)",
  yellow: "var(--dash-orange)", red: "var(--dash-red)", cyan: "var(--dash-teal)", pink: "var(--dash-purple)",
};

interface Props {
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string) => void;
  loading?: boolean;
}

export function ProjectsSidebar({ projects, selectedId, onSelect, onCreateProject, onDeleteProject, loading = false }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        width: collapsed ? 56 : 240,
        background: 'var(--dash-surface)',
        borderRight: '1px solid var(--dash-border)',
        overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
        height: '100%',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: collapsed ? '16px 0' : '20px',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid var(--dash-border)',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <Folder style={{ width: 16, height: 16, color: 'var(--dash-purple)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--dash-text)' }}>Projects</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: collapsed ? 'column' : 'row' }}>
          {!collapsed && (
            <button
              id="projects-sidebar-new-btn"
              onClick={onCreateProject}
              title="New Project"
              style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dash-purple-soft)', color: 'var(--dash-purple)', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <Plus style={{ width: 14, height: 14 }} />
            </button>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand" : "Collapse"}
            style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: 'var(--dash-text-muted)', border: 'none', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}
          >
            {collapsed ? <ChevronRight style={{ width: 14, height: 14 }} /> : <ChevronLeft style={{ width: 14, height: 14 }} />}
          </button>
        </div>
      </div>

      {/* ── List ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
        {/* All Projects */}
        <ProjectItem
          id={null} label="All Projects"
          icon={<Globe style={{ width: 14, height: 14 }} />}
          dot="var(--dash-purple)"
          isSelected={selectedId === null}
          onSelect={() => onSelect(null)}
          collapsed={collapsed}
          count={projects.reduce((s, p) => s + (p.ideaCount ?? 0), 0)}
        />

        {!collapsed && <div style={{ height: 1, background: 'var(--dash-border)', margin: '12px 8px' }} />}

        {/* Loading shimmer */}
        {loading && !collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 36, borderRadius: 10, background: 'var(--dash-surface-2)', animation: 'pulse 2s infinite' }} />
            ))}
          </div>
        )}

        {/* Project items */}
        <AnimatePresence>
          {projects.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ delay: i * 0.04 }}
            >
              <ProjectItem
                id={p._id}
                label={p.name}
                icon={p.isDefault ? <Star style={{ width: 14, height: 14 }} /> : <FolderOpen style={{ width: 14, height: 14 }} />}
                dot={DOT_HEX[p.color] ?? DOT_HEX.purple}
                isSelected={selectedId === p._id}
                onSelect={() => onSelect(selectedId === p._id ? null : p._id)}
                collapsed={collapsed}
                count={p.ideaCount ?? 0}
                boardCount={p.boardCount ?? 0}
                onDelete={!p.isDefault ? () => onDeleteProject(p._id) : undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && projects.length === 0 && !collapsed && (
          <div style={{ padding: '30px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
            <Folder style={{ width: 28, height: 28, color: 'var(--dash-text-muted)', opacity: 0.4 }} />
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'var(--dash-text-muted)', lineHeight: 1.5, margin: 0 }}>
              No projects yet.<br />Create one to get started.
            </p>
          </div>
        )}

        {/* Collapsed new button */}
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <button
              onClick={onCreateProject}
              title="New Project"
              style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dash-purple-soft)', color: 'var(--dash-purple)', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <Plus style={{ width: 16, height: 16 }} />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

// ── Individual Project Row ──────────────────────────────────────────
import React from "react";
import { useNavigate as _useNavigate } from "react-router-dom";

interface ItemProps {
  id: string | null;
  label: string;
  icon: React.ReactNode;
  dot: string;
  isSelected: boolean;
  onSelect: () => void;
  collapsed: boolean;
  count?: number;
  boardCount?: number;
  onDelete?: () => void;
}

function ProjectItem({ id, label, icon, dot, isSelected, onSelect, collapsed, count, boardCount, onDelete }: ItemProps) {
  const [hovered, setHovered] = useState(false);
  const nav = _useNavigate();

  return (
    <div
      style={{ position: 'relative', margin: '4px 0' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onSelect}
        title={collapsed ? label : undefined}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '10px 0' : '10px 12px',
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          background: isSelected ? 'var(--dash-purple-soft)' : 'transparent',
          color: isSelected ? dot : 'var(--dash-text-mid)',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        {/* Dot or icon */}
        {collapsed ? (
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: dot, flexShrink: 0 }} />
        ) : (
          <>
            <span style={{ flexShrink: 0, color: 'inherit' }}>{icon}</span>
            <span style={{ flex: 1, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: isSelected ? 600 : 500, color: 'var(--dash-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              {boardCount !== undefined && boardCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--dash-purple)', background: 'rgba(124,111,255,0.1)', padding: '2px 6px', borderRadius: 6 }}>
                  <Layers style={{ width: 8, height: 8 }} />{boardCount}
                </span>
              )}
              {count !== undefined && (
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, fontWeight: 700, color: isSelected ? dot : 'var(--dash-text-muted)', tabularNums: true } as React.CSSProperties}>
                  {count}
                </span>
              )}
            </div>
          </>
        )}
      </button>

      {/* Action buttons on hover */}
      {!collapsed && id && hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4, zIndex: 10 }}
        >
          {/* View Boards */}
          <motion.button
            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            onClick={e => { e.stopPropagation(); nav(`/projects/${id}/boards`); }}
            title="View Boards"
            style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(124,111,255,0.12)', color: 'var(--dash-purple)', border: 'none', cursor: 'pointer' }}
          >
            <Layers style={{ width: 11, height: 11 }} />
          </motion.button>
          {/* Delete */}
          {onDelete && (
            <motion.button
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              onClick={e => { e.stopPropagation(); onDelete(); }}
              title="Delete project"
              style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dash-red-soft)', color: 'var(--dash-red)', border: 'none', cursor: 'pointer' }}
            >
              <Trash2 style={{ width: 11, height: 11 }} />
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
