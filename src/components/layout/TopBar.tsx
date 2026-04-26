'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useUIStore, useBoardStore, useWorkspaceStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Search, Bell, Sparkles, HelpCircle, UserPlus, Grid, Filter, SortAsc, MoreHorizontal, CloudCheck, Cloud, Loader2, Send, Menu } from 'lucide-react';
import { getInitials, createDefaultBoard } from '@/lib/utils';

export default function TopBar() {
  const { user, signOut } = useAuth();
  const { toggleAIChat, addAIMessage, toggleSidebar } = useUIStore();
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
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar} 
          style={{ display: 'none', background: 'none', border: 'none', color: '#323338', padding: '4px', cursor: 'pointer', marginRight: '-12px' }}
        >
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>{activeBoard?.icon || '📋'}</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#323338' }}>{activeBoard?.name || 'Home'}</h2>
              <div title="All changes saved" style={{ color: '#00c875', display: 'flex', alignItems: 'center' }}>
                <CloudCheck size={16} />
              </div>
            </div>
            {activeBoard && <div style={{ fontSize: '11px', color: '#676879' }}>ChancellorOS ✦ Enterprise Active</div>}
          </div>
        </div>
        
        {/* Chancellor AI Command Center */}
        <CommandCenter />
      </div>

      {/* Right side: Utilities & AI */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={toggleAIChat} 
          className="hide-on-mobile"
          style={{ 
            color: '#6161FF', background: '#6161FF1A', padding: '6px 12px', 
            borderRadius: '6px', fontSize: '13px', fontWeight: 700, 
            display: 'flex', alignItems: 'center', gap: '8px' 
          }}
        >
          <Sparkles size={16} />
          Copilot
        </button>

        <button className="hide-on-mobile" style={{ color: '#676879' }}><Bell size={20} /></button>
        <button className="hide-on-mobile" style={{ color: '#676879' }}><HelpCircle size={20} /></button>
        <button className="hide-on-mobile" style={{ color: '#676879' }}><Grid size={20} /></button>
        
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
              <div style={{ padding: '4px' }}>
                <button 
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('chancellor_reset_onboarding'));
                    setUserMenuOpen(false);
                  }} 
                  style={{ width: '100%', textAlign: 'left', padding: '12px', color: '#6161FF', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RefreshCw size={14} /> Restart Platform Tour
                </button>
                <button 
                  onClick={() => signOut()} 
                  style={{ width: '100%', textAlign: 'left', padding: '12px', color: '#df2f4a', fontSize: '14px', fontWeight: 600, borderTop: '1px solid #eee' }}
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function CommandCenter() {
  const [command, setCommand] = useState('');
  const [status, setStatus] = useState<'idle' | 'thinking' | 'executing'>('idle');
  const [reasoning, setReasoning] = useState('');
  const { activeWorkspace } = useWorkspaceStore();
  const { addBoard } = useBoardStore();
  const { toggleAIChat, addAIMessage } = useUIStore();
  const router = useRouter();

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || status !== 'idle') return;

    setStatus('thinking');
    setReasoning('Analyzing command...');

    try {
      const res = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command,
          context: {
            workspaceId: activeWorkspace?.id,
            timestamp: Date.now()
          }
        })
      });

      const data = await res.json();
      setReasoning(data.reasoning || '');
      setStatus('executing');

      // Process Actions
      if (data.actions) {
        for (const action of data.actions) {
          switch (action.type) {
            case 'CREATE_BOARD':
              if (activeWorkspace) {
                const board = createDefaultBoard(activeWorkspace.id, action.params.name, action.params.boardType);
                addBoard(board);
                router.push(`/dashboard/board/${board.id}`);
              }
              break;
            case 'NAVIGATE':
              router.push(action.params.path);
              break;
            case 'AI_RESPONSE':
              addAIMessage({
                id: Math.random().toString(),
                role: 'assistant',
                content: action.params.message,
                timestamp: Date.now()
              });
              toggleAIChat();
              break;
          }
        }
      }

      setCommand('');
      setTimeout(() => {
        setStatus('idle');
        setReasoning('');
      }, 3000);

    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <form 
        onSubmit={handleCommand}
        style={{ 
          padding: '2px', 
          borderRadius: '24px',
          background: status === 'thinking' ? 'linear-gradient(90deg, #6161FF, #A25DDC, #6161FF)' : '#d0d4e4',
          backgroundSize: '200% 200%',
          animation: status === 'thinking' ? 'gradient 2s linear infinite' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ 
          padding: '6px 16px', 
          background: '#fff', 
          borderRadius: '22px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          width: '400px',
          boxShadow: status !== 'idle' ? '0 0 15px rgba(97,97,255,0.2)' : 'none'
        }}>
          <Sparkles size={16} color={status !== 'idle' ? '#6161FF' : '#676879'} />
          <input 
            type="text" 
            placeholder={status === 'thinking' ? 'Reasoning...' : status === 'executing' ? 'Executing Actions...' : "Ask ChancellorOS to do anything..."} 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={status !== 'idle'}
            style={{ border: 'none', background: 'transparent', fontSize: '13px', flex: 1, fontWeight: 500 }} 
          />
          {status === 'thinking' ? (
            <Loader2 size={16} className="animate-spin" color="#6161FF" />
          ) : (
            <button type="submit" style={{ color: '#6161FF', display: 'flex' }} disabled={!command.trim()}>
              <Send size={16} />
            </button>
          )}
        </div>
      </form>
      
      {reasoning && (
        <div style={{ 
          position: 'absolute', top: '50px', left: '16px', 
          background: 'rgba(255,255,255,0.95)', padding: '8px 12px', 
          borderRadius: '8px', border: '1px solid #6161FF',
          fontSize: '11px', color: '#6161FF', fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 100, backdropFilter: 'blur(4px)'
        }}>
          Neural Reasoning: {reasoning}
        </div>
      )}

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

