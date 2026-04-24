'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { subscribeToWorkspaces, createWorkspace, subscribeToBoards, createBoard } from '@/lib/firestore';
import { createDefaultWorkspace, createDefaultBoard } from '@/lib/utils';
import {
  Home, LayoutGrid, Users, Code2, Headphones,
  Megaphone, Plus, Zap, Settings, Inbox, Calendar, Search, Grid
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { workspaces, activeWorkspace, setWorkspaces, setActiveWorkspace } = useWorkspaceStore();
  const { boards, setBoards } = useBoardStore();

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToWorkspaces(user.uid, (ws) => {
      setWorkspaces(ws);
      if (ws.length > 0 && !activeWorkspace) setActiveWorkspace(ws[0]);
    });
    return () => unsub();
  }, [user, setWorkspaces, setActiveWorkspace]);

  useEffect(() => {
    if (!user || workspaces === undefined) return;
    if (workspaces.length === 0) {
      const ws = createDefaultWorkspace(user.uid, user.email || '', user.displayName || 'User');
      createWorkspace(ws).then(() => {
        const board = createDefaultBoard(ws.id, 'Main Board', 'work');
        createBoard(board);
      });
    }
  }, [user, workspaces]);

  useEffect(() => {
    if (!activeWorkspace) return;
    const unsub = subscribeToBoards(activeWorkspace.id, (b) => setBoards(b));
    return () => unsub();
  }, [activeWorkspace, setBoards]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'inbox', label: 'Inbox', icon: Inbox, path: '/dashboard/inbox' },
    { id: 'calendar', label: 'My Week', icon: Calendar, path: '/dashboard/calendar' },
  ];

  return (
    <aside className="exact-monday-sidebar">
      {/* Top Logo & App Grid */}
      <div style={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
        <img src="/icon.svg" alt="Chancellor Logo" style={{ width: '28px', height: '28px', borderRadius: '4px' }} />
        <span style={{ fontWeight: 600, fontSize: '18px' }}>Chancellor</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '16px' }}>
        {/* Main Nav */}
        {navItems.map((item) => (
          <div 
            key={item.id} 
            className={`sidebar-nav-item ${pathname === item.path ? 'active' : ''}`}
            onClick={() => router.push(item.path)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', 
              fontSize: '14px', color: pathname === item.path ? '#fff' : 'rgba(255,255,255,0.7)',
              background: pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <item.icon size={18} style={{ color: item.id === 'home' ? '#6161FF' : 'inherit' }} />
            {item.label}
          </div>
        ))}

        {/* Workspace Switcher */}
        <div style={{ padding: '24px 16px 8px', fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Workspaces
        </div>
        <div style={{ margin: '4px 12px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '24px', height: '24px', background: '#0073ea', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>M</div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{activeWorkspace?.name || 'Main Workspace'}</span>
        </div>

        {/* Boards Section */}
        <div style={{ padding: '24px 16px 8px', fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Boards
        </div>
        {boards.map((board) => (
          <div 
            key={board.id} 
            className={`sidebar-nav-item ${pathname.includes(board.id) ? 'active' : ''}`}
            onClick={() => router.push(`/dashboard/board/${board.id}`)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', 
              fontSize: '14px', color: pathname.includes(board.id) ? '#fff' : 'rgba(255,255,255,0.7)',
              background: pathname.includes(board.id) ? 'rgba(255,255,255,0.1)' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '16px', filter: pathname.includes(board.id) ? 'none' : 'grayscale(1)' }}>{board.icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.name}</span>
          </div>
        ))}

        <div 
          onClick={() => createBoard(createDefaultBoard(activeWorkspace?.id || '', 'New Board', 'work'))}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', fontSize: '14px', color: '#6161FF', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} />
          Add Board
        </div>
      </div>

      {/* Bottom Utility Icons */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div 
          onClick={() => router.push('/dashboard/admin')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
        >
          <Settings size={18} />
          <span style={{ fontSize: '13px' }}>Administration</span>
        </div>
        <div 
          onClick={() => router.push('/dashboard/automations')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
        >
          <Zap size={18} />
          <span style={{ fontSize: '13px' }}>Automations</span>
        </div>
      </div>
    </aside>
  );
}
