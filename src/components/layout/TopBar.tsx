'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useUIStore, useBoardStore } from '@/lib/store';
import { Search, Bell, Sparkles, HelpCircle, UserPlus, Grid, Filter, SortAsc, MoreHorizontal } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function TopBar() {
  const { user, signOut } = useAuth();
  const { toggleAIChat } = useUIStore();
  const { activeBoard } = useBoardStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="exact-monday-topbar">
      {/* Left side: Board Title & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>{activeBoard?.icon || '📋'}</span>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#323338' }}>{activeBoard?.name || 'Home'}</h2>
        </div>
        
        <div style={{ padding: '4px 12px', border: '1px solid #d0d4e4', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: '#676879' }}>
          <Search size={14} />
          <input 
            type="text" 
            placeholder="Search / Filter" 
            style={{ border: 'none', background: 'transparent', fontSize: '13px', width: '120px' }} 
          />
          <span style={{ fontSize: '10px', background: '#f5f6f8', padding: '2px 4px', borderRadius: '3px' }}>F</span>
        </div>
      </div>

      {/* Right side: Utilities & AI */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Chancellor AI Toggle */}
        <button 
          onClick={toggleAIChat} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            color: '#6161FF', fontWeight: 700, fontSize: '14px',
            background: '#e5e5ff', padding: '6px 12px', borderRadius: '6px'
          }}
        >
          <Sparkles size={16} />
          Chancellor AI
        </button>

        <div style={{ width: '1px', height: '24px', background: '#e1e4e8' }} />

        <button style={{ color: '#676879' }}><UserPlus size={20} /></button>
        <button style={{ color: '#676879' }}><HelpCircle size={20} /></button>
        <button style={{ color: '#676879' }}><Grid size={20} /></button>
        
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: '#00c875', color: '#fff', fontSize: '12px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              getInitials(user?.displayName || 'U')
            )}
          </button>

          {userMenuOpen && (
            <div style={{ 
              position: 'absolute', top: '44px', right: 0, width: '220px', 
              background: '#fff', border: '1px solid #d0d4e4', borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 1000, padding: '8px'
            }}>
              <div style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{user?.displayName}</div>
                <div style={{ fontSize: '12px', color: '#676879' }}>{user?.email}</div>
              </div>
              <button 
                onClick={() => signOut()} 
                style={{ width: '100%', textAlign: 'left', padding: '12px', color: '#df2f4a', fontSize: '14px', fontWeight: 600 }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
