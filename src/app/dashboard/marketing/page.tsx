'use client';

import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import { createBoard } from '@/lib/firestore';
import { Megaphone, Plus, Calendar, Image, BarChart3, ArrowRight, Sparkles } from 'lucide-react';

export default function MarketingPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards } = useBoardStore();
  const marketingBoards = boards.filter(b => b.type === 'marketing');

  const handleCreateBoard = async (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'marketing');
    await createBoard(board);
    router.push(`/dashboard/board/${board.id}`);
  };

  const templates = [
    { icon: <Megaphone size={20} />, name: 'Campaign Tracker', desc: 'Track campaigns end to end', color: 'rgba(162, 93, 220, 0.15)' },
    { icon: <Calendar size={20} />, name: 'Content Calendar', desc: 'Plan and schedule content', color: 'rgba(87, 155, 252, 0.15)' },
    { icon: <BarChart3 size={20} />, name: 'Ad Performance', desc: 'Monitor ad spend and ROI', color: 'rgba(0, 200, 117, 0.15)' },
    { icon: <Image size={20} />, name: 'Asset Library', desc: 'Manage creative assets', color: 'rgba(253, 171, 61, 0.15)' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>📣 Marketing</h1>
        <p>Campaign management, content calendars, and performance tracking — amplified by AI.</p>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(162, 93, 220, 0.1), rgba(162, 93, 220, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(162, 93, 220, 0.15)' }}>
            <Megaphone size={22} style={{ color: 'var(--color-purple)' }} />
          </div>
          <div className="dashboard-card-title">Marketing Overview</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: 'var(--color-purple)' }}>{marketingBoards.length}</span>
              <span className="dashboard-card-stat-label">Campaigns</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(108, 92, 231, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(108, 92, 231, 0.15)' }}>
            <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div className="dashboard-card-title">AI Copywriting</div>
          <div className="dashboard-card-desc">Chancellor AI generates ad copy, email subjects, and content ideas.</div>
        </div>
      </div>

      <div className="dashboard-section-title"><Plus size={18} style={{ color: 'var(--accent-primary)' }} /> Create Marketing Board</div>
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

      {marketingBoards.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <div className="dashboard-section-title">Your Marketing Boards</div>
          <div className="dashboard-quick-actions">
            {marketingBoards.map(board => (
              <button key={board.id} className="dashboard-quick-action" onClick={() => router.push(`/dashboard/board/${board.id}`)}>
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(162, 93, 220, 0.15)', fontSize: 'var(--text-md)' }}>{board.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{board.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Marketing Board</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
