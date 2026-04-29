'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import ModuleCopilot from '@/components/ai/ModuleCopilot';
import {
  Briefcase, Plus, ArrowRight, Users, UserPlus, Award, Clock,
  CheckCircle2, AlertTriangle, TrendingUp, Heart, Shield,
  FileText, Calendar, Star, BarChart3, Target, Zap
} from 'lucide-react';

const EMPLOYEES = [
  { name: 'Sarah Chen', role: 'Senior Engineer', dept: 'Engineering', status: 'active', since: '2023-03', performance: 95 },
  { name: 'Marcus Johnson', role: 'Marketing Lead', dept: 'Marketing', status: 'active', since: '2022-08', performance: 88 },
  { name: 'Priya Patel', role: 'Sales Director', dept: 'Sales', status: 'active', since: '2021-11', performance: 92 },
  { name: 'James Wilson', role: 'HR Coordinator', dept: 'HR', status: 'onboarding', since: '2026-04', performance: 0 },
  { name: 'Emily Rodriguez', role: 'Legal Counsel', dept: 'Legal', status: 'active', since: '2024-01', performance: 90 },
  { name: 'David Kim', role: 'DevOps Engineer', dept: 'Engineering', status: 'review', since: '2022-06', performance: 78 },
];

const ONBOARDING_TASKS = [
  { task: 'IT Equipment Setup', assignee: 'James Wilson', status: 'complete' },
  { task: 'Security Badge & Access', assignee: 'James Wilson', status: 'complete' },
  { task: 'HR Policy Acknowledgment', assignee: 'James Wilson', status: 'pending' },
  { task: 'Team Introduction Meeting', assignee: 'James Wilson', status: 'pending' },
  { task: 'Benefits Enrollment', assignee: 'James Wilson', status: 'upcoming' },
  { task: '30-Day Check-in Scheduled', assignee: 'James Wilson', status: 'upcoming' },
];

const COMPLIANCE_ITEMS = [
  { policy: 'Anti-Harassment Training', completion: 96, due: '2026-05-15' },
  { policy: 'Data Privacy Certification', completion: 88, due: '2026-06-01' },
  { policy: 'Code of Conduct Review', completion: 100, due: '2026-04-30' },
  { policy: 'Safety & Emergency Protocol', completion: 72, due: '2026-05-30' },
];

