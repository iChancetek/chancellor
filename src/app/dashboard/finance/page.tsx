'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import ModuleCopilot from '@/components/ai/ModuleCopilot';
import {
  Plus, ArrowRight, DollarSign, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Receipt, Building2, ShieldCheck,
  BarChart3, Wallet, Clock, FileText, Eye, Zap, BookOpen,
  Globe, Calculator, Brain, Sparkles, Target, RefreshCw,
  ArrowUpRight, ArrowDownRight, Landmark, Scale, LineChart,
  PieChart, Layers, GitMerge, Bell
} from 'lucide-react';

/* ── Mock Data ──────────────────────────────────────────── */
const fmt = (n: number) => '$' + n.toLocaleString();

const AR_AGING = [
  { range: 'Current', amount: 842000, count: 45, color: '#00C875' },
  { range: '30+ Days', amount: 215000, count: 12, color: '#FDAB3D' },
  { range: '60+ Days', amount: 89000, count: 5, color: '#E2445C' },
  { range: '90+ Days', amount: 34000, count: 3, color: '#333333' },
];

const BUDGET_VARIANCE = [
  { dept: 'Engineering', allocated: 450000, actual: 387500, color: '#579BFC' },
  { dept: 'Marketing', allocated: 280000, actual: 295000, color: '#A25DDC' },
  { dept: 'Sales', allocated: 320000, actual: 198000, color: '#00C875' },
  { dept: 'Operations', allocated: 190000, actual: 172000, color: '#FDAB3D' },
];

const AUDIT_EVENTS = [
  { time: '2 min ago', action: 'Budget threshold alert triggered', dept: 'Marketing', severity: 'warning' as const },
  { time: '18 min ago', action: 'Expense auto-approved by policy engine', dept: 'Sales', severity: 'success' as const },
  { time: '1 hr ago', action: 'Q2 budget reallocation completed', dept: 'Engineering', severity: 'info' as const },
  { time: '3 hr ago', action: 'SOX Section 404 compliance check passed', dept: 'All', severity: 'success' as const },
  { time: '5 hr ago', action: 'Anomalous spend pattern detected', dept: 'Operations', severity: 'warning' as const },
];

const AI_PROMPTS = [
  { text: 'Show revenue risk', icon: <TrendingDown size={14} /> },
  { text: 'Who will pay late?', icon: <Clock size={14} /> },
  { text: 'Where are we overspending?', icon: <AlertTriangle size={14} /> },
  { text: 'Explain this variance', icon: <Brain size={14} /> },
];

/* ── Template Sections ──────────────────────────────────── */
const CORE_TEMPLATES = [
  { icon: <BookOpen size={20} />, name: 'General Ledger', desc: 'Multi-book accounting (GAAP/IFRS), AI anomaly detection', color: 'rgba(0,215,69,0.12)', iconColor: '#00d745', badge: 'AI Reconciliation' },
  { icon: <ArrowUpRight size={20} />, name: 'Accounts Receivable', desc: 'Invoicing, credit terms, predictive late payment detection', color: 'rgba(87,155,252,0.12)', iconColor: '#579BFC', badge: 'AI Dunning' },
  { icon: <ArrowDownRight size={20} />, name: 'Accounts Payable', desc: 'Vendor billing, AI approval routing, cash-flow optimized scheduling', color: 'rgba(162,93,220,0.12)', iconColor: '#A25DDC', badge: 'Smart Routing' },
  { icon: <Landmark size={20} />, name: 'Fixed Assets', desc: 'Lifecycle management, automated depreciation, lease accounting', color: 'rgba(253,171,61,0.12)', iconColor: '#FDAB3D' },
];

const ADVANCED_TEMPLATES = [
  { icon: <Scale size={20} />, name: 'Revenue Recognition', desc: 'ASC 606 / IFRS 15 compliance, AI timing risk monitoring', color: 'rgba(0,200,117,0.12)', iconColor: '#00C875', badge: 'ASC 606' },
  { icon: <Globe size={20} />, name: 'Multi-Book Global', desc: 'Multi-currency, subsidiary accounting, intercompany eliminations', color: 'rgba(87,155,252,0.12)', iconColor: '#579BFC', badge: 'OneWorld' },
  { icon: <Layers size={20} />, name: 'Amortization Allocation', desc: 'Deferred expense amortization, AI cost allocation', color: 'rgba(253,171,61,0.12)', iconColor: '#FDAB3D' },
  { icon: <Target size={20} />, name: 'Planning Budget', desc: 'Scenario modeling, predictive forecasting, variance explanations', color: 'rgba(162,93,220,0.12)', iconColor: '#A25DDC', badge: 'What-If' },
];

