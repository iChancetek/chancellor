'use client';

import { useAuth } from '@/lib/auth-context';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { Settings, Users, Shield, Database, Bell, Palette } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards } = useBoardStore();

  const sections = [
    {
      icon: <Users size={20} />, title: 'Team Members',
      desc: `1 member in ${activeWorkspace?.name || 'workspace'}`,
      color: 'rgba(87, 155, 252, 0.15)',
    },
    {
      icon: <Shield size={20} />, title: 'Permissions',
      desc: 'Manage roles and access controls',
      color: 'rgba(0, 200, 117, 0.15)',
    },
    {
      icon: <Database size={20} />, title: 'Data & Storage',
      desc: `${boards.length} boards across all modules`,
      color: 'rgba(253, 171, 61, 0.15)',
    },
    {
      icon: <Bell size={20} />, title: 'Notifications',
      desc: 'Configure notification preferences',
      color: 'rgba(226, 68, 92, 0.15)',
    },
    {
      icon: <Palette size={20} />, title: 'Appearance',
      desc: 'Customize workspace theme and branding',
      color: 'rgba(162, 93, 220, 0.15)',
    },
    {
      icon: <Settings size={20} />, title: 'General Settings',
      desc: 'Workspace name, timezone, and defaults',
      color: 'rgba(108, 92, 231, 0.15)',
    },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>⚙️ Administration</h1>
        <p>Manage your workspace settings, team members, and permissions.</p>
      </div>

      <div className="dashboard-grid">
        {sections.map((section) => (
          <div key={section.title} className="dashboard-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon" style={{ background: section.color }}>
                {section.icon}
              </div>
            </div>
            <div className="dashboard-card-title">{section.title}</div>
            <div className="dashboard-card-desc">{section.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px' }}>
        <div className="dashboard-section-title">Workspace Info</div>
        <div style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#9699a6', marginBottom: '4px' }}>Workspace Name</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{activeWorkspace?.name || 'My Workspace'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9699a6', marginBottom: '4px' }}>Owner</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{user?.displayName || 'User'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9699a6', marginBottom: '4px' }}>Email</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{user?.email || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9699a6', marginBottom: '4px' }}>Total Boards</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{boards.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