export default function HRPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard } = useBoardStore();
  const hrBoards = boards.filter(b => b.type === 'hr');
  const [activeTab, setActiveTab] = useState<'directory' | 'onboarding' | 'performance' | 'compliance'>('directory');
  const [deptFilter, setDeptFilter] = useState('all');

  const handleCreateBoard = (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'hr');
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(() => {});
    }).catch(() => {});
  };

  const filtered = deptFilter === 'all' ? EMPLOYEES : EMPLOYEES.filter(e => e.dept === deptFilter);
  const depts = [...new Set(EMPLOYEES.map(e => e.dept))];

  const empStatusBadge = (s: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      active: { bg: 'rgba(0,200,117,0.15)', color: '#00C875', label: 'Active' },
      onboarding: { bg: 'rgba(87,155,252,0.15)', color: '#579BFC', label: 'Onboarding' },
      review: { bg: 'rgba(253,171,61,0.15)', color: '#FDAB3D', label: 'Under Review' },
    };
    const st = map[s] || map.active;
    return <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: st.bg, color: st.color }}>{st.label}</span>;
  };

  const tabs = [
    { id: 'directory' as const, label: 'Employee Directory', icon: <Users size={16} /> },
    { id: 'onboarding' as const, label: 'Onboarding', icon: <UserPlus size={16} /> },
    { id: 'performance' as const, label: 'Performance', icon: <Award size={16} /> },
    { id: 'compliance' as const, label: 'Policy & Compliance', icon: <Shield size={16} /> },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>👥 HR</h1>
        <p>Intelligent human capital management — onboarding, performance, and compliance, all in one place.</p>
      </div>

      <ModuleCopilot module="hr" />

      {/* KPI Strip */}
      <div className="dashboard-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(255,90,196,0.1), rgba(255,90,196,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(255,90,196,0.15)' }}>
            <Users size={22} style={{ color: '#ff5ac4' }} />
          </div>
          <div className="dashboard-card-title">Headcount</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#ff5ac4' }}>{EMPLOYEES.length}</span>
              <span className="dashboard-card-stat-label">Total Employees</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(87,155,252,0.1), rgba(87,155,252,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(87,155,252,0.15)' }}>
            <UserPlus size={22} style={{ color: '#579BFC' }} />
          </div>
          <div className="dashboard-card-title">Onboarding</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#579BFC' }}>{EMPLOYEES.filter(e => e.status === 'onboarding').length}</span>
              <span className="dashboard-card-stat-label">New Hires</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(0,200,117,0.1), rgba(0,200,117,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(0,200,117,0.15)' }}>
            <Heart size={22} style={{ color: '#00C875' }} />
          </div>
          <div className="dashboard-card-title">Avg Performance</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#00C875' }}>{Math.round(EMPLOYEES.filter(e => e.performance > 0).reduce((s, e) => s + e.performance, 0) / EMPLOYEES.filter(e => e.performance > 0).length)}%</span>
              <span className="dashboard-card-stat-label">Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
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

      {/* DIRECTORY */}
      {activeTab === 'directory' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setDeptFilter('all')} style={{ padding: '8px 20px', borderRadius: '999px', border: '1px solid var(--border-color)', cursor: 'pointer', background: deptFilter === 'all' ? '#ff5ac4' : 'var(--bg-primary)', color: deptFilter === 'all' ? '#fff' : 'var(--text-secondary)', fontWeight: 700, fontSize: '12px', transition: 'all 0.2s' }}>All</button>
            {depts.map(d => (
              <button key={d} onClick={() => setDeptFilter(d)} style={{ padding: '8px 20px', borderRadius: '999px', border: '1px solid var(--border-color)', cursor: 'pointer', background: deptFilter === d ? '#ff5ac4' : 'var(--bg-primary)', color: deptFilter === d ? '#fff' : 'var(--text-secondary)', fontWeight: 700, fontSize: '12px', transition: 'all 0.2s' }}>{d}</button>
            ))}
          </div>
          <div style={{ borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['Employee', 'Role', 'Department', 'Since', 'Performance', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.name} style={{ borderTop: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--bg-secondary)')}
                    onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff5ac4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px' }}>{e.name.split(' ').map(n => n[0]).join('')}</div>
                        <span style={{ fontWeight: 700 }}>{e.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{e.role}</td>
                    <td style={{ padding: '14px 16px' }}>{e.dept}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-tertiary)' }}>{e.since}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {e.performance > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '60px', height: '6px', borderRadius: '999px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: '999px', width: `${e.performance}%`, background: e.performance >= 90 ? '#00C875' : e.performance >= 80 ? '#FDAB3D' : '#E2445C' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>{e.performance}%</span>
                        </div>
                      ) : <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>N/A</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>{empStatusBadge(e.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ONBOARDING */}
      {activeTab === 'onboarding' && (
        <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} color="#579BFC" /> Active Onboarding — James Wilson
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '8px', borderRadius: '999px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '999px', width: `${Math.round((ONBOARDING_TASKS.filter(t => t.status === 'complete').length / ONBOARDING_TASKS.length) * 100)}%`, background: 'linear-gradient(90deg, #579BFC, #00C875)', transition: 'width 0.6s' }} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>{Math.round((ONBOARDING_TASKS.filter(t => t.status === 'complete').length / ONBOARDING_TASKS.length) * 100)}%</span>
          </div>
          {ONBOARDING_TASKS.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
              {t.status === 'complete' ? <CheckCircle2 size={18} color="#00C875" /> : t.status === 'pending' ? <Clock size={18} color="#FDAB3D" /> : <Calendar size={18} color="var(--text-tertiary)" />}
              <span style={{ flex: 1, fontWeight: 600, fontSize: '14px', color: t.status === 'complete' ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: t.status === 'complete' ? 'line-through' : 'none' }}>{t.task}</span>
              <span style={{
                padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                background: t.status === 'complete' ? 'rgba(0,200,117,0.15)' : t.status === 'pending' ? 'rgba(253,171,61,0.15)' : 'var(--bg-secondary)',
                color: t.status === 'complete' ? '#00C875' : t.status === 'pending' ? '#FDAB3D' : 'var(--text-tertiary)'
              }}>{t.status === 'complete' ? 'Done' : t.status === 'pending' ? 'Pending' : 'Upcoming'}</span>
            </div>
          ))}
        </div>
      )}

      {/* PERFORMANCE */}
      {activeTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {EMPLOYEES.filter(e => e.performance > 0).sort((a, b) => b.performance - a.performance).map(e => (
            <div key={e.name} style={{ padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ff5ac4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '12px' }}>{e.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{e.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{e.role} — {e.dept}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {e.performance >= 90 && <Star size={16} color="#FDAB3D" fill="#FDAB3D" />}
                  <span style={{ fontSize: '24px', fontWeight: 800, color: e.performance >= 90 ? '#00C875' : e.performance >= 80 ? '#FDAB3D' : '#E2445C' }}>{e.performance}%</span>
                </div>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', width: `${e.performance}%`, background: e.performance >= 90 ? 'linear-gradient(90deg, #00C875, #00d745)' : e.performance >= 80 ? 'linear-gradient(90deg, #FDAB3D, #ffcb00)' : 'linear-gradient(90deg, #E2445C, #ff6b6b)', transition: 'width 0.6s' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPLIANCE */}
      {activeTab === 'compliance' && (
        <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#00C875" /> Policy Compliance Tracker
          </h3>
          {COMPLIANCE_ITEMS.map(c => (
            <div key={c.policy} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{c.policy}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Due: {c.due}</span>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: c.completion === 100 ? '#00C875' : c.completion >= 85 ? '#FDAB3D' : '#E2445C' }}>{c.completion}%</span>
                </div>
              </div>
              <div style={{ height: '6px', borderRadius: '999px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', width: `${c.completion}%`, background: c.completion === 100 ? '#00C875' : c.completion >= 85 ? '#FDAB3D' : '#E2445C', transition: 'width 0.6s' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Board Templates */}
      <div style={{ marginTop: 'var(--space-8)' }}>
        <div className="dashboard-section-title" style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
          <Plus size={18} style={{ color: '#ff5ac4', marginRight: 'var(--space-2)' }} /> Create HR Board
        </div>
        <div className="dashboard-quick-actions">
          {[
            { icon: <Users size={20} />, name: 'Employee Directory', desc: 'Centralized people data', color: 'rgba(255,90,196,0.15)', iconColor: '#ff5ac4' },
            { icon: <UserPlus size={20} />, name: 'Onboarding Pipeline', desc: 'Automated new hire workflows', color: 'rgba(87,155,252,0.15)', iconColor: '#579BFC' },
            { icon: <Award size={20} />, name: 'Performance Reviews', desc: 'Goals, feedback & ratings', color: 'rgba(0,200,117,0.15)', iconColor: '#00C875' },
            { icon: <Target size={20} />, name: 'Talent Acquisition', desc: 'Recruiting pipeline & tracking', color: 'rgba(253,171,61,0.15)', iconColor: '#FDAB3D' },
            { icon: <Shield size={20} />, name: 'Compliance Tracker', desc: 'Policy acknowledgment & audits', color: 'rgba(162,93,220,0.15)', iconColor: '#A25DDC' },
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

      {hrBoards.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <div className="dashboard-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>Your HR Boards</div>
          <div className="dashboard-quick-actions" style={{ marginTop: 'var(--space-4)' }}>
            {hrBoards.map(board => (
              <button key={board.id} className="dashboard-quick-action" onClick={() => router.push(`/dashboard/board/${board.id}`)}>
                <div className="dashboard-quick-action-icon" style={{ background: 'rgba(255,90,196,0.15)', fontSize: 'var(--text-md)' }}>{board.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{board.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>HR Board</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
