'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isSuperAdmin } from '@/lib/admin';
import { useRBACStore, useWorkspaceStore, useBoardStore } from '@/lib/store';
import {
  getRoleLabel, getRoleBadgeColor, getRoleIcon, ROLE_HIERARCHY,
  ALL_MODULES, ALL_ACTIONS, canAccess, DEFAULT_ROLE_PERMISSIONS
} from '@/lib/rbac';
import type { SystemRole, ModuleScope, PermissionAction, MemberPermissions } from '@/lib/types';
import {
  ArrowLeft, Shield, Users, ShieldCheck, Eye, Plus, Trash2,
  Lock, Unlock, CheckCircle2, XCircle, Crown, AlertTriangle,
  Search, ChevronDown, Building2, Layers, Settings, FileText
} from 'lucide-react';

const MOCK_MEMBERS: MemberPermissions[] = [
  { uid: 'u1', email: 'chancellor@ichancetek.com', displayName: 'Chancellor Admin', systemRole: 'super_admin', permissions: [], grantedBy: 'system', grantedAt: Date.now(), updatedAt: Date.now() },
  { uid: 'u2', email: 'sarah.chen@company.com', displayName: 'Sarah Chen', systemRole: 'manager', permissions: [], grantedBy: 'u1', grantedAt: Date.now(), updatedAt: Date.now() },
  { uid: 'u3', email: 'marcus.johnson@company.com', displayName: 'Marcus Johnson', systemRole: 'team_lead', permissions: [], grantedBy: 'u1', grantedAt: Date.now(), updatedAt: Date.now() },
  { uid: 'u4', email: 'emily.rodriguez@company.com', displayName: 'Emily Rodriguez', systemRole: 'member', permissions: [], grantedBy: 'u2', grantedAt: Date.now(), updatedAt: Date.now() },
  { uid: 'u5', email: 'alex.kim@company.com', displayName: 'Alex Kim', systemRole: 'viewer', permissions: [], grantedBy: 'u2', grantedAt: Date.now(), updatedAt: Date.now() },
];

