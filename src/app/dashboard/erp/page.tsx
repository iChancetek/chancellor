'use client';

import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import ModuleCopilot from '@/components/ai/ModuleCopilot';
import AIForecastChart from '@/components/dashboard/AIForecastChart';
import { 
  Building2, Plus, TrendingUp, DollarSign, ArrowRight, Target,
  Briefcase, Activity, ShoppingCart, Users, Settings, Zap, 
  BarChart, Database, Map, Box, Globe, ShieldCheck, Headphones
} from 'lucide-react';

export default function ERPPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard } = useBoardStore();
  const erpBoards = boards.filter(b => b.type === 'erp');

  const handleCreateBoard = (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'erp');
    
    // Optimistic UI update
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
    
    // Background Cloud Sync
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(err => console.error('Failed to sync board creation:', err));
    }).catch(() => {});
  };

  const financeTemplates = [
    { icon: <Database size={20} />, name: 'General Ledger', desc: 'Core financial records & AP/AR', color: 'rgba(22, 163, 74, 0.15)', iconColor: '#16A34A' },
    { icon: <DollarSign size={20} />, name: 'Cash Management', desc: 'Budgeting & cash flow', color: 'rgba(22, 163, 74, 0.15)', iconColor: '#16A34A' },
    { icon: <TrendingUp size={20} />, name: 'Forecasting', desc: 'Financial modeling & forecasting', color: 'rgba(22, 163, 74, 0.15)', iconColor: '#16A34A' },
  ];

  const supplyChainTemplates = [
    { icon: <Box size={20} />, name: 'Inventory Tracking', desc: 'Real-time inventory management', color: 'rgba(87, 155, 252, 0.15)', iconColor: '#579BFC' },
    { icon: <Map size={20} />, name: 'Warehouse Management', desc: 'Picks, puts, and receipts', color: 'rgba(87, 155, 252, 0.15)', iconColor: '#579BFC' },
    { icon: <Activity size={20} />, name: 'Production Planning', desc: 'Manufacturing & quality control', color: 'rgba(87, 155, 252, 0.15)', iconColor: '#579BFC' },
  ];

  const hrTemplates = [
    { icon: <Users size={20} />, name: 'Employee Portal', desc: 'Employee self-service and data', color: 'rgba(162, 93, 220, 0.15)', iconColor: '#A25DDC' },
    { icon: <Briefcase size={20} />, name: 'Compensation', desc: 'Payroll and benefits administration', color: 'rgba(162, 93, 220, 0.15)', iconColor: '#A25DDC' },
    { icon: <Target size={20} />, name: 'Skill Tracking', desc: 'Performance and career growth', color: 'rgba(162, 93, 220, 0.15)', iconColor: '#A25DDC' },
  ];

  const salesTemplates = [
    { icon: <ShoppingCart size={20} />, name: 'Sales & Orders', desc: 'Manage incoming orders', color: 'rgba(253, 171, 61, 0.15)', iconColor: '#FDAB3D' },
    { icon: <Headphones size={20} />, name: 'Service Integration', desc: 'Link sales with service delivery', color: 'rgba(253, 171, 61, 0.15)', iconColor: '#FDAB3D' },
  ];

  const aiTemplates = [
    { icon: <Zap size={20} />, name: 'Copilot AI Insights', desc: 'AI-driven demand forecasting', color: 'rgba(226, 68, 92, 0.15)', iconColor: '#E2445C' },
    { icon: <Settings size={20} />, name: 'Power Automate', desc: 'Extensible workflow automation', color: 'rgba(226, 68, 92, 0.15)', iconColor: '#E2445C' },
  ];

  const renderTemplateSection = (title: string, items: typeof financeTemplates) => (
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
        <h1>🏢 ERP</h1>
        <p>Integrate finance, manufacturing, supply chain, and human resources into a single unified platform.</p>
      </div>

      <ModuleCopilot module="erp" />

      <div style={{ marginBottom: '32px' }}>
        <AIForecastChart />
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(22, 163, 74, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(22, 163, 74, 0.15)' }}>
            <ShieldCheck size={22} style={{ color: '#16A34A' }} />
          </div>
          <div className="dashboard-card-title">Cloud Resilience</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#16A34A' }}>99.9%</span>
              <span className="dashboard-card-stat-label">Uptime SLA</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(87, 155, 252, 0.1), rgba(87, 155, 252, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(87, 155, 252, 0.15)' }}>
            <Zap size={22} style={{ color: '#579BFC' }} />
          </div>
          <div className="dashboard-card-title">Automation</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#579BFC' }}>High</span>
              <span className="dashboard-card-stat-label">Error Reduction</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(162, 93, 220, 0.1), rgba(162, 93, 220, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(162, 93, 220, 0.15)' }}>
            <Globe size={22} style={{ color: '#A25DDC' }} />
          </div>
          <div className="dashboard-card-title">Scalable Architecture</div>
          <div className="dashboard-card-desc">Easily add or remove modules to scale from SMB to Enterprise as your business grows.</div>
        </div>
      </div>

      <div className="dashboard-section-title" style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
        <Plus size={18} style={{ color: 'var(--accent-primary)', marginRight: 'var(--space-2)' }} /> 
        Create ERP Module
      </div>

      {renderTemplateSection('Financial Management', financeTemplates)}
      {renderTemplateSection('Supply Chain & Manufacturing', supplyChainTemplates)}
      {renderTemplateSection('Human Resources', hrTemplates)}
      {renderTemplateSection('Sales & Service Integration', salesTemplates)}
      {renderTemplateSection('AI & Platform Extensibility', aiTemplates)}

      {erpBoards.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <div className="dashboard-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>Your ERP Modules</div>
          <div className="dashboard-quick-actions" style={{ marginTop: 'var(--space-4)' }}>
            {erpBoards.map(board => (
              <button key={board.id} className="dashboard-quick-action" onClick={() => router.push(`/dashboard/board/${board.id}`)}>
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(22, 163, 74, 0.15)', fontSize: 'var(--text-md)' }}>{board.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{board.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>ERP Board</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
