'use client';

import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore, useRBACStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import { canAccess, getRoleLabel, getRoleBadgeColor } from '@/lib/rbac';
import ModuleCopilot from '@/components/ai/ModuleCopilot';
import {
  ArrowRight, DollarSign, TrendingUp, Users, Package,
  Zap, Shield, Building2, PieChart, Briefcase, BarChart3,
  RefreshCw, Brain, Sparkles, Target, Activity, GitMerge,
  ArrowUpRight, ArrowDownRight, Layers, Globe, Search
} from 'lucide-react';
import { useState } from 'react';

export default function UnifiedHubPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard, items } = useBoardStore();
  const { currentUserRole } = useRBACStore();
  const [search, setSearch] = useState('');

  const crmBoards = boards.filter(b => b.type === 'crm');
  const erpBoards = boards.filter(b => b.type === 'erp');
  const financeBoards = boards.filter(b => b.type === 'finance');
  const hrBoards = boards.filter(b => b.type === 'hr');
  const allModuleBoards = [...crmBoards, ...erpBoards, ...financeBoards, ...hrBoards];

  const crmItems = items.filter(i => crmBoards.some(b => b.id === i.boardId));
  const pipelineValue = crmItems.reduce((s, i) => s + (Number(i.values?.dealvalue) || 0), 0);
  const fmt = (n: number) => '$' + n.toLocaleString();

  const filteredBoards = allModuleBoards.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateBoard = (name: string, type: 'crm' | 'erp' | 'finance' | 'hr') => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, type);
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(() => {});
    }).catch(() => {});
  };

  const moduleColors: Record<string, { bg: string; color: string; icon: any }> = {
    crm: { bg: 'rgba(0,200,117,0.1)', color: '#00C875', icon: <Users size={18} /> },
    erp: { bg: 'rgba(22,163,74,0.1)', color: '#16A34A', icon: <Building2 size={18} /> },
    finance: { bg: 'rgba(0,215,69,0.1)', color: '#00d745', icon: <PieChart size={18} /> },
    hr: { bg: 'rgba(255,90,196,0.1)', color: '#ff5ac4', icon: <Briefcase size={18} /> },
  };

  const CROSS_FLOWS = [
    { from: 'CRM', to: 'Finance', flow: 'Deal Won → AR Invoice', icon: <ArrowUpRight size={14} />, color: '#00C875' },
    { from: 'ERP', to: 'Finance', flow: 'Purchase Order → AP Entry', icon: <ArrowDownRight size={14} />, color: '#579BFC' },
    { from: 'HR', to: 'Finance', flow: 'Payroll → Expense Posting', icon: <GitMerge size={14} />, color: '#ff5ac4' },
    { from: 'ERP', to: 'CRM', flow: 'Inventory → Sales Availability', icon: <RefreshCw size={14} />, color: '#FDAB3D' },
  ];

  const AI_PROMPTS = [
    { text: 'Cross-module revenue analysis', icon: <TrendingUp size={14} /> },
    { text: 'Where does CRM impact Finance?', icon: <Brain size={14} /> },
    { text: 'Inventory cost vs margin impact', icon: <BarChart3 size={14} /> },
    { text: 'HR payroll expense forecast', icon: <Target size={14} /> },
  ];

  return (
    <div className="dashboard-home">
      {/* Header */}
      <div className="dashboard-greeting">
        <h1>🔗 Unified Command Center</h1>
        <p>Cross-module intelligence hub — CRM, ERP, Finance, and HR working as a single unified system.</p>
      </div>

      <ModuleCopilot module="erp" />

      {/* Cross-Module KPI Strip */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(0,200,117,0.1), rgba(0,200,117,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(0,200,117,0.15)' }}><DollarSign size={22} style={{ color: '#00C875' }} /></div>
          <div className="dashboard-card-title">CRM Pipeline</div>
          <div className="dashboard-card-stats"><div className="dashboard-card-stat">
            <span className="dashboard-card-stat-value" style={{ color: '#00C875' }}>{fmt(pipelineValue)}</span>
            <span className="dashboard-card-stat-label">{crmItems.length} active deals</span>
          </div></div>
        </div>

        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(0,215,69,0.1), rgba(0,215,69,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(0,215,69,0.15)' }}><PieChart size={22} style={{ color: '#00d745' }} /></div>
          <div className="dashboard-card-title">Finance Health</div>
          <div className="dashboard-card-stats"><div className="dashboard-card-stat">
            <span className="dashboard-card-stat-value" style={{ color: '#00d745' }}>$2.84M</span>
            <span className="dashboard-card-stat-label">Revenue · 98% compliant</span>
          </div></div>
        </div>

        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(87,155,252,0.1), rgba(87,155,252,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(87,155,252,0.15)' }}><Package size={22} style={{ color: '#579BFC' }} /></div>
          <div className="dashboard-card-title">ERP Operations</div>
          <div className="dashboard-card-stats"><div className="dashboard-card-stat">
            <span className="dashboard-card-stat-value" style={{ color: '#579BFC' }}>99.9%</span>
            <span className="dashboard-card-stat-label">Uptime · {erpBoards.length} modules</span>
          </div></div>
        </div>

        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(255,90,196,0.1), rgba(255,90,196,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(255,90,196,0.15)' }}><Users size={22} style={{ color: '#ff5ac4' }} /></div>
          <div className="dashboard-card-title">HR & Workforce</div>
          <div className="dashboard-card-stats"><div className="dashboard-card-stat">
            <span className="dashboard-card-stat-value" style={{ color: '#ff5ac4' }}>{hrBoards.length}</span>
            <span className="dashboard-card-stat-label">Active HR boards</span>
          </div></div>
        </div>
      </div>

      {/* AI Copilot Bar */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap',
        padding: '14px 20px', borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(97,97,255,0.06), rgba(97,97,255,0.02))',
        border: '1px solid rgba(97,97,255,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <Sparkles size={16} color="#6161FF" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#6161FF' }}>Cross-Module AI</span>
        </div>
        {AI_PROMPTS.map(p => (
          <button key={p.text} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
            background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
          }}>{p.icon} {p.text}</button>
        ))}
      </div>

      {/* Cross-System Data Flows */}
      <div style={{ marginBottom: '24px' }}>
        <div className="dashboard-section-title" style={{ marginBottom: '12px' }}>
          <Zap size={18} style={{ color: '#6161FF', marginRight: '8px' }} /> Cross-System Data Flows
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {CROSS_FLOWS.map(f => (
            <div key={f.flow} style={{
              padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)',
              background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700 }}>
                <span style={{ padding: '3px 8px', borderRadius: '6px', background: `${f.color}15`, color: f.color, fontSize: '10px', fontWeight: 800 }}>{f.from}</span>
                {f.icon}
                <span style={{ padding: '3px 8px', borderRadius: '6px', background: `${f.color}15`, color: f.color, fontSize: '10px', fontWeight: 800 }}>{f.to}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{f.flow}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00C875', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '10px', color: '#00C875', fontWeight: 700 }}>Live Sync</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Context Banner */}
      <div style={{
        padding: '12px 20px', borderRadius: '12px', marginBottom: '24px',
        background: getRoleBadgeColor(currentUserRole).bg,
        border: `1px solid ${getRoleBadgeColor(currentUserRole).color}20`,
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <Shield size={16} color={getRoleBadgeColor(currentUserRole).color} />
        <span style={{ fontSize: '13px', fontWeight: 700, color: getRoleBadgeColor(currentUserRole).color }}>
          Your Role: {getRoleLabel(currentUserRole)}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
          — Showing modules and boards you have access to
        </span>
      </div>

      {/* Unified Board Search + List */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div className="dashboard-section-title" style={{ flex: 1 }}>
            <Layers size={18} style={{ color: 'var(--text-tertiary)', marginRight: '8px' }} /> All Boards Across Modules
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder="Search boards..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 12px 8px 32px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '12px', outline: 'none', width: '200px' }} />
          </div>
        </div>

        {filteredBoards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
            <Layers size={40} style={{ opacity: 0.2, margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600 }}>{search ? 'No matching boards' : 'No module boards created yet'}</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Create boards in CRM, ERP, Finance, or HR to see them here.</p>
          </div>
        ) : (
          <div className="dashboard-quick-actions">
            {filteredBoards.map(board => {
              const mc = moduleColors[board.type] || moduleColors.erp;
              return (
                <button key={board.id} className="dashboard-quick-action" onClick={() => router.push(`/dashboard/board/${board.id}`)}>
                  <div className="dashboard-quick-action-icon" style={{ background: mc.bg, color: mc.color }}>{mc.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{board.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                      <span style={{ padding: '1px 6px', borderRadius: '999px', background: mc.bg, color: mc.color, fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>{board.type}</span>
                      {board.groups.length} groups · {items.filter(i => i.boardId === board.id).length} items
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Create Strip */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { name: 'Sales Pipeline', type: 'crm' as const, color: '#00C875' },
          { name: 'General Ledger', type: 'finance' as const, color: '#00d745' },
          { name: 'Inventory Tracking', type: 'erp' as const, color: '#579BFC' },
          { name: 'Employee Portal', type: 'hr' as const, color: '#ff5ac4' },
        ].filter(t => canAccess(currentUserRole, t.type, 'create')).map(t => (
          <button key={t.name} onClick={() => handleCreateBoard(t.name, t.type)} style={{
            padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', transition: 'all 0.2s',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color }} />
            + {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
