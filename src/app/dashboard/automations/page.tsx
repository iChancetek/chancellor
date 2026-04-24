'use client';

import { useState } from 'react';
import { Zap, Plus, ArrowRight, ToggleLeft, ToggleRight, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  color: string;
  enabled: boolean;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<AutomationTemplate[]>([
    {
      id: '1', name: 'Auto-assign on creation',
      description: 'When an item is created, assign it to the board owner',
      trigger: 'Item Created', action: 'Assign Person',
      color: 'rgba(87, 155, 252, 0.15)', enabled: true,
    },
    {
      id: '2', name: 'Notify on status change',
      description: 'When status changes to "Done", notify the team',
      trigger: 'Status Changed', action: 'Send Notification',
      color: 'rgba(0, 200, 117, 0.15)', enabled: false,
    },
    {
      id: '3', name: 'Move overdue items',
      description: 'When due date passes, move item to "Stuck" status',
      trigger: 'Date Arrived', action: 'Change Status',
      color: 'rgba(253, 171, 61, 0.15)', enabled: true,
    },
    {
      id: '4', name: 'Escalation alert',
      description: 'When priority is set to "Critical", alert the manager',
      trigger: 'Column Changed', action: 'Send Email',
      color: 'rgba(226, 68, 92, 0.15)', enabled: false,
    },
  ]);

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const templates = [
    { name: 'Status → Notify', desc: 'When status changes, notify someone', color: 'rgba(87, 155, 252, 0.15)' },
    { name: 'Due Date → Move', desc: 'When a date arrives, move item to group', color: 'rgba(253, 171, 61, 0.15)' },
    { name: 'Created → Assign', desc: 'When item created, auto-assign owner', color: 'rgba(0, 200, 117, 0.15)' },
    { name: 'Priority → Email', desc: 'When priority is critical, send email', color: 'rgba(226, 68, 92, 0.15)' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>⚡ Automations</h1>
        <p>Automate repetitive tasks with no-code workflows. Set triggers and actions to keep work flowing.</p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(253, 171, 61, 0.1), rgba(253, 171, 61, 0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(253, 171, 61, 0.15)' }}>
            <Zap size={22} style={{ color: '#FDAB3D' }} />
          </div>
          <div className="dashboard-card-title">Automation Overview</div>
          <div className="dashboard-card-stats">
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value">{automations.length}</span>
              <span className="dashboard-card-stat-label">Total</span>
            </div>
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#00C875' }}>{automations.filter(a => a.enabled).length}</span>
              <span className="dashboard-card-stat-label">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Automations */}
      <div className="dashboard-section-title"><Zap size={18} style={{ color: '#FDAB3D' }} /> Your Automations</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {automations.map(auto => (
          <div key={auto.id} style={{
            background: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '20px',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: auto.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{auto.name}</div>
              <div style={{ fontSize: '13px', color: '#676879' }}>{auto.description}</div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', background: '#f0f1f3', padding: '2px 8px', borderRadius: '4px', color: '#676879' }}>
                  <Clock size={10} style={{ display: 'inline', marginRight: '4px' }} />{auto.trigger}
                </span>
                <span style={{ fontSize: '11px', background: '#f0f1f3', padding: '2px 8px', borderRadius: '4px', color: '#676879' }}>
                  <ArrowRight size={10} style={{ display: 'inline', marginRight: '4px' }} />{auto.action}
                </span>
              </div>
            </div>
            <button onClick={() => toggleAutomation(auto.id)} style={{ color: auto.enabled ? '#00C875' : '#c4c4c4' }}>
              {auto.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
        ))}
      </div>

      {/* Templates */}
      <div className="dashboard-section-title"><Plus size={18} style={{ color: '#6161FF' }} /> Automation Templates</div>
      <div className="dashboard-quick-actions">
        {templates.map(t => (
          <button key={t.name} className="dashboard-quick-action">
            <div className="dashboard-quick-action-icon" style={{ background: t.color }}><Zap size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
              <div style={{ fontSize: '12px', color: '#9699a6' }}>{t.desc}</div>
            </div>
            <ArrowRight size={14} style={{ color: '#9699a6', marginLeft: 'auto' }} />
          </button>
        ))}
      </div>
    </div>
  );
}
