'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore, useBoardStore, useAgentStore, useUIStore } from '@/lib/store';
import { createDefaultBoard, generateId } from '@/lib/utils';
import ModuleCopilot from '@/components/ai/ModuleCopilot';
import {
  Users, Plus, TrendingUp, DollarSign, UserCheck, ArrowRight, Target, Mail,
  CheckSquare, Calendar, MessageSquare, Share2, Layers, Search, Headset,
  Settings, BarChart2, Link, User, Sparkles, Bot, Mic, Volume2, StopCircle,
  Play, Zap, Brain, Send, Loader2, FileText, Shield, Activity
} from 'lucide-react';

export default function CRMPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { boards, addBoard, items } = useBoardStore();
  const { toggleAIChat } = useUIStore();
  const { agents, updateAgent, addAgentAction } = useAgentStore();
  const crmBoards = boards.filter(b => b.type === 'crm');
  const crmItems = items.filter(i => crmBoards.some(b => b.id === i.boardId));

  const [activeTab, setActiveTab] = useState<'pipeline' | 'intelligence' | 'voice' | 'agents'>('pipeline');
  const [nlpLoading, setNlpLoading] = useState<string | null>(null);
  const [nlpResult, setNlpResult] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [agentRunning, setAgentRunning] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const totalPipelineValue = crmItems.reduce((sum, item) => sum + (Number(item.values?.dealvalue) || 0), 0);
  const fmt = (n: number) => '$' + n.toLocaleString();

  const handleCreateBoard = (name: string) => {
    if (!activeWorkspace) return;
    const board = createDefaultBoard(activeWorkspace.id, name, 'crm');
    addBoard(board);
    router.push(`/dashboard/board/${board.id}`);
    import('@/lib/firestore').then(({ createBoard }) => {
      createBoard(board).catch(() => {});
    }).catch(() => {});
  };

  const runNLP = async (action: string) => {
    setNlpLoading(action);
    setNlpResult(null);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `CRM NLP Action: ${action}. I have ${crmBoards.length} CRM boards with ${crmItems.length} total deals. Total pipeline value: ${fmt(totalPipelineValue)}. Provide a concise, actionable analysis.` }]
        })
      });
      const data = await res.json();
      setNlpResult(data.message || 'Analysis complete.');
    } catch { setNlpResult('Failed to run analysis.'); }
    finally { setNlpLoading(null); }
  };

  const playTTS = async (text: string) => {
    setTtsPlaying(true);
    try {
      const res = await fetch('/api/ai/tts', { method: 'POST', body: JSON.stringify({ text }) });
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.onended = () => setTtsPlaying(false);
      audio.play();
    } catch { setTtsPlaying(false); }
  };

  const startSTT = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const fd = new FormData(); fd.append('audio', blob, 'rec.webm');
        const res = await fetch('/api/ai/stt', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.text) setVoiceNote(prev => prev ? prev + ' ' + data.text : data.text);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(); setIsRecording(true);
    } catch (e) { console.error('STT failed', e); }
  };

  const stopSTT = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  const deployCRMAgent = async () => {
    setAgentRunning(true);
    try {
      const res = await fetch('/api/ai/agent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Analyze CRM pipeline: ${crmBoards.length} boards, ${crmItems.length} deals, ${fmt(totalPipelineValue)} total value. Identify stalled deals and recommend next actions.`, agentId: 'sales-agent-1' })
      });
      const data = await res.json();
      if (data.output) setNlpResult(data.output);
    } catch { setNlpResult('Agent deployment failed.'); }
    finally { setAgentRunning(false); }
  };

  const tabs = [
    { id: 'pipeline' as const, label: 'Pipeline', icon: <Target size={16} /> },
    { id: 'intelligence' as const, label: 'AI Intelligence', icon: <Brain size={16} /> },
    { id: 'voice' as const, label: 'Voice & NLP', icon: <Mic size={16} /> },
    { id: 'agents' as const, label: 'Autonomous Agents', icon: <Bot size={16} /> },
  ];

  const templates = [
    { icon: <Target size={20} />, name: 'Sales Pipeline', desc: 'AI-scored deal tracking', color: 'rgba(253,171,61,0.15)', iconColor: '#FDAB3D' },
    { icon: <Users size={20} />, name: 'CRM Database', desc: 'Contacts with NLP enrichment', color: 'rgba(0,200,117,0.15)', iconColor: '#00C875' },
    { icon: <Sparkles size={20} />, name: 'AI Lead Scoring', desc: 'GPT-5.4 predictive scoring', color: 'rgba(97,97,255,0.15)', iconColor: '#6161FF' },
    { icon: <User size={20} />, name: 'Account Intelligence', desc: '360° with voice notes', color: 'rgba(87,155,252,0.15)', iconColor: '#579BFC' },
    { icon: <BarChart2 size={20} />, name: 'Revenue Forecasting', desc: 'NLP-driven projections', color: 'rgba(162,93,220,0.15)', iconColor: '#A25DDC' },
    { icon: <Headset size={20} />, name: 'Customer Success', desc: 'Churn prevention agents', color: 'rgba(226,68,92,0.15)', iconColor: '#E2445C' },
    { icon: <Mail size={20} />, name: 'Outreach Sequences', desc: 'AI-generated campaigns', color: 'rgba(255,90,196,0.15)', iconColor: '#ff5ac4' },
    { icon: <Shield size={20} />, name: 'Deal Room', desc: 'Secure deal collaboration', color: 'rgba(0,134,192,0.15)', iconColor: '#0086C0' },
  ];

  const nlpActions = [
    { label: 'Score Pipeline Health', prompt: 'Analyze pipeline health and score each stage' },
    { label: 'Predict Close Probability', prompt: 'Predict close probability for active deals' },
    { label: 'Analyze Deal Sentiment', prompt: 'Run NLP sentiment analysis on deal notes and communications' },
    { label: 'Generate Outreach Copy', prompt: 'Generate personalized outreach email templates for top leads' },
    { label: 'Identify Upsell Opportunities', prompt: 'Identify cross-sell and upsell opportunities in existing accounts' },
    { label: 'Competitive Intelligence Brief', prompt: 'Generate a competitive intelligence briefing based on current deals' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>🧩 CRM — AI Sales Intelligence</h1>
        <p>Manage leads, deals, and relationships with NLP analysis, voice commands, and autonomous agents — powered by GPT-5.4.</p>
      </div>

      <ModuleCopilot module="crm" />

      {/* KPI Strip */}
      <div className="dashboard-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(0,200,117,0.1), rgba(0,200,117,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(0,200,117,0.15)' }}><DollarSign size={22} style={{ color: '#00C875' }} /></div>
          <div className="dashboard-card-title">Pipeline Value</div>
          <div className="dashboard-card-stats"><div className="dashboard-card-stat">
            <span className="dashboard-card-stat-value" style={{ color: '#00C875' }}>{fmt(totalPipelineValue)}</span>
            <span className="dashboard-card-stat-label">Total Revenue</span>
          </div></div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(87,155,252,0.1), rgba(87,155,252,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(87,155,252,0.15)' }}><Users size={22} style={{ color: '#579BFC' }} /></div>
          <div className="dashboard-card-title">Active Deals</div>
          <div className="dashboard-card-stats"><div className="dashboard-card-stat">
            <span className="dashboard-card-stat-value" style={{ color: '#579BFC' }}>{crmItems.length}</span>
            <span className="dashboard-card-stat-label">Across {crmBoards.length} boards</span>
          </div></div>
        </div>
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(97,97,255,0.1), rgba(97,97,255,0.02))' }}>
          <div className="dashboard-card-icon" style={{ background: 'rgba(97,97,255,0.15)' }}><Sparkles size={22} style={{ color: '#6161FF' }} /></div>
          <div className="dashboard-card-title">AI Engine</div>
          <div className="dashboard-card-stats"><div className="dashboard-card-stat">
            <span className="dashboard-card-stat-value" style={{ color: '#6161FF' }}>GPT-5.4</span>
            <span className="dashboard-card-stat-label">NLP · TTS · STT · Agent</span>
          </div></div>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: 'var(--space-6)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            background: activeTab === t.id ? '#fff' : 'transparent',
            color: activeTab === t.id ? '#323338' : 'var(--text-tertiary)',
            boxShadow: activeTab === t.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s'
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div>
          {crmBoards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-tertiary)' }}>
              <Target size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', fontWeight: 600 }}>No CRM boards yet</p>
              <p style={{ marginTop: '8px' }}>Create your first pipeline below to start tracking deals.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {crmBoards.map(board => {
                const boardItems = items.filter(i => i.boardId === board.id);
                const boardValue = boardItems.reduce((s, i) => s + (Number(i.values?.dealvalue) || 0), 0);
                return (
                  <div key={board.id} onClick={() => router.push(`/dashboard/board/${board.id}`)} style={{
                    padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '16px'
                  }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,200,117,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{board.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px' }}>{board.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{boardItems.length} deals · {fmt(boardValue)} value</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); playTTS(`${board.name} has ${boardItems.length} deals with a total pipeline value of ${fmt(boardValue)}`); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', cursor: 'pointer' }} title="Listen to summary">
                      <Volume2 size={16} color="#6161FF" />
                    </button>
                    <ArrowRight size={18} color="var(--text-tertiary)" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* AI INTELLIGENCE TAB */}
      {activeTab === 'intelligence' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {nlpActions.map(a => (
              <button key={a.label} onClick={() => runNLP(a.prompt)} disabled={!!nlpLoading} style={{
                padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', opacity: nlpLoading && nlpLoading !== a.prompt ? 0.5 : 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {nlpLoading === a.prompt ? <Loader2 size={16} className="animate-spin" color="#6161FF" /> : <Sparkles size={16} color="#6161FF" />}
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{a.label}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>GPT-5.4 NLP Analysis</div>
              </button>
            ))}
          </div>
          {nlpResult && (
            <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(97,97,255,0.3)', background: 'linear-gradient(135deg, #292d3e, #1a1c2c)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Brain size={18} color="#6161FF" /><span style={{ fontWeight: 800, fontSize: '14px' }}>AI Analysis Result</span>
                <button onClick={() => playTTS(nlpResult)} style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#6161FF', cursor: 'pointer', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Volume2 size={14} /> Listen
                </button>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#d0d4e4', whiteSpace: 'pre-wrap' }}>{nlpResult}</p>
            </div>
          )}
        </div>
      )}

      {/* VOICE & NLP TAB */}
      {activeTab === 'voice' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic size={18} color="#6161FF" /> Voice Deal Notes (STT)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>Hold the mic button to dictate deal notes. Whisper AI transcribes in real-time.</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button onMouseDown={startSTT} onMouseUp={stopSTT} onMouseLeave={() => isRecording && stopSTT()} style={{
                padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                background: isRecording ? '#E2445C' : '#6161FF', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
              }}>
                {isRecording ? <><StopCircle size={16} /> Recording...</> : <><Mic size={16} /> Hold to Speak</>}
              </button>
              {voiceNote && <button onClick={() => runNLP(`Analyze this CRM deal note and extract action items: "${voiceNote}"`)} style={{
                padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '8px'
              }}><Sparkles size={16} color="#6161FF" /> NLP Analyze</button>}
            </div>
            {voiceNote && (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase' }}>Transcription</div>
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{voiceNote}</p>
              </div>
            )}
          </div>
          <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={18} color="#00C875" /> Pipeline Audio Briefing (TTS)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>Generate an audio summary of your pipeline. Listen hands-free.</p>
            <button onClick={() => playTTS(`CRM Pipeline Briefing. You currently have ${crmBoards.length} active CRM boards with ${crmItems.length} total deals. Your total pipeline value is ${fmt(totalPipelineValue)}. ${crmItems.length === 0 ? 'Create your first pipeline to start tracking revenue.' : 'Your pipeline is active and being monitored by Chancellor AI.'}`)}
              disabled={ttsPlaying} style={{
                padding: '14px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                background: ttsPlaying ? 'var(--bg-secondary)' : '#00C875', color: ttsPlaying ? 'var(--text-secondary)' : '#fff',
                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s'
              }}>
              {ttsPlaying ? <><Loader2 size={18} className="animate-spin" /> Playing...</> : <><Play size={18} /> Play Pipeline Briefing</>}
            </button>
          </div>
        </div>
      )}

      {/* AGENTS TAB */}
      {activeTab === 'agents' && (
        <div>
          <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(97,97,255,0.3)', background: 'linear-gradient(135deg, #292d3e, #1a1c2c)', color: '#fff', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(97,97,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>💼</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Sales Intelligence Agent</h3>
                <p style={{ fontSize: '13px', color: '#9699a6' }}>Autonomous pipeline optimization, deal engagement, and forecasting</p>
              </div>
              <button onClick={deployCRMAgent} disabled={agentRunning} style={{
                padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                background: agentRunning ? 'rgba(255,255,255,0.1)' : '#6161FF', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                {agentRunning ? <><Loader2 size={16} className="animate-spin" /> Running...</> : <><Play size={16} /> Deploy Agent</>}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Pipeline Analysis', 'Lead Re-engagement', 'Deal Risk Scoring', 'Forecast Generation'].map(cap => (
                <span key={cap} style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>{cap}</span>
              ))}
            </div>
          </div>
          {nlpResult && (
            <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Activity size={16} color="#6161FF" /><span style={{ fontWeight: 700, fontSize: '14px' }}>Agent Output</span></div>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{nlpResult}</p>
            </div>
          )}
          <div style={{ marginTop: '24px' }}>
            <button onClick={toggleAIChat} style={{ padding: '14px 28px', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 700, fontSize: '14px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={18} color="#6161FF" /> Open AI Assistant for Custom Commands
            </button>
          </div>
        </div>
      )}

      {/* Board Templates */}
      <div style={{ marginTop: 'var(--space-8)' }}>
        <div className="dashboard-section-title" style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
          <Plus size={18} style={{ color: '#00C875', marginRight: 'var(--space-2)' }} /> Create CRM Board
        </div>
        <div className="dashboard-quick-actions">
          {templates.map(t => (
            <button key={t.name} className="dashboard-quick-action" onClick={() => handleCreateBoard(t.name)}>
              <div className="dashboard-quick-action-icon" style={{ background: t.color, color: t.iconColor }}>{t.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{t.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t.desc}</div>
              </div>
              <ArrowRight size={14} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