const REPORTING_TEMPLATES = [
  { icon: <BarChart3 size={20} />, name: 'Financial Reporting', desc: 'Dynamic P&L, balance sheet, cash flow dashboards', color: 'rgba(0,215,69,0.12)', iconColor: '#00d745' },
  { icon: <Calculator size={20} />, name: 'Tax Management', desc: 'Global + domestic tax engine, AI classification, jurisdiction logic', color: 'rgba(226,68,92,0.12)', iconColor: '#E2445C', badge: 'Multi-Jurisdiction' },
  { icon: <ShieldCheck size={20} />, name: 'Audit Compliance', desc: 'Continuous audit trail, internal controls, AI compliance risk detection', color: 'rgba(0,200,117,0.12)', iconColor: '#00C875', badge: 'SOX Ready' },
];

const AI_TEMPLATES = [
  { icon: <LineChart size={20} />, name: 'AI Revenue Forecast', desc: 'AI-driven revenue, expense, and cash flow forecasting', color: 'rgba(97,97,255,0.12)', iconColor: '#6161FF', badge: 'AI Powered' },
  { icon: <GitMerge size={20} />, name: 'Auto Reconciliation', desc: 'High-confidence auto-matching with AI confidence scoring', color: 'rgba(97,97,255,0.12)', iconColor: '#6161FF', badge: 'Autonomous' },
  { icon: <Bell size={20} />, name: 'Smart Alerts', desc: 'Self-routing approvals, auto-generated reports, intelligent alerts', color: 'rgba(97,97,255,0.12)', iconColor: '#6161FF', badge: 'Autonomous' },
];

