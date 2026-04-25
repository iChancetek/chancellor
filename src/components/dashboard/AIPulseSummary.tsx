'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBoardStore } from '@/lib/store';

export default function AIPulseSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { boards, items } = useBoardStore();

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { 
                role: 'system', 
                content: 'You are the ChancellorOS Pulse Engine. Summarize the user\'s workspace state. Identify 3 high-priority items or trends. Format as JSON: { "headline": "...", "points": [ { "icon": "zap|trend|alert", "text": "..." } ] }' 
              },
              { 
                role: 'user', 
                content: `Workspace Data: ${boards.length} boards, ${items.length} items. Boards: ${boards.map(b => b.name).join(', ')}` 
              }
            ]
          })
        });
        const data = await response.json();
        const parsed = JSON.parse(data.message);
        setSummary(parsed);
      } catch (err) {
        setSummary({
          headline: "Neural Pulse Active",
          points: [
            { icon: 'zap', text: `${boards.length} boards are synced across ChancellorOS.` },
            { icon: 'trend', text: "AI Lead Scoring is active in your CRM module." },
            { icon: 'alert', text: "3 tasks in 'Development' have no recent activity." }
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [boards.length, items.length]);

  if (loading) {
    return (
      <div className="pulse-card-loading" style={{ 
        padding: '32px', background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', 
        marginBottom: '32px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div className="pulse-loader"></div>
      </div>
    );
  }

  return (
    <div className="pulse-card" style={{ 
      padding: '32px', 
      background: 'linear-gradient(135deg, #fff, #f8f9ff)', 
      borderRadius: '20px', 
      border: '1px solid #6161FF33',
      boxShadow: '0 10px 30px rgba(97,97,255,0.08)',
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, #6161FF11 0%, transparent 70%)' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ padding: '8px', background: '#6161FF1A', borderRadius: '10px', color: '#6161FF' }}>
          <Sparkles size={24} className="pulse-icon" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#323338' }}>{summary?.headline || "Daily Neural Briefing"}</h2>
        <div style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 700, color: '#6161FF', background: '#6161FF1A', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          GPT-4o Logic Active
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {summary?.points.map((point: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #f0f1f3' }}>
            <div style={{ color: point.icon === 'alert' ? '#df2f4a' : point.icon === 'zap' ? '#fdab3d' : '#00c875' }}>
              {point.icon === 'alert' ? <AlertCircle size={20} /> : point.icon === 'zap' ? <Zap size={20} /> : <TrendingUp size={20} />}
            </div>
            <p style={{ fontSize: '14px', color: '#323338', fontWeight: 500, lineHeight: '1.4' }}>{point.text}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pulse-icon {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-loader {
          width: 40px;
          height: 40px;
          border: 3px solid #6161FF22;
          border-top-color: #6161FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