export default function GovernancePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { memberPermissions, setMemberPermissions, updateMemberRole } = useRBACStore();
  const { boards } = useBoardStore();
  const [activeTab, setActiveTab] = useState<'members' | 'permissions' | 'boards' | 'audit'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Initialize with mock data if empty
  const members = memberPermissions.length > 0 ? memberPermissions : MOCK_MEMBERS;
  if (memberPermissions.length === 0) {
    setTimeout(() => setMemberPermissions(MOCK_MEMBERS), 0);
  }

  if (loading || !user) return null;
  if (!isSuperAdmin(user.email)) { router.push('/dashboard'); return null; }

  const filteredMembers = members.filter(m =>
    m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (uid: string, newRole: SystemRole) => {
    updateMemberRole(uid, newRole, user.uid);
  };

  const tabs = [
    { id: 'members' as const, label: 'Members & Roles', icon: <Users size={16} /> },
    { id: 'permissions' as const, label: 'Permission Matrix', icon: <Shield size={16} /> },
    { id: 'boards' as const, label: 'Board Access', icon: <Layers size={16} /> },
    { id: 'audit' as const, label: 'Access Log', icon: <FileText size={16} /> },
  ];

  const roleOptions: SystemRole[] = ['super_admin', 'admin', 'manager', 'team_lead', 'member', 'viewer'];

  return (
    <div style={{ padding: 'clamp(16px, 5vw, 40px)', background: '#f5f6f8', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => router.push('/dashboard/admin')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#676879', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
          <ArrowLeft size={18} /> Admin
        </button>
        <div style={{ width: '1px', height: '24px', background: '#d0d4e4' }} />
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#323338' }}>Governance & Access Control</h1>
          <p style={{ fontSize: '14px', color: '#676879', marginTop: '4px' }}>Manage roles, permissions, and data access across CRM, ERP, Finance, and all modules.</p>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Members', value: members.length, icon: <Users size={20} />, color: '#579BFC' },
          { label: 'Admin Users', value: members.filter(m => m.systemRole === 'admin' || m.systemRole === 'super_admin').length, icon: <Crown size={20} />, color: '#E2445C' },
          { label: 'Protected Boards', value: boards.filter(b => b.accessControl).length, icon: <Lock size={20} />, color: '#FDAB3D' },
          { label: 'Compliance', value: '100%', icon: <ShieldCheck size={20} />, color: '#00C875' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #e1e4e8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#323338' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#676879', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Nav */}
      <div style={{ display: 'flex', gap: '4px', background: '#fff', borderRadius: '12px', padding: '4px', marginBottom: '24px', border: '1px solid #e1e4e8' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            background: activeTab === t.id ? '#6161FF' : 'transparent',
            color: activeTab === t.id ? '#fff' : '#676879', transition: 'all 0.2s'
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* MEMBERS TAB */}
      {activeTab === 'members' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e1e4e8', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#676879' }} />
              <input type="text" placeholder="Search members..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #d0d4e4', fontSize: '13px', outline: 'none' }} />
            </div>
            <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6161FF', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Add Member
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fb' }}>
                {['Member', 'Email', 'System Role', 'Modules', 'Sensitive Data', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#676879', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(m => {
                const badge = getRoleBadgeColor(m.systemRole);
                const perms = DEFAULT_ROLE_PERMISSIONS[m.systemRole];
                const moduleCount = perms.filter(p => p.actions.includes('view')).length;
                const hasSensitive = perms.some(p => p.sensitiveData);
                return (
                  <tr key={m.uid} style={{ borderTop: '1px solid #f0f1f3' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          {getRoleIcon(m.systemRole)}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{m.displayName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#676879' }}>{m.email}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <select value={m.systemRole} onChange={e => handleRoleChange(m.uid, e.target.value as SystemRole)}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #d0d4e4', fontSize: '12px', fontWeight: 700, background: badge.bg, color: badge.color, cursor: 'pointer', outline: 'none' }}>
                        {roleOptions.map(r => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#579BFC' }}>{moduleCount} / {ALL_MODULES.length}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {hasSensitive
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#00C875' }}><Unlock size={14} /> Granted</span>
                        : <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#E2445C' }}><Lock size={14} /> Restricted</span>
                      }
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button onClick={() => setSelectedMember(m.uid === selectedMember ? null : m.uid)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d0d4e4', background: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#6161FF' }}>
                        {m.uid === selectedMember ? 'Close' : 'Configure'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PERMISSION MATRIX TAB */}
      {activeTab === 'permissions' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', overflow: 'auto' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e1e4e8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="#6161FF" /> Role × Module × Action Matrix
            </h3>
            <p style={{ fontSize: '12px', color: '#676879', marginTop: '4px' }}>Default permissions per system role. Checkmarks indicate granted access.</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8f9fb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, fontSize: '11px', color: '#676879', textTransform: 'uppercase', position: 'sticky', left: 0, background: '#f8f9fb', minWidth: '120px' }}>Role</th>
                {ALL_MODULES.map(m => (
                  <th key={m} colSpan={3} style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 800, fontSize: '10px', color: '#323338', textTransform: 'uppercase', borderLeft: '2px solid #e1e4e8' }}>{m}</th>
                ))}
              </tr>
              <tr style={{ background: '#fcfcfd' }}>
                <th style={{ position: 'sticky', left: 0, background: '#fcfcfd' }}></th>
                {ALL_MODULES.map(m => (
                  ['View', 'Edit', 'Admin'].map(a => (
                    <th key={`${m}-${a}`} style={{ padding: '6px 4px', textAlign: 'center', fontSize: '9px', color: '#9699a6', fontWeight: 600, borderLeft: a === 'View' ? '2px solid #e1e4e8' : 'none' }}>{a}</th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLE_HIERARCHY.slice().reverse().map(role => {
                const perms = DEFAULT_ROLE_PERMISSIONS[role];
                const badge = getRoleBadgeColor(role);
                return (
                  <tr key={role} style={{ borderTop: '1px solid #f0f1f3' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, position: 'sticky', left: 0, background: '#fff' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', background: badge.bg, color: badge.color, fontSize: '11px' }}>{getRoleLabel(role)}</span>
                    </td>
                    {ALL_MODULES.map(mod => {
                      const rule = perms.find(p => p.module === mod);
                      const hasView = rule?.actions.includes('view');
                      const hasEdit = rule?.actions.includes('edit');
                      const hasAdmin = rule?.actions.includes('admin');
                      return ['view', 'edit', 'admin'].map((action, i) => {
                        const has = action === 'view' ? hasView : action === 'edit' ? hasEdit : hasAdmin;
                        return (
                          <td key={`${mod}-${action}`} style={{ padding: '8px 4px', textAlign: 'center', borderLeft: i === 0 ? '2px solid #e1e4e8' : 'none' }}>
                            {has
                              ? <CheckCircle2 size={16} color="#00C875" />
                              : <XCircle size={14} color="#d0d4e4" />
                            }
                          </td>
                        );
                      });
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* BOARD ACCESS TAB */}
      {activeTab === 'boards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {boards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', color: '#676879' }}>
              <Layers size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
              <p style={{ fontWeight: 600 }}>No boards created yet.</p>
            </div>
          ) : boards.map(board => {
            const ac = board.accessControl;
            const isRestricted = ac && (ac.restrictedTo?.length || ac.minRole);
            return (
              <div key={board.id} style={{ padding: '20px 24px', borderRadius: '16px', border: '1px solid #e1e4e8', background: '#fff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${board.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{board.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{board.name}</div>
                  <div style={{ fontSize: '12px', color: '#676879', marginTop: '2px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '999px', background: 'rgba(87,155,252,0.1)', color: '#579BFC', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{board.type}</span>
                    {board.groups.length} groups
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isRestricted
                    ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(253,171,61,0.1)', color: '#FDAB3D', fontSize: '11px', fontWeight: 700 }}><Lock size={12} /> Restricted</span>
                    : <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(0,200,117,0.1)', color: '#00C875', fontSize: '11px', fontWeight: 700 }}><Unlock size={12} /> Open</span>
                  }
                  <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #d0d4e4', background: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#6161FF' }}>Manage Access</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e1e4e8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#579BFC" /> Permission Change Log
            </h3>
          </div>
          {[
            { time: '2 min ago', action: 'Role changed to Manager', user: 'Sarah Chen', by: 'Chancellor Admin', severity: 'info' },
            { time: '1 hr ago', action: 'Sensitive data access revoked', user: 'Alex Kim', by: 'Chancellor Admin', severity: 'warning' },
            { time: '3 hr ago', action: 'Added to Finance board', user: 'Marcus Johnson', by: 'Sarah Chen', severity: 'info' },
            { time: '1 day ago', action: 'Role changed from Viewer to Member', user: 'Emily Rodriguez', by: 'Sarah Chen', severity: 'info' },
            { time: '2 days ago', action: 'Board access restricted — AR Dashboard', user: 'System', by: 'Chancellor Admin', severity: 'warning' },
          ].map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', padding: '16px 24px', borderBottom: '1px solid #f0f1f3', alignItems: 'center' }}>
              <div style={{ flexShrink: 0 }}>
                {log.severity === 'warning'
                  ? <AlertTriangle size={16} color="#FDAB3D" />
                  : <CheckCircle2 size={16} color="#00C875" />
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{log.action}</div>
                <div style={{ fontSize: '11px', color: '#676879', marginTop: '2px' }}>
                  {log.user} · by {log.by} · {log.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
