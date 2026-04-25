'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useBoardStore, useWorkspaceStore, useUIStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import {
  LayoutGrid, Users, Code2, Headphones, Megaphone, Plus,
  TrendingUp, Clock, Sparkles, Zap, ArrowRight
} from 'lucide-react';

import AIPulseSummary from '@/components/dashboard/AIPulseSummary';

export default function DashboardHome() {
  const { user } = useAuth();
  const router = useRouter();
  const { boards, addBoard } = useBoardStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { toggleAIChat } = useUIStore();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleCreateBoard = (type: 'work' | 'crm' | 'dev' | 'support' | 'marketing', name: string) => {
    if (!activeWorkspace) {
      alert('Your workspace is still initializing. Please wait a few seconds and try again.');
      return;
    }
    const board = createDefaultBoard(activeWorkspace.id, name, type);
    
    // Optimistic UI update
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
    
    // Background Cloud Sync
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(err => console.error('Failed to sync board creation:', err));
    }).catch(() => {});
  };

  const moduleCards = [
    {
      icon: '🧱', title: 'Work Management', desc: 'Boards, tasks, and project tracking',
      color: 'rgba(87, 155, 252, 0.15)', border: 'rgba(87, 155, 252, 0.3)',
      stats: [{ value: boards.filter(b => b.type === 'work').length, label: 'Boards' }],
      action: () => router.push('/dashboard/workplace'),
    },
    {
      icon: '🧩', title: 'CRM', desc: 'Leads, contacts, and deal management',
      color: 'rgba(0, 200, 117, 0.15)', border: 'rgba(0, 200, 117, 0.3)',
      stats: [{ value: boards.filter(b => b.type === 'crm').length, label: 'Pipelines' }],
      action: () => router.push('/dashboard/crm'),
    },
    {
      icon: '🛠️', title: 'Dev', desc: 'Sprints, bugs, and releases',
      color: 'rgba(253, 171, 61, 0.15)', border: 'rgba(253, 171, 61, 0.3)',
      stats: [{ value: boards.filter(b => b.type === 'dev').length, label: 'Sprints' }],
      action: () => router.push('/dashboard/dev'),
    },
    {
      icon: '🎧', title: 'Support', desc: 'Tickets, SLAs, and escalations',
      color: 'rgba(226, 68, 92, 0.15)', border: 'rgba(226, 68, 92, 0.3)',
      stats: [{ value: boards.filter(b => b.type === 'support').length, label: 'Queues' }],
      action: () => router.push('/dashboard/support'),
    },
    {
      icon: '📣', title: 'Marketing', desc: 'Campaigns, content, and analytics',
      color: 'rgba(162, 93, 220, 0.15)', border: 'rgba(162, 93, 220, 0.3)',
      stats: [{ value: boards.filter(b => b.type === 'marketing').length, label: 'Campaigns' }],
      action: () => router.push('/dashboard/marketing'),
    },
    {
      icon: '🧠', title: 'Chancellor AI', desc: 'Intelligent automation and insights',
      color: 'rgba(108, 92, 231, 0.15)', border: 'rgba(108, 92, 231, 0.3)',
      stats: [{ value: '∞', label: 'Powered' }],
      action: () => toggleAIChat(),
    },
  ];

  const quickActions = [
    { icon: <Plus size={18} />, label: 'New Board', color: 'rgba(87, 155, 252, 0.15)', action: () => handleCreateBoard('work', 'New Board') },
    { icon: <Sparkles size={18} />, label: 'Ask Chancellor AI', color: 'rgba(108, 92, 231, 0.15)', action: () => toggleAIChat() },
    { icon: <Zap size={18} />, label: 'Create Automation', color: 'rgba(253, 171, 61, 0.15)', action: () => router.push('/dashboard/automations') },
    { icon: <TrendingUp size={18} />, label: 'View Insights', color: 'rgba(0, 200, 117, 0.15)', action: () => router.push('/dashboard/crm') },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>{greeting()}, {user?.displayName?.split(' ')[0] || 'there'} 👋</h1>
        <p>ChancellorOS is online. Intelligence layers are active across your workspace.</p>
      </div>

      <AIPulseSummary />

      {/* Real-Time Agentic Feed (Point 12: Visible Intelligence) */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '11px', fontWeight: 800, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00c875', boxShadow: '0 0 10px #00c875' }} />
          Live Agentic Execution Loop
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(97, 97, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            💼
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#323338' }}>Sales Intelligence Agent</span>
              <span style={{ fontSize: '11px', color: '#6161FF', fontWeight: 700, background: 'rgba(97, 97, 255, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>THINKING</span>
            </div>
            <div style={{ fontSize: '13px', color: '#676879' }}>
              Reasoning: "Analyzing CRM Pipeline for stalled opportunities in the 'Qualified' stage..."
            </div>
          </div>
          <div style={{ width: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9699a6', marginBottom: '4px' }}>
              <span>Analysis Progress</span>
              <span>72%</span>
            </div>
            <div style={{ height: '6px', background: '#f5f6f8', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '72%', background: '#6161FF', borderRadius: '3px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div className="dashboard-section-title">
          <Zap size={18} style={{ color: 'var(--color-warning)' }} />
          Quick Actions
        </div>
        <div className="dashboard-quick-actions">
          {quickActions.map((action) => (
            <button key={action.label} className="dashboard-quick-action" onClick={action.action}>
              <div className="dashboard-quick-action-icon" style={{ background: action.color }}>
                {action.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{action.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Module Cards */}
      <div className="dashboard-section-title">
        <LayoutGrid size={18} style={{ color: 'var(--accent-primary)' }} />
        Your Modules
      </div>
      <div className="dashboard-grid">
        {moduleCards.map((card, i) => (
          <div
            key={card.title}
            className="dashboard-card"
            onClick={card.action}
            style={{ animationDelay: `${i * 0.05}s`, borderColor: 'var(--border-default)' }}
          >
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon" style={{ background: card.color }}>
                {card.icon}
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <div className="dashboard-card-title">{card.title}</div>
            <div className="dashboard-card-desc">{card.desc}</div>
            <div className="dashboard-card-stats">
              {card.stats.map((stat) => (
                <div key={stat.label} className="dashboard-card-stat">
                  <span className="dashboard-card-stat-value">{stat.value}</span>
                  <span className="dashboard-card-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Boards */}
      {boards.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <div className="dashboard-section-title">
            <Clock size={18} style={{ color: 'var(--text-secondary)' }} />
            Recent Boards
          </div>
          <div className="dashboard-quick-actions">
            {boards.slice(0, 6).map((board) => (
              <button
                key={board.id}
                className="dashboard-quick-action"
                onClick={() => router.push(`/dashboard/board/${board.id}`)}
              >
                <div className="dashboard-quick-action-icon" style={{ background: 'var(--bg-depth-3)', fontSize: 'var(--text-md)' }}>
                  {board.icon || '📋'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{board.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{board.type}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
