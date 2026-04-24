'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useBoardStore, useUIStore } from '@/lib/store';
import { subscribeToItems, createItem, updateItem, deleteItem } from '@/lib/firestore';
import { generateId, formatDate, getInitials } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  Table, Kanban, Calendar, BarChart3, Filter, SortAsc,
  Plus, ChevronDown, ExternalLink, MoreVertical, Search, Download, Share2, Settings2
} from 'lucide-react';
import type { Board, Item, Column, ViewType } from '@/lib/types';
import ItemDetailPanel from '@/components/board/ItemDetailPanel';
import BoardAIInsights from '@/components/ai/insights/BoardAIInsights';

export default function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = use(params);
  const { user } = useAuth();
  const { boards, items, setItems, activeView, setActiveView, setActiveBoard, activeBoard } = useBoardStore();
  const { itemDetailOpen, selectedItemId, openItemDetail, closeItemDetail } = useUIStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [addingItemGroup, setAddingItemGroup] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      setActiveBoard(board);
      setActiveView(board.activeView || 'table');
    }
  }, [boardId, boards, setActiveBoard, setActiveView]);

  useEffect(() => {
    if (!boardId) return;
    const unsub = subscribeToItems(boardId, (boardItems) => setItems(boardItems));
    return () => unsub();
  }, [boardId, setItems]);

  const handleAddItem = useCallback(async (groupId: string) => {
    if (!newItemName.trim() || !activeBoard || !user) return;
    const item: Item = {
      id: generateId(),
      boardId: activeBoard.id,
      groupId,
      name: newItemName.trim(),
      values: {},
      position: items.filter(i => i.groupId === groupId).length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: user.uid,
      subscribers: [user.uid],
    };
    await createItem(item);
    setNewItemName('');
    setAddingItemGroup(null);
  }, [newItemName, activeBoard, user, items]);

  const handleUpdateValue = async (itemId: string, colId: string, val: any) => {
    const item = items.find(i => i.id === itemId);
    if (item) await updateItem(itemId, { values: { ...item.values, [colId]: val } });
  };

  if (!activeBoard) return null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Board Secondary Header */}
      <div style={{ padding: '24px 24px 0', borderBottom: '1px solid #e1e4e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '40px' }}>
            {['Main Table', 'Kanban', 'Calendar', 'Gantt', 'Chart'].map((view) => (
              <div 
                key={view}
                onClick={() => setActiveView(view.toLowerCase() as ViewType)}
                style={{ 
                  fontSize: '14px', padding: '8px 0', cursor: 'pointer',
                  color: activeView === view.toLowerCase() ? '#6161FF' : '#676879',
                  fontWeight: activeView === view.toLowerCase() ? 600 : 400,
                  borderBottom: activeView === view.toLowerCase() ? '2px solid #6161FF' : 'none'
                }}
              >
                {view}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', color: '#676879' }}>
            <Settings2 size={18} />
            <Download size={18} />
            <Share2 size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px' }}>
          <button 
            className="btn-monday-primary" 
            style={{ padding: '6px 16px', fontSize: '14px', borderRadius: '4px' }}
            onClick={() => setAddingItemGroup(activeBoard.groups[0]?.id)}
          >
            New Item
          </button>
          <div style={{ height: '32px', width: '1px', background: '#e1e4e8' }} />
          <button style={{ fontSize: '14px', color: '#676879', display: 'flex', alignItems: 'center', gap: '6px' }}><Search size={16} /> Search</button>
          <button style={{ fontSize: '14px', color: '#676879', display: 'flex', alignItems: 'center', gap: '6px' }}><Filter size={16} /> Filter</button>
          <button style={{ fontSize: '14px', color: '#676879', display: 'flex', alignItems: 'center', gap: '6px' }}><SortAsc size={16} /> Sort</button>
        </div>
      </div>

      {/* Main Board Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <BoardAIInsights board={activeBoard} items={items} />
        
        {activeBoard.groups.map(group => {
          const groupItems = items.filter(i => i.groupId === group.id && i.name.toLowerCase().includes(searchQuery.toLowerCase()));
          const isCollapsed = collapsedGroups.has(group.id);

          return (
            <div key={group.id} style={{ marginBottom: '32px' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}
                onClick={() => {
                  const n = new Set(collapsedGroups);
                  if (n.has(group.id)) n.delete(group.id); else n.add(group.id);
                  setCollapsedGroups(n);
                }}
              >
                <ChevronDown size={20} color={group.color} style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: group.color }}>{group.title}</h3>
                <span style={{ fontSize: '13px', color: '#9699a6', fontWeight: 400 }}>{groupItems.length} Items</span>
              </div>

              {!isCollapsed && (
                <table className="board-table-exact">
                  <thead>
                    <tr style={{ background: '#f5f6f8' }}>
                      <th style={{ width: '40px', borderLeft: `6px solid ${group.color}`, borderBottom: '1px solid #e1e4e8' }}></th>
                      <th style={{ minWidth: '400px', textAlign: 'left', padding: '10px 16px', fontSize: '13px', color: '#676879', fontWeight: 500, border: '1px solid #e1e4e8' }}>Item</th>
                      {activeBoard.columns.map(col => (
                        <th key={col.id} style={{ width: col.width, textAlign: 'center', fontSize: '13px', color: '#676879', fontWeight: 500, border: '1px solid #e1e4e8' }}>{col.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groupItems.map(item => (
                      <tr key={item.id} style={{ background: '#fff' }}>
                        <td style={{ borderLeft: `6px solid ${group.color}`, borderBottom: '1px solid #e1e4e8', padding: '0 8px' }}>
                          <input type="checkbox" style={{ cursor: 'pointer' }} />
                        </td>
                        <td style={{ border: '1px solid #e1e4e8', padding: '0 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '36px' }}>
                            <input 
                              style={{ border: 'none', background: 'transparent', fontSize: '14px', width: '100%', outline: 'none' }} 
                              defaultValue={item.name}
                              onBlur={(e) => updateItem(item.id, { name: e.target.value })}
                            />
                            <button onClick={() => openItemDetail(item.id)} style={{ padding: '4px', color: '#676879' }}><ExternalLink size={14} /></button>
                          </div>
                        </td>
                        {activeBoard.columns.map(col => (
                          <td key={col.id} style={{ border: '1px solid #e1e4e8', padding: '0', height: '36px' }}>
                            <ExactCellRenderer 
                              column={col} 
                              value={item.values[col.id]} 
                              onSave={(val) => handleUpdateValue(item.id, col.id, val)} 
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Add Item Row */}
                    <tr>
                      <td style={{ borderLeft: `6px solid ${group.color}` }}></td>
                      <td colSpan={activeBoard.columns.length + 1} style={{ border: '1px solid #e1e4e8', padding: '0 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '36px' }}>
                          <Plus size={16} color="#0073ea" />
                          <input 
                            style={{ border: 'none', background: 'transparent', padding: '0 12px', width: '100%', fontSize: '14px', outline: 'none' }} 
                            placeholder="+ Add Item" 
                            value={addingItemGroup === group.id ? newItemName : ''}
                            onFocus={() => setAddingItemGroup(group.id)}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(group.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>

      {itemDetailOpen && selectedItemId && (
        <ItemDetailPanel
          item={items.find(i => i.id === selectedItemId)!}
          board={activeBoard}
          onClose={closeItemDetail}
          onUpdateValue={handleUpdateValue}
          onUpdateName={(id, name) => updateItem(id, { name })}
        />
      )}
    </div>
  );
}

function ExactCellRenderer({ column, value, onSave }: { column: Column, value: any, onSave: (v: any) => void }) {
  const [showPicker, setShowPicker] = useState(false);

  switch (column.type) {
    case 'status':
    case 'priority':
      const labels = column.settings.labels || [];
      const current = labels.find(l => l.id === value);
      const color = current?.color || '#c4c4c4';
      return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <div 
            className="status-label-block" 
            style={{ backgroundColor: color, cursor: 'pointer' }}
            onClick={() => setShowPicker(!showPicker)}
          >
            {current?.text || ''}
          </div>
          {showPicker && (
            <div style={{ position: 'absolute', top: '38px', left: 0, zIndex: 1000, background: '#fff', border: '1px solid #d0d4e4', borderRadius: '4px', padding: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', width: '180px' }}>
              {labels.map(l => (
                <div key={l.id} 
                  style={{ background: l.color, color: '#fff', padding: '8px', marginBottom: '4px', textAlign: 'center', fontWeight: 600, fontSize: '13px', borderRadius: '3px', cursor: 'pointer' }}
                  onClick={() => { onSave(l.id); setShowPicker(false); }}
                >
                  {l.text}
                </div>
              ))}
              <div style={{ background: '#c4c4c4', color: '#fff', padding: '8px', textAlign: 'center', fontSize: '13px', borderRadius: '3px', cursor: 'pointer' }} onClick={() => { onSave(null); setShowPicker(false); }}>Clear</div>
            </div>
          )}
        </div>
      );
    case 'person':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: value ? '#6161FF' : '#f5f6f8', border: value ? 'none' : '1px dashed #d0d4e4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
            {value ? getInitials(value) : <Plus size={12} color="#c4c4c4" />}
          </div>
        </div>
      );
    case 'date':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '13px' }}>
          {value ? formatDate(value) : <span style={{ color: '#c4c4c4' }}>—</span>}
        </div>
      );
    default:
      return (
        <div style={{ padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          {value || ''}
        </div>
      );
  }
}
