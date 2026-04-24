'use client';

import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';

import { Headphones, Plus, Ticket, Clock, AlertTriangle, ArrowRight, Shield } from 'lucide-react';

export default function SupportPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard } = useBoardStore();
  const supportBoards = boards.filter(b => b.type === 'support');

  const handleCreateBoard = (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'support');
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
  };

  const templates = [
    { icon: <Ticket size={20} />, name: 'Ticket Queue', desc: 'Manage support tickets', color: 'rgba(226, 68, 92, 0.15)' },
    { icon: <Clock size={20} />, name: 'SLA Tracker', desc: 'Monitor SLA compliance', color: 'rgba(253, 171, 61, 0.15)' },
    { icon: <AlertTriangle size={20} />, name: 'Escalation Board', desc: 'Track escalated issues', color: 'rgba(162, 93, 220, 0.15)' },
    { icon: <Shield size={20} />, name: 'Customer Success', desc: 'Proactive customer health monitoring', color: 'rgba(0, 200, 117, 0.15)' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>🎧 Support</h1>
        <p>Ticket management, SLA tracking, and escalation workflows — AI-powered triage built in.</p>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(226, 68, 92, 0.1), rgba(226, 68, 92, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(226, 68, 92, 0.15)' }}>
            <Headphones size={22} style={{ color: 'var(--color-danger)' }} />
          </div>
          <div className="dashboard-card-title">Support Overview</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: 'var(--color-danger)' }}>{supportBoards.length}</span>
              <span className="dashboard-card-stat-label">Queues</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(108, 92, 231, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(108, 92, 231, 0.15)' }}>
            <Ticket size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div className="dashboard-card-title">AI Auto-Triage</div>
          <div className="dashboard-card-desc">Chancellor AI categorizes and prioritizes tickets automatically.</div>
        </div>
      </div>

      <div className="dashboard-section-title"><Plus size={18} style={{ color: 'var(--accent-primary)' }} /> Create Support Board</div>
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

      {supportBoards.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <div className="dashboard-section-title">Your Support Boards</div>
          <div className="dashboard-quick-actions">
            {supportBoards.map(board => (
              <button key={board.id} className="dashboard-quick-action" onClick={() => router.push(`/dashboard/board/${board.id}`)}>
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(226, 68, 92, 0.15)', fontSize: 'var(--text-md)' }}>{board.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{board.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Support Board</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
