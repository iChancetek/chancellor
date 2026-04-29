'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import ModuleCopilot from '@/components/ai/ModuleCopilot';
import {
  PieChart, Plus, ArrowRight, DollarSign, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Receipt, Building2, ShieldCheck,
  BarChart3, Wallet, ArrowUpRight, ArrowDownRight, Clock, FileText,
  Eye, Filter, Search, RefreshCw, Zap
} from 'lucide-react';

// --- Mock Data for Elite UI ---
const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'Operations', 'HR', 'Legal'];

const BUDGET_DATA = [
  { dept: 'Engineering', allocated: 450000, spent: 387500, color: '#579BFC' },
  { dept: 'Marketing', allocated: 280000, spent: 295000, color: '#A25DDC' },
  { dept: 'Sales', allocated: 320000, spent: 198000, color: '#00C875' },
  { dept: 'Operations', allocated: 190000, spent: 172000, color: '#FDAB3D' },
  { dept: 'HR', allocated: 150000, spent: 141000, color: '#ff5ac4' },
  { dept: 'Legal', allocated: 95000, spent: 89000, color: '#E2445C' },
];

const EXPENSES = [
  { id: 'EXP-001', vendor: 'AWS Cloud Services', amount: 24500, dept: 'Engineering', status: 'approved', date: '2026-04-28', category: 'Infrastructure' },
  { id: 'EXP-002', vendor: 'Google Ads Campaign', amount: 18200, dept: 'Marketing', status: 'pending', date: '2026-04-27', category: 'Advertising' },
  { id: 'EXP-003', vendor: 'Salesforce License', amount: 9800, dept: 'Sales', status: 'approved', date: '2026-04-26', category: 'Software' },
  { id: 'EXP-004', vendor: 'Office Lease Q2', amount: 45000, dept: 'Operations', status: 'flagged', date: '2026-04-25', category: 'Facilities' },
  { id: 'EXP-005', vendor: 'Legal Retainer - Baker McKenzie', amount: 15000, dept: 'Legal', status: 'approved', date: '2026-04-24', category: 'Professional Services' },
  { id: 'EXP-006', vendor: 'Team Offsite Event', amount: 8500, dept: 'HR', status: 'pending', date: '2026-04-23', category: 'Events' },
];

const AUDIT_LOG = [
  { time: '2 min ago', action: 'Budget threshold alert triggered', dept: 'Marketing', severity: 'warning' },
  { time: '18 min ago', action: 'Expense EXP-003 auto-approved by policy engine', dept: 'Sales', severity: 'success' },
  { time: '1 hr ago', action: 'Q2 budget reallocation completed', dept: 'Engineering', severity: 'info' },
  { time: '3 hr ago', action: 'Compliance check passed — SOX Section 404', dept: 'All', severity: 'success' },
  { time: '5 hr ago', action: 'Anomalous spend pattern detected', dept: 'Operations', severity: 'warning' },
  { time: '1 day ago', action: 'Monthly close reconciliation finalized', dept: 'All', severity: 'success' },
];

const fmt = (n: number) => '$' + n.toLocaleString();
const pct = (spent: number, allocated: number) => Math.round((spent / allocated) * 100);

