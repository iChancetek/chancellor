'use client';

import { useState } from 'react';
import { X, MessageSquare, Clock, User, Send, Bell, Home, Share2, MoreHorizontal } from 'lucide-react';
import { formatDate, formatRelativeTime, getInitials, generateId } from '@/lib/utils';
import type { Board, Item, Column } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

interface ItemDetailPanelProps {
  item: Item;
  board: Board;
  onClose: () => void;
  onUpdateValue: (itemId: string, columnId: string, value: unknown) => void;
  onUpdateName: (itemId: string, name: string) => void;
}

export default function ItemDetailPanel({ item, board, onClose, onUpdateValue, onUpdateName }: ItemDetailPanelProps) {
  const { user } = useAuth();
  const [localName, setLocalName] = useState(item.name);
  const [activeTab, setActiveTab] = useState('Updates');

  const tabs = ['Updates', 'Activity Log', 'Files'];

  return (
    <div className="item-side-panel">
      <div className="side-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={onClose}><X size={20} color="#676879" /></button>
          <div style={{ height: '24px', width: '1px', background: 'var(--border-light)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#676879' }}>
            <Home size={16} /> Item details
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', color: '#676879' }}>
          <Bell size={18} />
          <Share2 size={18} />
          <MoreHorizontal size={18} />
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <input 
          style={{ fontSize: '28px', fontWeight: 700, border: 'none', width: '100%', outline: 'none', marginBottom: '10px' }}
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onBlur={() => onUpdateName(item.id, localName)}
        />
        
        <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #e6e9ef', marginTop: '20px' }}>
          {tabs.map(tab => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                padding: '10px 0', fontSize: '14px', cursor: 'pointer',
                color: activeTab === tab ? '#0073ea' : '#676879',
                borderBottom: activeTab === tab ? '2px solid #0073ea' : 'none',
                fontWeight: activeTab === tab ? 600 : 400
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 32px', overflowY: 'auto' }}>
        {activeTab === 'Updates' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ border: '1px solid #d0d4e4', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#579bfc', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getInitials(user?.displayName || 'U')}
                </div>
                <textarea 
                  placeholder="Write an update..." 
                  style={{ border: 'none', width: '100%', resize: 'none', outline: 'none', fontSize: '16px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button className="btn-primary-monday" style={{ padding: '8px 24px', fontSize: '14px' }}>Update</button>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9699a6' }}>
              <MessageSquare size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#323338' }}>No updates yet</p>
              <p style={{ fontSize: '14px' }}>Be the first to update your team on what&apos;s happening with this item!</p>
            </div>
          </div>
        )}

        {activeTab === 'Activity Log' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#676879" />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600 }}>Item created</p>
                <p style={{ fontSize: '12px', color: '#676879' }}>{formatDate(item.createdAt)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
