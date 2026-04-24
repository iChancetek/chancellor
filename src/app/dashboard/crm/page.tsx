'use client';

import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import { createBoard } from '@/lib/firestore';
import { Users, Plus, TrendingUp, DollarSign, UserCheck, ArrowRight, Target, Mail } from 'lucide-react';

export default function CRMPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards } = useBoardStore();
  const crmBoards = boards.filter(b => b.type === 'crm');

  const handleCreateBoard = async (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'crm');
    await createBoard(board);
    router.push(`/dashboard/board/${board.id}`);
  };

  const templates = [
    { icon: <Target size={20} />, name: 'Sales Pipeline', desc: 'Track deals through stages', color: 'rgba(0, 200, 117, 0.15)' },
    { icon: <Users size={20} />, name: 'Contacts Database', desc: 'Manage all your contacts', color: 'rgba(87, 155, 252, 0.15)' },
    { icon: <DollarSign size={20} />, name: 'Deal Tracker', desc: 'Monitor deal values and progress', color: 'rgba(253, 171, 61, 0.15)' },
    { icon: <Mail size={20} />, name: 'Outreach Campaigns', desc: 'Track email campaigns and follow-ups', color: 'rgba(162, 93, 220, 0.15)' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>🧩 CRM</h1>
        <p>Manage leads, contacts, deals, and customer relationships — powered by Chancellor AI.</p>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(0, 200, 117, 0.1), rgba(0, 200, 117, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(0, 200, 117, 0.15)' }}>
            <TrendingUp size={22} style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="dashboard-card-title">Pipeline Overview</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: 'var(--color-success)' }}>{crmBoards.length}</span>
              <span className="dashboard-card-stat-label">Pipelines</span>
            </div>
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value">0</span>
              <span className="dashboard-card-stat-label">Active Deals</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(87, 155, 252, 0.1), rgba(87, 155, 252, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(87, 155, 252, 0.15)' }}>
            <UserCheck size={22} style={{ color: '#579BFC' }} />
          </div>
          <div className="dashboard-card-title">AI Lead Scoring</div>
          <div className="dashboard-card-desc">Chancellor AI analyzes lead behavior to predict conversion likelihood.</div>
        </div>
      </div>

      <div className="dashboard-section-title"><Plus size={18} style={{ color: 'var(--accent-primary)' }} /> Create CRM Board</div>
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

      {crmBoards.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <div className="dashboard-section-title">Your CRM Boards</div>
          <div className="dashboard-quick-actions">
            {crmBoards.map(board => (
              <button key={board.id} className="dashboard-quick-action" onClick={() => router.push(`/dashboard/board/${board.id}`)}>
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(0, 200, 117, 0.15)', fontSize: 'var(--text-md)' }}>{board.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{board.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>CRM Board</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