export default function FinancePage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard } = useBoardStore();
  const financeBoards = boards.filter(b => b.type === 'finance');

  const [activeTab, setActiveTab] = useState<'budgets' | 'expenses' | 'allocation' | 'compliance'>('budgets');
  const [expenseFilter, setExpenseFilter] = useState('all');

  const handleCreateBoard = (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'finance');
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(() => {});
    }).catch(() => {});
  };

  const totalAllocated = BUDGET_DATA.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = BUDGET_DATA.reduce((s, b) => s + b.spent, 0);
  const overBudgetDepts = BUDGET_DATA.filter(b => b.spent > b.allocated);

  const filteredExpenses = expenseFilter === 'all' ? EXPENSES : EXPENSES.filter(e => e.status === expenseFilter);

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      approved: { bg: 'rgba(0,200,117,0.15)', color: '#00C875', label: 'Approved' },
      pending: { bg: 'rgba(253,171,61,0.15)', color: '#FDAB3D', label: 'Pending' },
      flagged: { bg: 'rgba(226,68,92,0.15)', color: '#E2445C', label: 'Flagged' },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  const severityIcon = (sev: string) => {
    if (sev === 'warning') return <AlertTriangle size={14} color="#FDAB3D" />;
    if (sev === 'success') return <CheckCircle2 size={14} color="#00C875" />;
    return <Eye size={14} color="#579BFC" />;
  };

  const tabs = [
    { id: 'budgets' as const, label: 'Budget Management', icon: <Wallet size={16} /> },
    { id: 'expenses' as const, label: 'Expense Tracking', icon: <Receipt size={16} /> },
    { id: 'allocation' as const, label: 'Cost Allocation', icon: <Building2 size={16} /> },
    { id: 'compliance' as const, label: 'Audit & Compliance', icon: <ShieldCheck size={16} /> },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>💰 Finance</h1>
        <p>Strategic financial planning, real-time budget intelligence, and audit-ready compliance — powered by Chancellor AI.</p>
      </div>

      <ModuleCopilot module="finance" />

      {/* KPI Strip */}
      <div className="dashboard-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(0,215,69,0.1), rgba(0,215,69,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(0,215,69,0.15)' }}>
            <DollarSign size={22} style={{ color: '#00d745' }} />
          </div>
          <div className="dashboard-card-title">Total Budget</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#00d745' }}>{fmt(totalAllocated)}</span>
              <span className="dashboard-card-stat-label">Allocated</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(87,155,252,0.1), rgba(87,155,252,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(87,155,252,0.15)' }}>
            <TrendingUp size={22} style={{ color: '#579BFC' }} />
          </div>
          <div className="dashboard-card-title">Total Spend</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#579BFC' }}>{fmt(totalSpent)}</span>
              <span className="dashboard-card-stat-label">{pct(totalSpent, totalAllocated)}% utilized</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: overBudgetDepts.length > 0 ? 'linear-gradient(135deg, rgba(226,68,92,0.1), rgba(226,68,92,0.02))' : 'linear-gradient(135deg, rgba(0,200,117,0.1), rgba(0,200,117,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: overBudgetDepts.length > 0 ? 'rgba(226,68,92,0.15)' : 'rgba(0,200,117,0.15)' }}>
            <AlertTriangle size={22} style={{ color: overBudgetDepts.length > 0 ? '#E2445C' : '#00C875' }} />
          </div>
          <div className="dashboard-card-title">Overspend Alerts</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: overBudgetDepts.length > 0 ? '#E2445C' : '#00C875' }}>{overBudgetDepts.length}</span>
              <span className="dashboard-card-stat-label">{overBudgetDepts.length > 0 ? 'Departments flagged' : 'All clear'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: 'var(--space-6)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            background: activeTab === t.id ? '#fff' : 'transparent',
            color: activeTab === t.id ? '#323338' : 'var(--text-tertiary)',
            boxShadow: activeTab === t.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s ease'
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== TAB: BUDGET MANAGEMENT ===== */}
      {activeTab === 'budgets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {BUDGET_DATA.map(b => {
            const p = pct(b.spent, b.allocated);
            const over = b.spent > b.allocated;
            return (
              <div key={b.dept} style={{
                padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)', transition: 'box-shadow 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: b.color }} />
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>{b.dept}</span>
                    {over && <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 800, background: 'rgba(226,68,92,0.15)', color: '#E2445C' }}>OVER BUDGET</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Allocated: <strong style={{ color: 'var(--text-primary)' }}>{fmt(b.allocated)}</strong></span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Spent: <strong style={{ color: over ? '#E2445C' : 'var(--text-primary)' }}>{fmt(b.spent)}</strong></span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Remaining: <strong style={{ color: over ? '#E2445C' : '#00C875' }}>{fmt(b.allocated - b.spent)}</strong></span>
                  </div>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '999px', transition: 'width 0.6s ease',
                    width: `${Math.min(p, 100)}%`,
                    background: over ? 'linear-gradient(90deg, #E2445C, #ff6b6b)' : `linear-gradient(90deg, ${b.color}, ${b.color}aa)`,
                  }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: over ? '#E2445C' : 'var(--text-tertiary)', marginTop: '6px', fontWeight: 600 }}>{p}% utilized</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== TAB: EXPENSE TRACKING ===== */}
      {activeTab === 'expenses' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {['all', 'approved', 'pending', 'flagged'].map(f => (
              <button key={f} onClick={() => setExpenseFilter(f)} style={{
                padding: '8px 20px', borderRadius: '999px', border: '1px solid var(--border-color)', cursor: 'pointer',
                background: expenseFilter === f ? '#00d745' : 'var(--bg-primary)',
                color: expenseFilter === f ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: '12px', textTransform: 'capitalize', transition: 'all 0.2s'
              }}>{f}</button>
            ))}
          </div>
          <div style={{ borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['ID', 'Vendor', 'Category', 'Department', 'Amount', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(e => (
                  <tr key={e.id} style={{ borderTop: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--bg-secondary)')}
                    onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#579BFC' }}>{e.id}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{e.vendor}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{e.category}</td>
                    <td style={{ padding: '14px 16px' }}>{e.dept}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>{fmt(e.amount)}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-tertiary)' }}>{e.date}</td>
                    <td style={{ padding: '14px 16px' }}>{statusBadge(e.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== TAB: COST ALLOCATION ===== */}
      {activeTab === 'allocation' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#00d745" /> Departmental Share
            </h3>
            {BUDGET_DATA.map(b => {
              const share = Math.round((b.allocated / totalAllocated) * 100);
              return (
                <div key={b.dept} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: b.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}>{b.dept}</span>
                  <div style={{ width: '120px', height: '6px', borderRadius: '999px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', width: `${share}%`, background: b.color }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '36px', textAlign: 'right' }}>{share}%</span>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#FDAB3D" /> Shared Cost Centers
            </h3>
            {[
              { name: 'Cloud Infrastructure', total: 42000, depts: ['Engineering 60%', 'Operations 25%', 'Sales 15%'] },
              { name: 'Office & Facilities', total: 65000, depts: ['Operations 40%', 'HR 20%', 'Engineering 20%', 'Others 20%'] },
              { name: 'SaaS Licenses', total: 28000, depts: ['Engineering 35%', 'Marketing 30%', 'Sales 25%', 'HR 10%'] },
            ].map(c => (
              <div key={c.name} style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{c.name}</span>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#00d745' }}>{fmt(c.total)}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {c.depts.map(d => (
                    <span key={d} style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: 'rgba(87,155,252,0.1)', color: '#579BFC' }}>{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TAB: AUDIT & COMPLIANCE ===== */}
      {activeTab === 'compliance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#00C875" /> Compliance Status
            </h3>
            {[
              { standard: 'SOX Section 404', status: 'Passed', date: '2026-04-28' },
              { standard: 'GDPR Data Audit', status: 'Passed', date: '2026-04-25' },
              { standard: 'IFRS 15 Revenue Recognition', status: 'Passed', date: '2026-04-20' },
              { standard: 'Internal Controls Review', status: 'In Review', date: '2026-04-29' },
            ].map(c => (
              <div key={c.standard} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
                {c.status === 'Passed' ? <CheckCircle2 size={18} color="#00C875" /> : <Clock size={18} color="#FDAB3D" />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{c.standard}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Last checked: {c.date}</div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                  background: c.status === 'Passed' ? 'rgba(0,200,117,0.15)' : 'rgba(253,171,61,0.15)',
                  color: c.status === 'Passed' ? '#00C875' : '#FDAB3D'
                }}>{c.status}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#579BFC" /> Audit Trail
            </h3>
            {AUDIT_LOG.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ marginTop: '2px' }}>{severityIcon(log.severity)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{log.action}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{log.dept} · {log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Board Templates */}
      <div style={{ marginTop: 'var(--space-8)' }}>
        <div className="dashboard-section-title" style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
          <Plus size={18} style={{ color: '#00d745', marginRight: 'var(--space-2)' }} /> Create Finance Board
        </div>
        <div className="dashboard-quick-actions">
          {[
            { icon: <Wallet size={20} />, name: 'Budget Tracker', desc: 'Departmental budget management', color: 'rgba(0,215,69,0.15)', iconColor: '#00d745' },
            { icon: <Receipt size={20} />, name: 'Expense Manager', desc: 'Approvals, receipts & compliance', color: 'rgba(87,155,252,0.15)', iconColor: '#579BFC' },
            { icon: <Building2 size={20} />, name: 'Cost Allocation', desc: 'Interdepartmental cost sharing', color: 'rgba(253,171,61,0.15)', iconColor: '#FDAB3D' },
            { icon: <ShieldCheck size={20} />, name: 'Audit Dashboard', desc: 'Compliance tracking & audit trails', color: 'rgba(0,200,117,0.15)', iconColor: '#00C875' },
            { icon: <BarChart3 size={20} />, name: 'Financial Reporting', desc: 'P&L, balance sheet & cash flow', color: 'rgba(162,93,220,0.15)', iconColor: '#A25DDC' },
          ].map(t => (
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

      {financeBoards.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <div className="dashboard-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>Your Finance Boards</div>
          <div className="dashboard-quick-actions" style={{ marginTop: 'var(--space-4)' }}>
            {financeBoards.map(board => (
              <button key={board.id} className="dashboard-quick-action" onClick={() => router.push(`/dashboard/board/${board.id}`)}>
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(0,215,69,0.15)', fontSize: 'var(--text-md)' }}>{board.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{board.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Finance Board</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
