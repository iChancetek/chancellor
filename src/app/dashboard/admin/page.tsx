'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useWorkspaceStore, useBoardStore, useSettingsStore } from '@/lib/store';
import { Settings, Users, Shield, Database, Bell, Palette, Check, Save, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const { activeWorkspace, updateWorkspaceLocal } = useWorkspaceStore();
  const { boards } = useBoardStore();
  const settings = useSettingsStore();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(activeWorkspace?.name || 'My Workspace');
  const [saved, setSaved] = useState(false);

  const handleSaveName = () => {
    if (activeWorkspace) {
      updateWorkspaceLocal(activeWorkspace.id, { name: nameValue });
      settings.setWorkspaceName(nameValue);
    }
    setEditingName(false);
    flashSaved();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'team', icon: <Users size={20} />, title: 'Team Members', desc: `${activeWorkspace?.members?.length || 1} member(s)`, color: 'rgba(87, 155, 252, 0.15)' },
    { id: 'permissions', icon: <Shield size={20} />, title: 'Permissions', desc: 'Manage roles and access controls', color: 'rgba(0, 200, 117, 0.15)' },
    { id: 'data', icon: <Database size={20} />, title: 'Data & Storage', desc: `${boards.length} boards across all modules`, color: 'rgba(253, 171, 61, 0.15)' },
    { id: 'notifications', icon: <Bell size={20} />, title: 'Notifications', desc: 'Configure notification preferences', color: 'rgba(226, 68, 92, 0.15)' },
    { id: 'appearance', icon: <Palette size={20} />, title: 'Appearance', desc: 'Customize workspace theme', color: 'rgba(162, 93, 220, 0.15)' },
    { id: 'general', icon: <Settings size={20} />, title: 'General Settings', desc: 'Workspace name, timezone, and defaults', color: 'rgba(108, 92, 231, 0.15)' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>⚙️ Administration</h1>
        <p>Manage your workspace settings, team members, and permissions.</p>
        {saved && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: '#00C875', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: 600, marginTop: '12px' }}>
            <Check size={14} /> Settings saved
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        {sections.map((section) => (
          <div 
            key={section.id} 
            className="dashboard-card" 
            style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', border: activeSection === section.id ? '2px solid #6161FF' : undefined }}
            onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div className="dashboard-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="dashboard-card-icon" style={{ background: section.color }}>
                {section.icon}
              </div>
              <ChevronRight size={16} style={{ color: '#c4c4c4', transform: activeSection === section.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            <div className="dashboard-card-title">{section.title}</div>
            <div className="dashboard-card-desc">{section.desc}</div>
          </div>
        ))}
      </div>

      {/* Expanded Section Panels */}
      {activeSection === 'team' && (
        <SettingsPanel title="Team Members">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f5f6f8', borderRadius: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6161FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{user?.displayName || 'User'}</div>
              <div style={{ fontSize: '12px', color: '#676879' }}>{user?.email}</div>
            </div>
            <span style={{ fontSize: '11px', background: '#6161FF', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>Owner</span>
          </div>
        </SettingsPanel>
      )}

      {activeSection === 'notifications' && (
        <SettingsPanel title="Notification Preferences">
          {[
            { key: 'notifyOnMention' as const, label: 'Mentions', desc: 'When someone mentions you in a comment' },
            { key: 'notifyOnAssignment' as const, label: 'Assignments', desc: 'When you are assigned to an item' },
            { key: 'notifyOnStatusChange' as const, label: 'Status Changes', desc: 'When a status column is updated' },
            { key: 'notifyOnComment' as const, label: 'Comments', desc: 'When someone comments on your items' },
          ].map(n => (
            <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{n.label}</div>
                <div style={{ fontSize: '12px', color: '#676879' }}>{n.desc}</div>
              </div>
              <button onClick={() => { settings.toggleNotification(n.key); flashSaved(); }} style={{ color: settings[n.key] ? '#00C875' : '#c4c4c4', background: 'none', border: 'none', cursor: 'pointer' }}>
                {settings[n.key] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          ))}
        </SettingsPanel>
      )}

      {activeSection === 'appearance' && (
        <SettingsPanel title="Appearance Settings">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Theme</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['light', 'dark'].map(t => (
                <button
                  key={t}
                  onClick={() => { settings.setTheme(t as 'light' | 'dark'); flashSaved(); }}
                  style={{
                    padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                    border: settings.theme === t ? '2px solid #6161FF' : '2px solid #e1e4e8',
                    background: t === 'dark' ? '#292f4c' : '#fff',
                    color: t === 'dark' ? '#fff' : '#323338',
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </SettingsPanel>
      )}

      {activeSection === 'general' && (
        <SettingsPanel title="General Settings">
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#676879', display: 'block', marginBottom: '6px' }}>Workspace Name</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', border: '1px solid #d0d4e4', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              />
              <button 
                onClick={handleSaveName}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#6161FF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
              >
                <Save size={14} /> Save
              </button>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#676879', display: 'block', marginBottom: '6px' }}>Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => { settings.setTimezone(e.target.value); flashSaved(); }}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #d0d4e4', borderRadius: '6px', fontSize: '14px', outline: 'none', background: '#fff' }}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
              <option value="Europe/London">London (GMT)</option>
            </select>
          </div>
        </SettingsPanel>
      )}

      {activeSection === 'data' && (
        <SettingsPanel title="Data & Storage">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '20px', background: '#f5f6f8', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#6161FF' }}>{boards.length}</div>
              <div style={{ fontSize: '12px', color: '#676879', marginTop: '4px' }}>Total Boards</div>
            </div>
            <div style={{ padding: '20px', background: '#f5f6f8', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#00C875' }}>{boards.filter(b => b.type === 'work').length}</div>
              <div style={{ fontSize: '12px', color: '#676879', marginTop: '4px' }}>Work Boards</div>
            </div>
            <div style={{ padding: '20px', background: '#f5f6f8', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FDAB3D' }}>{boards.filter(b => b.type === 'crm').length}</div>
              <div style={{ fontSize: '12px', color: '#676879', marginTop: '4px' }}>CRM Boards</div>
            </div>
          </div>
        </SettingsPanel>
      )}

      {activeSection === 'permissions' && (
        <SettingsPanel title="Permissions & Roles">
          <div style={{ padding: '16px', background: '#f5f6f8', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600 }}>Owner</span>
              <span style={{ fontSize: '12px', color: '#676879' }}>Full access to all workspace settings</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600 }}>Admin</span>
              <span style={{ fontSize: '12px', color: '#676879' }}>Can manage boards, members, and settings</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600 }}>Member</span>
              <span style={{ fontSize: '12px', color: '#676879' }}>Can create and edit boards and items</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Viewer</span>
              <span style={{ fontSize: '12px', color: '#676879' }}>Read-only access to boards</span>
            </div>
          </div>
        </SettingsPanel>
      )}

      {/* Workspace Info */}
      <div style={{ marginTop: '32px' }}>
        <div className="dashboard-section-title">Workspace Info</div>
        <div style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#9699a6', marginBottom: '4px' }}>Workspace Name</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{activeWorkspace?.name || settings.workspaceName}</div>
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

function SettingsPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '24px', background: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#323338' }}>{title}</h3>
      {children}
    </div>
  );
}
