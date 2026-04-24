'use client';

import { useState } from 'react';
import { useAutomationStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { Zap, Plus, ArrowRight, ToggleLeft, ToggleRight, Clock, Trash2, Check, X } from 'lucide-react';

export default function AutomationsPage() {
  const { automations, toggleAutomation, addAutomation, removeAutomation } = useAutomationStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTrigger, setNewTrigger] = useState('Item Created');
  const [newAction, setNewAction] = useState('Assign Person');
  const [saved, setSaved] = useState(false);

  const triggerOptions = ['Item Created', 'Status Changed', 'Date Arrived', 'Column Changed', 'Item Moved'];
  const actionOptions = ['Assign Person', 'Send Notification', 'Change Status', 'Send Email', 'Move Item', 'Create Item'];
  const colors = ['rgba(87, 155, 252, 0.15)', 'rgba(0, 200, 117, 0.15)', 'rgba(253, 171, 61, 0.15)', 'rgba(226, 68, 92, 0.15)', 'rgba(162, 93, 220, 0.15)'];

  const handleCreate = () => {
    if (!newName.trim()) return;
    addAutomation({
      id: generateId(),
      name: newName.trim(),
      description: newDescription.trim() || `When ${newTrigger.toLowerCase()}, ${newAction.toLowerCase()}`,
      trigger: newTrigger,
      action: newAction,
      color: colors[Math.floor(Math.random() * colors.length)],
      enabled: true,
    });
    setNewName('');
    setNewDescription('');
    setShowCreateModal(false);
    flashSaved();
  };

  const handleToggle = (id: string) => {
    toggleAutomation(id);
    flashSaved();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this automation?')) {
      removeAutomation(id);
      flashSaved();
    }
  };

  const handleActivateTemplate = (name: string, desc: string, trigger: string, action: string, color: string) => {
    addAutomation({
      id: generateId(),
      name,
      description: desc,
      trigger,
      action,
      color,
      enabled: true,
    });
    flashSaved();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const templates = [
    { name: 'Status → Notify', desc: 'When status changes, notify someone', trigger: 'Status Changed', action: 'Send Notification', color: 'rgba(87, 155, 252, 0.15)' },
    { name: 'Due Date → Move', desc: 'When a date arrives, move item to group', trigger: 'Date Arrived', action: 'Move Item', color: 'rgba(253, 171, 61, 0.15)' },
    { name: 'Created → Assign', desc: 'When item created, auto-assign owner', trigger: 'Item Created', action: 'Assign Person', color: 'rgba(0, 200, 117, 0.15)' },
    { name: 'Priority → Email', desc: 'When priority is critical, send email', trigger: 'Column Changed', action: 'Send Email', color: 'rgba(226, 68, 92, 0.15)' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>⚡ Automations</h1>
            <p>Automate repetitive tasks with no-code workflows. Set triggers and actions to keep work flowing.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#6161FF', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
          >
            <Plus size={16} /> Create Automation
          </button>
        </div>
        {saved && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: '#00C875', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: 600, marginTop: '12px' }}>
            <Check size={14} /> Changes saved
          </div>
        )}
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
            <div className="dashboard-card-stat">
              <span className="dashboard-card-stat-value" style={{ color: '#E2445C' }}>{automations.filter(a => !a.enabled).length}</span>
              <span className="dashboard-card-stat-label">Paused</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Automations */}
      <div className="dashboard-section-title"><Zap size={18} style={{ color: '#FDAB3D' }} /> Your Automations</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {automations.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#676879', background: '#f5f6f8', borderRadius: '12px' }}>
            <Zap size={40} style={{ marginBottom: '12px', color: '#d0d4e4' }} />
            <p>No automations yet. Create one or use a template below!</p>
          </div>
        )}
        {automations.map(auto => (
          <div key={auto.id} style={{
            background: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '20px',
            display: 'flex', alignItems: 'center', gap: '16px',
            opacity: auto.enabled ? 1 : 0.6, transition: 'opacity 0.2s',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: auto.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{auto.name}</div>
              <div style={{ fontSize: '13px', color: '#676879' }}>{auto.description}</div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', background: '#f0f1f3', padding: '2px 8px', borderRadius: '4px', color: '#676879', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} />{auto.trigger}
                </span>
                <span style={{ fontSize: '11px', background: '#f0f1f3', padding: '2px 8px', borderRadius: '4px', color: '#676879', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowRight size={10} />{auto.action}
                </span>
              </div>
            </div>
            <button onClick={() => handleToggle(auto.id)} style={{ color: auto.enabled ? '#00C875' : '#c4c4c4', background: 'none', border: 'none', cursor: 'pointer' }}>
              {auto.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
            <button onClick={() => handleDelete(auto.id)} style={{ color: '#E2445C', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Templates */}
      <div className="dashboard-section-title"><Plus size={18} style={{ color: '#6161FF' }} /> Automation Templates</div>
      <div className="dashboard-quick-actions">
        {templates.map(t => (
          <button 
            key={t.name} 
            className="dashboard-quick-action"
            onClick={() => handleActivateTemplate(t.name, t.desc, t.trigger, t.action, t.color)}
          >
            <div className="dashboard-quick-action-icon" style={{ background: t.color }}><Zap size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
              <div style={{ fontSize: '12px', color: '#9699a6' }}>{t.desc}</div>
            </div>
            <ArrowRight size={14} style={{ color: '#9699a6', marginLeft: 'auto' }} />
          </button>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '480px', maxWidth: '90vw', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Create Automation</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#676879' }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#676879', display: 'block', marginBottom: '6px' }}>Name</label>
              <input 
                value={newName} onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Auto-assign tasks"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d0d4e4', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#676879', display: 'block', marginBottom: '6px' }}>Description</label>
              <input 
                value={newDescription} onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe what this automation does..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d0d4e4', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#676879', display: 'block', marginBottom: '6px' }}>Trigger</label>
                <select
                  value={newTrigger} onChange={(e) => setNewTrigger(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d0d4e4', borderRadius: '6px', fontSize: '14px', outline: 'none', background: '#fff' }}
                >
                  {triggerOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#676879', display: 'block', marginBottom: '6px' }}>Action</label>
                <select
                  value={newAction} onChange={(e) => setNewAction(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d0d4e4', borderRadius: '6px', fontSize: '14px', outline: 'none', background: '#fff' }}
                >
                  {actionOptions.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: '10px 20px', border: '1px solid #d0d4e4', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', background: '#fff' }}>
                Cancel
              </button>
              <button onClick={handleCreate} style={{ padding: '10px 20px', background: '#6161FF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                Create Automation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
