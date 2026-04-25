'use client';

import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';

import { LayoutGrid, Plus, FolderKanban, ListChecks, CalendarDays, ArrowRight, Sparkles } from 'lucide-react';

import ModuleCopilot from '@/components/ai/ModuleCopilot';

export default function WorkplacePage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard } = useBoardStore();
  const workBoards = boards.filter(b => b.type === 'work');

  const handleCreateBoard = (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'work');
    
    // Optimistic UI update
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
    
    // Background Cloud Sync
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(err => console.error('Failed to sync board creation:', err));
    }).catch(() => {});
  };

  const templates = [
    { icon: <FolderKanban size={20} />, name: 'Project Tracker', desc: 'Track projects from start to finish', color: 'rgba(87, 155, 252, 0.15)' },
    { icon: <ListChecks size={20} />, name: 'Task Board', desc: 'Organize tasks by team or priority', color: 'rgba(0, 200, 117, 0.15)' },
    { icon: <CalendarDays size={20} />, name: 'Sprint Planning', desc: 'Plan weekly sprints and milestones', color: 'rgba(253, 171, 61, 0.15)' },
    { icon: <Sparkles size={20} />, name: 'AI Project Setup', desc: 'Let Chancellor AI scaffold your project', color: 'rgba(108, 92, 231, 0.15)' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>🧱 Work Management</h1>
        <p>Boards, tasks, and project tracking — the backbone of your workspace.</p>
      </div>

      <ModuleCopilot module="work" />

      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(87, 155, 252, 0.1), rgba(87, 155, 252, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(87, 155, 252, 0.15)' }}>
            <LayoutGrid size={22} style={{ color: '#579BFC' }} />
          </div>
          <div className="dashboard-card-title">Work Overview</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#579BFC' }}>{workBoards.length}</span>
              <span className="dashboard-card-stat-label">Boards</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section-title"><Plus size={18} style={{ color: '#6161FF' }} /> Create Work Board</div>
      <div className="dashboard-quick-actions">
        {templates.map(t => (
          <button key={t.name} className="dashboard-quick-action" onClick={() => handleCreateBoard(t.name)}>
            <div className="dashboard-quick-action-icon" style={{ background: t.color }}>{t.icon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
              <div style={{ fontSize: '12px', color: '#9699a6' }}>{t.desc}</div>
            </div>
            <ArrowRight size={14} style={{ color: '#9699a6', marginLeft: 'auto' }} />
          </button>
        ))}
      </div>

      {workBoards.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div className="dashboard-section-title">Your Work Boards</div>
          <div className="dashboard-quick-actions">
            {workBoards.map(board => (
              <button key={board.id} className="dashboard-quick-action" onClick={() => router.push(`/dashboard/board/${board.id}`)}>
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(87, 155, 252, 0.15)', fontSize: '16px' }}>{board.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{board.name}</div>
                  <div style={{ fontSize: '12px', color: '#9699a6' }}>Work Board</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
