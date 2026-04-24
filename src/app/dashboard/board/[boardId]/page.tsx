'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useBoardStore, useUIStore } from '@/lib/store';
import { subscribeToItems, createItem, updateItem as firestoreUpdateItem } from '@/lib/firestore';
import { generateId, formatDate, getInitials } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  Plus, ChevronDown, ExternalLink, Search, Settings2, Save, Volume2, Loader2
} from 'lucide-react';
import type { Board, Item, Column, ViewType } from '@/lib/types';
import ItemDetailPanel from '@/components/board/ItemDetailPanel';
import BoardAIInsights from '@/components/ai/insights/BoardAIInsights';

export default function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = use(params);
  const { user } = useAuth();
  const { boards, items, setItems, syncBoardItems, addItem, updateItem, removeItem, activeView, setActiveView, setActiveBoard, activeBoard } = useBoardStore();
  const { itemDetailOpen, selectedItemId, openItemDetail, closeItemDetail } = useUIStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [addingItemGroup, setAddingItemGroup] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      setActiveBoard(board);
      setActiveView(board.activeView || 'table');
    }
  }, [boardId, boards, setActiveBoard, setActiveView]);

  // Background Cloud Sync (Reads)
  useEffect(() => {
    if (!boardId) return;
    const unsub = subscribeToItems(boardId, (serverItems) => {
      syncBoardItems(boardId, serverItems);
    });
    return () => unsub();
  }, [boardId, syncBoardItems]);

  const handleAddItem = useCallback((groupId: string, overrideName?: string) => {
    const finalName = overrideName || newItemName;
    if (!finalName.trim() || !activeBoard || !user) return;
    const item: Item = {
      id: generateId(),
      boardId: activeBoard.id,
      groupId,
      name: finalName.trim(),
      values: {},
      position: items.filter(i => i.groupId === groupId).length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: user.uid,
      subscribers: [user.uid],
    };
    // Optimistic UI: update local state instantly
    addItem(item);
    if (!overrideName) setNewItemName('');
    setAddingItemGroup(null);
    flashSave();
    
    // Background Cloud Sync
    createItem(item).catch(err => console.error('Failed to sync item creation:', err));
  }, [newItemName, activeBoard, user, items, addItem]);

  const handleCalendarAdd = useCallback((date: Date) => {
    if (!activeBoard || !user) return;
    const name = window.prompt("Enter new task name for " + date.toLocaleDateString() + ":");
    if (!name?.trim()) return;

    const groupId = activeBoard.groups[0]?.id;
    if (!groupId) return;

    const item: Item = {
      id: generateId(),
      boardId: activeBoard.id,
      groupId,
      name: name.trim(),
      values: { date: date.getTime() },
      position: items.filter(i => i.groupId === groupId).length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: user.uid,
      subscribers: [user.uid],
    };

    addItem(item);
    flashSave();
    createItem(item).catch(err => console.error('Failed to sync item creation:', err));
  }, [activeBoard, user, items, addItem]);

  const handleUpdateValue = (itemId: string, colId: string, val: any) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      // Optimistic local update
      updateItem(itemId, { values: { ...item.values, [colId]: val } });
      flashSave();
      
      // Background Cloud Sync
      firestoreUpdateItem(itemId, { values: { ...item.values, [colId]: val } }).catch(err => console.error('Failed to sync value update:', err));
    }
  };

  const handleUpdateName = (itemId: string, name: string) => {
    // Optimistic local update
    updateItem(itemId, { name });
    flashSave();
    
    // Background Cloud Sync
    firestoreUpdateItem(itemId, { name }).catch(err => console.error('Failed to sync name update:', err));
  };

  const handleListenToBoard = async () => {
    if (!activeBoard || items.length === 0 || isListening) return;
    setIsListening(true);
    
    try {
      const boardSummary = `Board: ${activeBoard.name}. Description: ${activeBoard.description}. There are ${activeBoard.groups.length} groups and ${items.length} items total. ` +
        activeBoard.groups.map(g => {
          const gItems = items.filter(i => i.groupId === g.id);
          return `Group ${g.title} has ${gItems.length} items: ${gItems.map(i => i.name).join(', ')}. `;
        }).join(' ');

      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: boardSummary }),
      });

      if (!response.ok) throw new Error('TTS failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => setIsListening(false);
      audio.play();
    } catch (err) {
      console.error('Failed to play board audio:', err);
      setIsListening(false);
    }
  };

  const flashSave = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 600);
  };

  const boardItems = items.filter(i => i.boardId === boardId);

  if (!activeBoard) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#676879' }}>
      <p>Board not found. Please select a board from the sidebar.</p>
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Board Secondary Header */}
      <div style={{ padding: '24px 24px 0', borderBottom: '1px solid #e1e4e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '40px' }}>
            {['Main Table', 'Kanban', 'Calendar', 'Gantt', 'Chart'].map((view) => {
              const viewKey = view === 'Main Table' ? 'table' : view === 'Gantt' ? 'timeline' : view.toLowerCase();
              const isActive = activeView === viewKey;
              return (
                <div 
                  key={view}
                  onClick={() => setActiveView(viewKey as ViewType)}
                  style={{ 
                    fontSize: '14px', padding: '8px 0', cursor: 'pointer',
                    color: isActive ? '#6161FF' : '#676879',
                    fontWeight: isActive ? 600 : 400,
                    borderBottom: isActive ? '2px solid #6161FF' : 'none'
                  }}
                >
                  {view}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#676879' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: saveStatus === 'saving' ? '#FDAB3D' : '#00C875' }}>
              <Save size={14} />
              {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
            </div>
            <Settings2 size={18} />
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '12px', paddingBottom: '16px' }}>
          <button onClick={() => { 
            if (!activeBoard?.groups[0]) return;
            if (activeView === 'table') {
              setAddingItemGroup(activeBoard.groups[0].id);
            } else {
              const name = window.prompt("Enter new task name:");
              if (name && name.trim()) handleAddItem(activeBoard.groups[0].id, name.trim());
            }
          }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#6161FF', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            <Plus size={14} /> New Item
          </button>
          
          <button 
            onClick={handleListenToBoard}
            disabled={isListening}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: isListening ? '#f5f6f8' : '#fff', color: isListening ? '#676879' : '#323338', borderRadius: '4px', fontSize: '13px', fontWeight: 600, border: '1px solid #d0d4e4', cursor: isListening ? 'default' : 'pointer' }}
          >
            {isListening ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />} 
            {isListening ? 'Listening...' : 'Listen to Board'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid #d0d4e4', borderRadius: '4px', fontSize: '13px', color: '#676879' }}>
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', width: '120px' }} 
            />
          </div>
        </div>
      </div>

      {/* Main Board Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <BoardAIInsights board={activeBoard} items={boardItems} />
        
        {activeView === 'table' ? (
          <TableView 
            board={activeBoard} 
            items={boardItems} 
            searchQuery={searchQuery}
            collapsedGroups={collapsedGroups}
            setCollapsedGroups={setCollapsedGroups}
            addingItemGroup={addingItemGroup}
            setAddingItemGroup={setAddingItemGroup}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            handleAddItem={handleAddItem}
            handleUpdateValue={handleUpdateValue}
            handleUpdateName={handleUpdateName}
            openItemDetail={openItemDetail}
          />
        ) : activeView === 'kanban' ? (
          <KanbanView 
            board={activeBoard} 
            items={boardItems} 
            searchQuery={searchQuery}
            onUpdateValue={handleUpdateValue}
            openItemDetail={openItemDetail}
          />
        ) : activeView === 'calendar' ? (
          <CalendarView board={activeBoard} items={boardItems} openItemDetail={openItemDetail} onAddEvent={handleCalendarAdd} />
        ) : activeView === 'timeline' ? (
          <TimelineView board={activeBoard} items={boardItems} openItemDetail={openItemDetail} />
        ) : activeView === 'chart' ? (
          <ChartView board={activeBoard} items={boardItems} />
        ) : null}
      </div>

      {itemDetailOpen && selectedItemId && (
        <ItemDetailPanel
          item={boardItems.find(i => i.id === selectedItemId)!}
          board={activeBoard}
          onClose={closeItemDetail}
          onUpdateValue={handleUpdateValue}
          onUpdateName={(id, name) => { handleUpdateName(id, name); }}
        />
      )}
    </div>
  );
}

/* ─── Table View ────────────────────────────────────────── */

function TableView({ board, items, searchQuery, collapsedGroups, setCollapsedGroups, addingItemGroup, setAddingItemGroup, newItemName, setNewItemName, handleAddItem, handleUpdateValue, handleUpdateName, openItemDetail }: any) {
  return (
    <>
      {board.groups.map((group: any) => {
        const groupItems = items.filter((i: any) => i.groupId === group.id && i.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
              <ChevronDown size={20} color={group.color} style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: group.color }}>{group.title}</h3>
              <span style={{ fontSize: '13px', color: '#9699a6', fontWeight: 400 }}>{groupItems.length} Items</span>
            </div>

            {!isCollapsed && (
              <table className="board-table-exact">
                <thead>
                  <tr style={{ background: '#f5f6f8' }}>
                    <th style={{ width: '40px', borderLeft: `6px solid ${group.color}`, borderBottom: '1px solid #e1e4e8' }}></th>
                    <th style={{ minWidth: '400px', textAlign: 'left', padding: '10px 16px', fontSize: '13px', color: '#676879', fontWeight: 500, border: '1px solid #e1e4e8' }}>Item</th>
                    {board.columns.map((col: any) => (
                      <th key={col.id} style={{ width: col.width, textAlign: 'center', fontSize: '13px', color: '#676879', fontWeight: 500, border: '1px solid #e1e4e8' }}>{col.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupItems.map((item: any) => (
                    <tr key={item.id} style={{ background: '#fff' }}>
                      <td style={{ borderLeft: `6px solid ${group.color}`, borderBottom: '1px solid #e1e4e8', padding: '0 8px' }}>
                        <input type="checkbox" style={{ cursor: 'pointer' }} />
                      </td>
                      <td style={{ border: '1px solid #e1e4e8', padding: '0 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '36px' }}>
                          <input 
                            style={{ border: 'none', background: 'transparent', fontSize: '14px', width: '100%', outline: 'none' }} 
                            defaultValue={item.name}
                            onBlur={(e) => handleUpdateName(item.id, e.target.value)}
                          />
                          <button onClick={() => openItemDetail(item.id)} style={{ padding: '4px', color: '#676879', background: 'none', border: 'none', cursor: 'pointer' }}><ExternalLink size={14} /></button>
                        </div>
                      </td>
                      {board.columns.map((col: any) => (
                        <td key={col.id} style={{ border: '1px solid #e1e4e8', padding: '0', height: '36px' }}>
                          <ExactCellRenderer 
                            column={col} 
                            value={item.values[col.id]} 
                            onSave={(val: any) => handleUpdateValue(item.id, col.id, val)} 
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Add Item Row */}
                  <tr>
                    <td style={{ borderLeft: `6px solid ${group.color}` }}></td>
                    <td colSpan={board.columns.length + 1} style={{ border: '1px solid #e1e4e8', padding: '0 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', height: '36px' }}>
                        <Plus size={16} color="#0073ea" />
                        <input 
                          style={{ border: 'none', background: 'transparent', padding: '0 12px', width: '100%', fontSize: '14px', outline: 'none' }} 
                          placeholder="+ Add Item" 
                          value={addingItemGroup === group.id ? newItemName : ''}
                          onFocus={() => setAddingItemGroup(group.id)}
                          onChange={(e: any) => setNewItemName(e.target.value)}
                          onKeyDown={(e: any) => e.key === 'Enter' && handleAddItem(group.id)}
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
    </>
  );
}

/* ─── Kanban View ───────────────────────────────────────── */

function KanbanView({ board, items, searchQuery, onUpdateValue, openItemDetail }: any) {
  const statusCol = board.columns.find((c: Column) => c.type === 'status');
  const labels = statusCol?.settings?.labels || [];
  const allLabels = [...labels, { id: '__none__', text: 'No Status', color: '#c4c4c4' }];

  return (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '24px', minHeight: '500px' }}>
      {allLabels.map((label: any) => {
        const columnItems = items.filter((item: Item) => {
          const statusVal = item.values?.status;
          if (label.id === '__none__') return !statusVal;
          return statusVal === label.id;
        }).filter((item: Item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

        return (
          <div key={label.id} style={{ minWidth: '280px', maxWidth: '280px', flex: '0 0 280px' }}>
            {/* Column Header */}
            <div style={{ 
              background: label.color, color: '#fff', padding: '12px 16px', borderRadius: '8px 8px 0 0',
              fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span>{label.text}</span>
              <span style={{ background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>
                {columnItems.length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ 
              background: '#f5f6f8', borderRadius: '0 0 8px 8px', padding: '8px', minHeight: '400px',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              {columnItems.map((item: Item) => (
                <div 
                  key={item.id} 
                  onClick={() => openItemDetail(item.id)}
                  style={{ 
                    background: '#fff', borderRadius: '8px', padding: '16px', cursor: 'pointer',
                    border: '1px solid #e1e4e8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.2s, transform 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#323338' }}>{item.name}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {item.values?.priority ? (
                      <span style={{ 
                        fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600,
                        background: board.columns.find((c: Column) => c.id === 'priority')?.settings?.labels?.find((l: any) => l.id === item.values.priority)?.color || '#c4c4c4',
                        color: '#fff'
                      }}>
                        {String(board.columns.find((c: Column) => c.id === 'priority')?.settings?.labels?.find((l: any) => l.id === item.values.priority)?.text || '')}
                      </span>
                    ) : null}
                    {item.values?.date ? (
                      <span style={{ fontSize: '11px', color: '#676879' }}>📅 {formatDate(Number(item.values.date))}</span>
                    ) : null}
                  </div>
                  {item.values?.person ? (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#6161FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                        {getInitials(String(item.values.person))}
                      </div>
                      <span style={{ fontSize: '12px', color: '#676879' }}>{String(item.values.person)}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Cell Renderer ─────────────────────────────────────── */

function ExactCellRenderer({ column, value, onSave }: { column: Column, value: any, onSave: (v: any) => void }) {
  const [showPicker, setShowPicker] = useState(false);
  const [editText, setEditText] = useState(value || '');

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
            style={{ backgroundColor: color, cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 600 }}
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
        <div 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', cursor: 'pointer' }}
          onClick={() => {
            const name = prompt('Assign person (enter name):');
            if (name) onSave(name);
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: value ? '#6161FF' : '#f5f6f8', border: value ? 'none' : '1px dashed #d0d4e4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
            {value ? getInitials(value) : <Plus size={12} color="#c4c4c4" />}
          </div>
        </div>
      );
    case 'date':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '13px' }}>
          <input 
            type="date" 
            style={{ border: 'none', background: 'transparent', fontSize: '13px', cursor: 'pointer', outline: 'none', textAlign: 'center' }}
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => onSave(e.target.value ? new Date(e.target.value).getTime() : null)}
          />
        </div>
      );
    case 'number':
      return (
        <div style={{ padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            type="number"
            style={{ border: 'none', background: 'transparent', fontSize: '14px', width: '100%', outline: 'none', textAlign: 'center' }}
            defaultValue={value || ''}
            onBlur={(e) => onSave(e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      );
    case 'text':
    default:
      return (
        <div style={{ padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            style={{ border: 'none', background: 'transparent', fontSize: '14px', width: '100%', outline: 'none' }}
            defaultValue={value || ''}
            onBlur={(e) => onSave(e.target.value)}
          />
        </div>
      );
  }
}

function CalendarView({ board, items, openItemDetail, onAddEvent }: { board: Board, items: Item[], openItemDetail: (id: string) => void, onAddEvent: (date: Date) => void }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  // Basic 35-cell grid (5 weeks)
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDay = startDate.getDay();
  const gridDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() - startDay + i);
    return d;
  });

  return (
    <div style={{ background: '#fff', border: '1px solid #d0d4e4', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #d0d4e4', background: '#f5f6f8' }}>
        {days.map(d => (
          <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#676879' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(120px, auto)' }}>
        {gridDays.map((date, i) => {
          const isToday = date.toDateString() === today.toDateString();
          const isCurrentMonth = date.getMonth() === today.getMonth();
          
          // Find items for this date
          const dayItems = items.filter(item => {
            if (!item.values?.date) return false;
            const itemDate = new Date(Number(item.values.date));
            return itemDate.toDateString() === date.toDateString();
          });

          return (
            <div key={i} onClick={(e) => {
              if (e.target === e.currentTarget) onAddEvent(date);
            }} style={{ 
              borderRight: i % 7 !== 6 ? '1px solid #e1e4e8' : 'none', 
              borderBottom: i < 28 ? '1px solid #e1e4e8' : 'none',
              padding: '8px',
              background: isCurrentMonth ? '#fff' : '#fafafa',
              opacity: isCurrentMonth ? 1 : 0.5,
              cursor: 'pointer'
            }}>
              <div style={{ 
                fontSize: '12px', fontWeight: isToday ? 700 : 500, 
                color: isToday ? '#fff' : '#323338', 
                background: isToday ? '#6161FF' : 'transparent',
                width: '24px', height: '24px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '8px'
              }}>
                {date.getDate()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dayItems.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => openItemDetail(item.id)}
                    style={{ 
                      fontSize: '11px', padding: '4px 8px', background: '#e4f2ff', 
                      color: '#0073ea', borderRadius: '4px', cursor: 'pointer',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineView({ board, items, openItemDetail }: { board: Board, items: Item[], openItemDetail: (id: string) => void }) {
  // Simple Gantt/Timeline grouped by status
  const statusCol = board.columns.find(c => c.id === 'status');
  const labels = statusCol?.settings?.labels || [];
  
  return (
    <div style={{ background: '#fff', border: '1px solid #d0d4e4', borderRadius: '8px', padding: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Project Timeline</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {labels.map((label: any) => {
          const groupItems = items.filter(i => i.values?.status === label.id);
          if (groupItems.length === 0) return null;
          
          return (
            <div key={label.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: label.color }}></div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#323338' }}>{label.text}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', borderLeft: `2px solid ${label.color}40` }}>
                {groupItems.map(item => (
                  <div key={item.id} onClick={() => openItemDetail(item.id)} style={{
                    background: '#f5f6f8', padding: '12px', borderRadius: '6px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderLeft: `4px solid ${label.color}`
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.name}</div>
                    {item.values?.date ? (
                      <div style={{ fontSize: '12px', color: '#676879' }}>{formatDate(Number(item.values.date))}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartView({ board, items }: { board: Board, items: Item[] }) {
  // Simple Bar Chart for Status Distribution
  const statusCol = board.columns.find(c => c.id === 'status');
  const labels = statusCol?.settings?.labels || [];
  
  const counts = labels.map((label: any) => ({
    ...label,
    count: items.filter(i => i.values?.status === label.id).length
  }));
  
  const maxCount = Math.max(...counts.map((c: any) => c.count), 1); // Avoid div by zero

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ background: '#fff', border: '1px solid #d0d4e4', borderRadius: '8px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Status Distribution</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', paddingBottom: '20px', borderBottom: '1px solid #e1e4e8' }}>
          {counts.map((c: any) => {
            const heightPct = (c.count / maxCount) * 100;
            return (
              <div key={c.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#676879' }}>{c.count}</div>
                <div style={{ 
                  width: '100%', maxWidth: '60px', height: `${heightPct}%`, 
                  background: c.color, borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }}></div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'space-around' }}>
          {counts.map((c: any) => (
            <div key={c.id} style={{ fontSize: '12px', color: '#323338', textAlign: 'center' }}>{String(c.text)}</div>
          ))}
        </div>
      </div>
      
      <div style={{ background: '#fff', border: '1px solid #d0d4e4', borderRadius: '8px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Board Overview</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f5f6f8', borderRadius: '8px' }}>
            <span style={{ color: '#676879', fontWeight: 500 }}>Total Items</span>
            <span style={{ fontWeight: 700, fontSize: '18px' }}>{items.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f5f6f8', borderRadius: '8px' }}>
            <span style={{ color: '#676879', fontWeight: 500 }}>Total Groups</span>
            <span style={{ fontWeight: 700, fontSize: '18px' }}>{board.groups.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#e4f2ff', borderRadius: '8px' }}>
            <span style={{ color: '#0073ea', fontWeight: 500 }}>Completion Rate</span>
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#0073ea' }}>
              {items.length > 0 ? Math.round((items.filter(i => i.values?.status === 'done').length / items.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
