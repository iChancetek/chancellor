'use client';

import { useState } from 'react';
import { 
  X, Sparkles, Mic, Loader2, BrainCircuit, ArrowRight,
  TrendingUp, AlertTriangle, Lightbulb, BarChart3, LayoutDashboard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore, useUIStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import type { AIBoardPayload } from '@/lib/types';

interface AICreateBoardModalProps {
  onClose: () => void;
}

export default function AICreateBoardModal({ onClose }: AICreateBoardModalProps) {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { addBoard } = useBoardStore();
  
  const [step, setStep] = useState<'input' | 'processing' | 'preview'>('input');
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [payload, setPayload] = useState<AIBoardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVoiceInput = () => {
    // Simulated voice input for now
    setIsRecording(true);
    setTimeout(() => {
      setPrompt('I need a Cash Flow Risk Monitoring board that tracks AP, AR, and forecasts short-term liquidity risks.');
      setIsRecording(false);
    }, 2000);
  };

  const generateBoard = async () => {
    if (!prompt.trim()) return;
    setStep('processing');
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate intelligence');
      }

      setPayload(data.payload);
      setStep('preview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
      setStep('input');
    }
  };

  const handleInstantiate = async () => {
    if (!activeWorkspace || !payload) return;

    // Create the base board structure
    const board = createDefaultBoard(activeWorkspace.id, payload.board_name, 'finance');
    
    // Attach the AI payload
    board.aiPayload = payload;
    // Set default view to 'dashboard' (we will implement this view in the BoardPage)
    board.activeView = 'dashboard';
    
    // Add view if not exists
    if (!board.views.includes('dashboard')) {
      board.views.push('dashboard');
    }

    // Optimistic UI update
    addBoard(board);
    onClose();
    router.push(`/dashboard/board/${board.id}`);
    
    // Background Cloud Sync
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(err => console.error('Failed to sync AI board creation:', err));
    }).catch(() => {});
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: step === 'preview' ? '900px' : '600px', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '650px', transition: 'max-width 0.3s ease' }}>
        
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, #f8f9ff, #fff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6161FF, #4B4BE5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <BrainCircuit size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#323338' }}>Chancellor Intelligence Engine</h2>
              <p style={{ fontSize: '13px', color: '#676879', marginTop: '2px' }}>Describe your intent. We build the execution layer.</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#676879' }}><X size={24} /></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column' }}>
          
          {step === 'input' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>What business outcome are you driving?</h3>
              
              <div style={{ position: 'relative', flex: 1, marginBottom: '24px' }}>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'I need to monitor Cash Flow risks over the next 30 days, prioritizing overdue AR and upcoming AP.'"
                  style={{ 
                    width: '100%', height: '100%', padding: '20px', borderRadius: '16px', border: '2px solid #e1e4e8', 
                    fontSize: '16px', resize: 'none', outline: 'none', transition: 'border-color 0.2s',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6161FF'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e4e8'}
                />
                
                <button 
                  onClick={handleVoiceInput}
                  style={{ 
                    position: 'absolute', bottom: '20px', right: '20px', 
                    width: '48px', height: '48px', borderRadius: '50%', 
                    background: isRecording ? '#ff5ac4' : '#f5f6f8', 
                    color: isRecording ? '#fff' : '#676879', 
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {isRecording ? <div className="pulse-ring"><Mic size={20} /></div> : <Mic size={20} />}
                </button>
              </div>

              {error && (
                <div style={{ padding: '12px 16px', background: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setPrompt('Revenue Forecasting')}
                  style={{ padding: '8px 16px', borderRadius: '999px', background: '#f5f6f8', color: '#676879', fontSize: '13px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Revenue Forecasting
                </button>
                <button 
                  onClick={() => setPrompt('Accounts Receivable Optimization')}
                  style={{ padding: '8px 16px', borderRadius: '999px', background: '#f5f6f8', color: '#676879', fontSize: '13px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  AR Optimization
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={48} color="#6161FF" className="animate-spin" style={{ marginBottom: '24px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#323338', marginBottom: '8px' }}>Synthesizing Intelligence...</h3>
              <p style={{ fontSize: '15px', color: '#676879', textAlign: 'center', maxWidth: '400px' }}>
                Mapping intent to financial primitives, generating predictive models, and structuring executive insights.
              </p>
            </div>
          )}

          {step === 'preview' && payload && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#6161FF', textTransform: 'uppercase', letterSpacing: '1px' }}>Intelligence Payload Preview</span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#323338' }}>{payload.board_name}</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1 }}>
                
                {/* Left Column: Dashboards & Widgets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: '#f8f9ff', padding: '20px', borderRadius: '16px', border: '1px solid rgba(97,97,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <LayoutDashboard size={18} color="#6161FF" />
                      <h4 style={{ fontWeight: 700, color: '#323338' }}>Generated Dashboards</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {payload.dashboards.map((d, i) => (
                        <div key={i} style={{ background: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e1e4e8' }}>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#323338' }}>{d.title}</div>
                          <div style={{ fontSize: '12px', color: '#676879', marginTop: '4px' }}>{d.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e1e4e8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <BarChart3 size={18} color="#00C875" />
                      <h4 style={{ fontWeight: 700, color: '#323338' }}>Widget Configuration</h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {payload.widgets.map((w, i) => (
                        <div key={i} style={{ background: '#f5f6f8', padding: '12px', borderRadius: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', background: '#e1e4e8', borderRadius: '4px', textTransform: 'uppercase' }}>{w.type}</span>
                          <div style={{ fontWeight: 600, fontSize: '13px', marginTop: '8px' }}>{w.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Insights & Risks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: '#fffcf5', padding: '20px', borderRadius: '16px', border: '1px solid #fde7cc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <AlertTriangle size={18} color="#FDAB3D" />
                      <h4 style={{ fontWeight: 700, color: '#323338' }}>Identified Risks</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {payload.risks.map((r, i) => (
                        <div key={i}>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: '#323338' }}>{r.title}</div>
                          <div style={{ fontSize: '12px', color: '#676879', marginTop: '2px' }}>{r.mitigation}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f0fff4', padding: '20px', borderRadius: '16px', border: '1px solid #c6f6d5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Lightbulb size={18} color="#00C875" />
                      <h4 style={{ fontWeight: 700, color: '#323338' }}>Recommendations</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {payload.recommendations.map((r, i) => (
                        <div key={i}>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: '#323338' }}>{r.action}</div>
                          <div style={{ fontSize: '12px', color: '#676879', marginTop: '2px' }}>{r.expected_outcome}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '24px 32px', background: '#f5f6f8', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step === 'input' ? (
            <>
              <span style={{ fontSize: '13px', color: '#676879' }}>Powered by ChancellorOS LLM</span>
              <button 
                onClick={generateBoard}
                disabled={!prompt.trim()}
                style={{ 
                  padding: '12px 32px', borderRadius: '12px', background: '#6161FF', color: '#fff', 
                  fontSize: '14px', fontWeight: 700, border: 'none', cursor: prompt.trim() ? 'pointer' : 'not-allowed',
                  opacity: prompt.trim() ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                Generate Intelligence <Sparkles size={16} />
              </button>
            </>
          ) : step === 'preview' ? (
            <>
              <button 
                onClick={() => setStep('input')}
                style={{ padding: '12px 24px', borderRadius: '12px', background: '#fff', border: '1px solid #e1e4e8', color: '#323338', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Refine Prompt
              </button>
              <button 
                onClick={handleInstantiate}
                style={{ 
                  padding: '12px 32px', borderRadius: '12px', background: '#00C875', color: '#fff', 
                  fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                Instantiate Environment <ArrowRight size={16} />
              </button>
            </>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