/* ── Component ──────────────────────────────────────────── */
export default function FinancePage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard } = useBoardStore();
  const financeBoards = boards.filter(b => b.type === 'finance');

  const handleCreateBoard = (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'finance');
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(() => {});
    }).catch(() => {});
  };

  const totalAR = AR_AGING.reduce((s, a) => s + a.amount, 0);
  const overdueAR = AR_AGING.filter(a => a.range !== 'Current').reduce((s, a) => s + a.amount, 0);

  const severityIcon = (sev: string) => {
    if (sev === 'warning') return <AlertTriangle size={14} color="#FDAB3D" />;
    if (sev === 'success') return <CheckCircle2 size={14} color="#00C875" />;
    return <Eye size={14} color="#579BFC" />;
  };

  const renderSection = (title: string, subtitle: string, templates: typeof CORE_TEMPLATES) => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{title}</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>{subtitle}</span>
      </div>
      <div className="dashboard-quick-actions">
        {templates.map(t => (
          <button key={t.name} className="dashboard-quick-action" onClick={() => handleCreateBoard(t.name)}>
            <div className="dashboard-quick-action-icon" style={{ background: t.color, color: t.iconColor }}>{t.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{t.name}</span>
                {t.badge && (
                  <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: 'rgba(97,97,255,0.1)', color: '#6161FF' }}>{t.badge}</span>
                )}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{t.desc}</div>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto', flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard-home">
      {/* Header */}
      <div className="dashboard-greeting">
        <h1>💰 Finance Intelligence</h1>
        <p>AI-powered financial operating system — real-time accounting, predictive analytics, and autonomous compliance across your entire organization.</p>
      </div>

      <ModuleCopilot module="finance" />

      {/* KPI Strip */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(0,215,69,0.1), rgba(0,215,69,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(0,215,69,0.15)' }}>
            <DollarSign size={22} style={{ color: '#00d745' }} />
          </div>
          <div className="dashboard-card-title">Total Revenue</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#00d745' }}>$2.84M</span>
              <span className="dashboard-card-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} color="#00C875" /> +12.3% vs last quarter
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(87,155,252,0.1), rgba(87,155,252,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(87,155,252,0.15)' }}>
            <Receipt size={22} style={{ color: '#579BFC' }} />
          </div>
          <div className="dashboard-card-title">Accounts Receivable</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#579BFC' }}>{fmt(totalAR)}</span>
              <span className="dashboard-card-stat-label" style={{ color: overdueAR > 200000 ? '#E2445C' : 'var(--text-tertiary)' }}>
                {fmt(overdueAR)} overdue
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(0,200,117,0.1), rgba(0,200,117,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(0,200,117,0.15)' }}>
            <Wallet size={22} style={{ color: '#00C875' }} />
          </div>
          <div className="dashboard-card-title">Cash Position</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#00C875' }}>$1.42M</span>
              <span className="dashboard-card-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} color="#00C875" /> Healthy runway
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(0,200,117,0.1), rgba(0,200,117,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(0,200,117,0.15)' }}>
            <ShieldCheck size={22} style={{ color: '#00C875' }} />
          </div>
          <div className="dashboard-card-title">Compliance Score</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#00C875' }}>98%</span>
              <span className="dashboard-card-stat-label">Audit-ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Copilot Quick Actions */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap',
        padding: '16px 20px', borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(97,97,255,0.06), rgba(97,97,255,0.02))',
        border: '1px solid rgba(97,97,255,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <Sparkles size={16} color="#6161FF" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#6161FF' }}>AI Copilot</span>
        </div>
        {AI_PROMPTS.map(p => (
          <button key={p.text} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
            background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {p.icon} {p.text}
          </button>
        ))}
      </div>

      {/* Board Template Sections */}
      <div style={{ marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <div className="dashboard-section-title">
          <Plus size={18} style={{ color: '#00d745', marginRight: '8px' }} /> Create Finance Board
        </div>
      </div>

      {renderSection('Core Accounting & Finance', 'Always available + contextualized', CORE_TEMPLATES)}
      {renderSection('Advanced Financial Capabilities', 'AI-enhanced layer', ADVANCED_TEMPLATES)}
      {renderSection('Reporting & Compliance', 'Real-time intelligence', REPORTING_TEMPLATES)}
      {renderSection('AI Intelligence Layer', 'Autonomous financial operations', AI_TEMPLATES)}

      {/* Live Intelligence Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '16px', marginBottom: '32px' }}>
        {/* AR Aging Heatmap */}
        <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={16} color="#579BFC" /> AR Aging Heatmap
          </h4>
          {AR_AGING.map(a => {
            const pct = Math.round((a.amount / totalAR) * 100);
            return (
              <div key={a.range} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{a.range}</span>
                  <span style={{ color: a.color, fontWeight: 700 }}>{fmt(a.amount)} ({a.count})</span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: '999px', background: a.color, transition: 'width 0.6s' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Budget vs Actual */}
        <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} color="#A25DDC" /> Budget vs Actual
          </h4>
          {BUDGET_VARIANCE.map(b => {
            const variance = Math.round(((b.actual - b.allocated) / b.allocated) * 100);
            const over = b.actual > b.allocated;
            return (
              <div key={b.dept} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '12px', fontWeight: 600 }}>{b.dept}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: over ? '#E2445C' : '#00C875' }}>
                  {over ? '+' : ''}{variance}%
                </span>
                {over && <span style={{ padding: '1px 6px', borderRadius: '999px', fontSize: '9px', fontWeight: 800, background: 'rgba(226,68,92,0.12)', color: '#E2445C' }}>OVER</span>}
              </div>
            );
          })}
        </div>

        {/* Real-Time Audit Trail */}
        <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#00C875" /> Audit Trail
          </h4>
          {AUDIT_EVENTS.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>{severityIcon(e.severity)}</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, lineHeight: '1.3' }}>{e.action}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '1px' }}>{e.dept} · {e.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-System Integration Strip */}
      <div style={{
        display: 'flex', gap: '16px', padding: '14px 20px', borderRadius: '12px',
        background: 'var(--bg-secondary)', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Integrations</span>
        {['CRM → Revenue Forecasting', 'Projects → Cost Tracking', 'HR → Payroll & Workforce', 'Inventory → COGS & Margins'].map(i => (
          <span key={i} style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: 'rgba(0,200,117,0.1)', color: '#00C875', border: '1px solid rgba(0,200,117,0.15)' }}>
            <RefreshCw size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />{i}
          </span>
        ))}
      </div>

      {/* Existing Finance Boards */}
      {financeBoards.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div className="dashboard-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Your Finance Boards</div>
          <div className="dashboard-quick-actions" style={{ marginTop: '16px' }}>
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
