'use client';

import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';

import { Code2, Plus, Bug, GitBranch, Rocket, ArrowRight, Gauge } from 'lucide-react';

export default function DevPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard } = useBoardStore();
  const devBoards = boards.filter(b => b.type === 'dev');

  const handleCreateBoard = (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'dev');
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
  };

  const templates = [
    { icon: <Gauge size={20} />, name: 'Sprint Board', desc: 'Plan and track sprints', color: 'rgba(253, 171, 61, 0.15)' },
    { icon: <Bug size={20} />, name: 'Bug Tracker', desc: 'Report and prioritize bugs', color: 'rgba(226, 68, 92, 0.15)' },
    { icon: <GitBranch size={20} />, name: 'Feature Planning', desc: 'Plan features and epics', color: 'rgba(87, 155, 252, 0.15)' },
    { icon: <Rocket size={20} />, name: 'Release Pipeline', desc: 'Manage releases and deployments', color: 'rgba(162, 93, 220, 0.15)' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>🛠️ Dev</h1>
        <p>Sprint planning, bug tracking, and release management — enhanced with AI-powered insights.</p>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(253, 171, 61, 0.1), rgba(253, 171, 61, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(253, 171, 61, 0.15)' }}>
            <Code2 size={22} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div className="dashboard-card-title">Dev Overview</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: 'var(--color-warning)' }}>{devBoards.length}</span>
              <span className="dashboard-card-stat-label">Boards</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(108, 92, 231, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(108, 92, 231, 0.15)' }}>
            <Bug size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div className="dashboard-card-title">AI Bug Prioritization</div>
          <div className="dashboard-card-desc">Chancellor AI analyzes bug impact and urgency to auto-prioritize.</div>
        </div>
      </div>

      <div className="dashboard-section-title"><Plus size={18} style={{ color: 'var(--accent-primary)' }} /> Create Dev Board</div>
      <div className="dashboard-quick-actions">
        {templates.map(t => (
          <button key={t.name} className="dashboard-quick-action" onClick={() => handleCreateBoard(t.name)}>
            <div className="dashboard-quick-action-icon" style={{ background: t.color }}>{t.icon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{t.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t.desc}</div>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }} />
          </button>
        ))}
      </div>

      {devBoards.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <div className="dashboard-section-title">Your Dev Boards</div>
          <div className="dashboard-quick-actions">
            {devBoards.map(board => (
              <button key={board.id} className="dashboard-quick-action" onClick={() => router.push(`/dashboard/board/${board.id}`)}>
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(253, 171, 61, 0.15)', fontSize: 'var(--text-md)' }}>{board.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{board.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Dev Board</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
