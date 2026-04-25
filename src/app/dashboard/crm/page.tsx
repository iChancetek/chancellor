'use client';

import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import { 
  Users, Plus, TrendingUp, DollarSign, UserCheck, ArrowRight, Target, Mail, 
  CheckSquare, Calendar, MessageSquare, Share2, Layers, Search, Headset, 
  Settings, BarChart2, Link, User 
} from 'lucide-react';

export default function CRMPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard } = useBoardStore();
  const crmBoards = boards.filter(b => b.type === 'crm');

  const handleCreateBoard = (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'crm');
    
    // Optimistic UI update
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
    
    // Background Cloud Sync
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(err => console.error('Failed to sync board creation:', err));
    }).catch(() => {});
  };

  const salesTemplates = [
    { icon: <Users size={20} />, name: 'CRM Database', desc: 'Centralize contacts up to 1M', color: 'rgba(0, 200, 117, 0.15)', iconColor: '#00C875' },
    { icon: <Target size={20} />, name: 'Sales Pipeline', desc: 'Track deals through stages', color: 'rgba(253, 171, 61, 0.15)', iconColor: '#FDAB3D' },
    { icon: <CheckSquare size={20} />, name: 'Task Management', desc: 'Schedule and align tasks', color: 'rgba(87, 155, 252, 0.15)', iconColor: '#579BFC' },
    { icon: <Calendar size={20} />, name: 'Meeting Scheduling', desc: 'Sync calendar & availability', color: 'rgba(162, 93, 220, 0.15)', iconColor: '#A25DDC' },
  ];

  const marketingTemplates = [
    { icon: <Mail size={20} />, name: 'Email Marketing', desc: 'Bulk emails & templates', color: 'rgba(226, 68, 92, 0.15)', iconColor: '#E2445C' },
    { icon: <MessageSquare size={20} />, name: 'Lead Capture & Chatbots', desc: 'Forms and live chat', color: 'rgba(0, 200, 117, 0.15)', iconColor: '#00C875' },
    { icon: <Share2 size={20} />, name: 'Social Media Management', desc: 'Publish and track posts', color: 'rgba(87, 155, 252, 0.15)', iconColor: '#579BFC' },
    { icon: <Layers size={20} />, name: 'Audience Segmentation', desc: 'Group contacts by behavior', color: 'rgba(253, 171, 61, 0.15)', iconColor: '#FDAB3D' },
    { icon: <Search size={20} />, name: 'SEO Advisor', desc: 'Optimize content for search', color: 'rgba(162, 93, 220, 0.15)', iconColor: '#A25DDC' },
  ];

  const supportTemplates = [
    { icon: <Headset size={20} />, name: 'Ticketing System', desc: 'Organize customer queries', color: 'rgba(0, 200, 117, 0.15)', iconColor: '#00C875' },
    { icon: <User size={20} />, name: 'Customer Portal', desc: 'Self-service post-sales support', color: 'rgba(87, 155, 252, 0.15)', iconColor: '#579BFC' },
  ];

  const automationTemplates = [
    { icon: <Settings size={20} />, name: 'Workflows & Automation', desc: 'Automate manual activities', color: 'rgba(162, 93, 220, 0.15)', iconColor: '#A25DDC' },
    { icon: <BarChart2 size={20} />, name: 'Analytics & Reporting', desc: 'ROI, sessions, custom reports', color: 'rgba(253, 171, 61, 0.15)', iconColor: '#FDAB3D' },
    { icon: <Link size={20} />, name: 'Integrations & API', desc: 'Connect 75+ partners', color: 'rgba(226, 68, 92, 0.15)', iconColor: '#E2445C' },
  ];

  const renderTemplateSection = (title: string, items: typeof salesTemplates) => (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <div className="dashboard-section-title" style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>{title}</div>
      <div className="dashboard-quick-actions">
        {items.map(t => (
          <button key={t.name} className="dashboard-quick-action" onClick={() => handleCreateBoard(t.name)}>
            <div className="dashboard-quick-action-icon" style={{ background: t.color, color: t.iconColor }}>{t.icon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{t.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t.desc}</div>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }} />
          </button>
        ))}
      </div>
    </div>
  );

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
            <Users size={22} style={{ color: '#579BFC' }} />
          </div>
          <div className="dashboard-card-title">Contacts Database</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#579BFC' }}>0</span>
              <span className="dashboard-card-stat-label">Total Contacts</span>
            </div>
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value">0</span>
              <span className="dashboard-card-stat-label">New Leads</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(253, 171, 61, 0.1), rgba(253, 171, 61, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(253, 171, 61, 0.15)' }}>
            <UserCheck size={22} style={{ color: '#FDAB3D' }} />
          </div>
          <div className="dashboard-card-title">AI Lead Scoring</div>
          <div className="dashboard-card-desc">Chancellor AI analyzes lead behavior to predict conversion likelihood.</div>
        </div>
      </div>

      <div className="dashboard-section-title" style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
        <Plus size={18} style={{ color: 'var(--accent-primary)', marginRight: 'var(--space-2)' }} /> 
        Create CRM Board
      </div>

      {renderTemplateSection('Sales & Pipeline', salesTemplates)}
      {renderTemplateSection('Marketing & Engagement', marketingTemplates)}
      {renderTemplateSection('Service & Support', supportTemplates)}
      {renderTemplateSection('Automation & Reporting', automationTemplates)}

      {crmBoards.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <div className="dashboard-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>Your CRM Boards</div>
          <div className="dashboard-quick-actions" style={{ marginTop: 'var(--space-4)' }}>
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
