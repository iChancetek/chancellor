'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useWorkspaceStore, useBoardStore } from '@/lib/store';
import { createDefaultWorkspace, createDefaultBoard } from '@/lib/utils';
import {
  Home, LayoutGrid, Users, Code2, Headphones,
  Megaphone, Plus, Zap, Settings, Inbox, Calendar, ChevronDown, Building2, Bot, Link as LinkIcon
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { workspaces, activeWorkspace, setWorkspaces, setActiveWorkspace, addWorkspace } = useWorkspaceStore();
  const { boards, addBoard } = useBoardStore();

  // Initialize workspace on first login (local-first)
  useEffect(() => {
    if (!user) return;
    if (workspaces.length === 0 && !activeWorkspace) {
      const ws = createDefaultWorkspace(user.uid, user.email || '', user.displayName || 'User');
      addWorkspace(ws);
      setActiveWorkspace(ws);
      // Create a default board too
      const board = createDefaultBoard(ws.id, 'Main Board', 'work');
      addBoard(board);
    } else if (!activeWorkspace && workspaces.length > 0) {
      setActiveWorkspace(workspaces[0]);
    }
  }, [user, workspaces, activeWorkspace, setActiveWorkspace, addWorkspace, addBoard]);

  // Background Firestore sync attempt (non-blocking)
  useEffect(() => {
    if (!activeWorkspace) return;
    // Try to sync to Firestore in the background — don't block UI
    import('@/lib/firestore').then(({ createWorkspace }) => {
      createWorkspace(activeWorkspace).catch(() => {
        // Firestore unavailable — data is safe in localStorage
      });
    }).catch(() => {});
  }, [activeWorkspace?.id]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'agents', label: 'Agent Control Center', icon: Bot, path: '/dashboard/agents', badge: 'LIVE' },
    { id: 'inbox', label: 'Inbox', icon: Inbox, path: '/dashboard/inbox' },
    { id: 'calendar', label: 'My Week', icon: Calendar, path: '/dashboard/calendar' },
    { id: 'apps', label: 'Apps Marketplace', icon: LayoutGrid, path: '/dashboard/apps' },
  ];

  const moduleItems = [
    { id: 'workplace', label: 'Work Management', icon: LayoutGrid, path: '/dashboard/workplace', color: '#579BFC' },
    { id: 'crm', label: 'CRM', icon: Users, path: '/dashboard/crm', color: '#00C875' },
    { id: 'erp', label: 'ERP', icon: Building2, path: '/dashboard/erp', color: '#16A34A' },
    { id: 'dev', label: 'Dev', icon: Code2, path: '/dashboard/dev', color: '#FDAB3D' },
    { id: 'support', label: 'Support', icon: Headphones, path: '/dashboard/support', color: '#E2445C' },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, path: '/dashboard/marketing', color: '#A25DDC' },
  ];

  const handleCreateBoard = () => {
    if (!activeWorkspace) {
      alert('Initializing workspace... please try again in a moment.');
      return;
    }
    const board = createDefaultBoard(activeWorkspace.id, 'New Board', 'work');
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);

    // Background Firestore sync
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(() => {});
    }).catch(() => {});
  };

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
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{ background: '#6161FF', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
                {item.badge}
              </span>
            )}
          </div>
        ))}

        {/* Product Modules */}
        <div style={{ padding: '24px 16px 8px', fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Products
        </div>
        {moduleItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => router.push(item.path)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', 
              fontSize: '14px', color: pathname.startsWith(item.path) ? '#fff' : 'rgba(255,255,255,0.7)',
              background: pathname.startsWith(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <item.icon size={18} style={{ color: item.color }} />
            {item.label}
          </div>
        ))}

        {/* Workspace Switcher */}
        <div style={{ padding: '24px 16px 8px', fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Workspaces
        </div>
        <div style={{ margin: '4px 12px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '24px', height: '24px', background: '#0073ea', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
            {activeWorkspace?.name?.charAt(0) || 'M'}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, flex: 1 }}>{activeWorkspace?.name || 'Main Workspace'}</span>
          <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
        </div>

        {/* Boards Section */}
        <div style={{ padding: '24px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Boards</span>
          <button onClick={handleCreateBoard} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
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
          onClick={handleCreateBoard}
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
          onClick={() => router.push('/dashboard/mcp')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', color: pathname === '/dashboard/mcp' ? '#fff' : 'rgba(255,255,255,0.6)', cursor: 'pointer', background: pathname === '/dashboard/mcp' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '6px' }}
        >
          <LinkIcon size={18} />
          <span style={{ fontSize: '13px' }}>MCP Tool Orchestration</span>
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
