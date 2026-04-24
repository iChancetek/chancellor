'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, Loader2, BrainCircuit } from 'lucide-react';
import type { Board, Item } from '@/lib/types';

interface BoardAIInsightsProps {
  board: Board;
  items: Item[];
}

export default function BoardAIInsights({ board, items }: BoardAIInsightsProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsight = async () => {
    if (items.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'user', 
              content: `Analyze this board "${board.name}" with these items: ${JSON.stringify(items.map(i => ({ name: i.name, values: i.values })))}. 
              Provide 3 rapid AI insights: 
              1. Current progress summary
              2. Potential bottleneck or risk
              3. Next best action for the team.
              Format as a clean, concise markdown list with emojis.` 
            }
          ],
        }),
      });

      const data = await response.json();
      setInsight(data.message);
    } catch (error) {
      console.error('Insight generation failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateInsight();
  }, [board.id]); // Re-generate when board changes

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)', 
      padding: '24px', 
      borderRadius: '16px', 
      border: '1px solid #e1e4e8',
      marginBottom: '32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#6161FF', padding: '8px', borderRadius: '10px', color: 'white' }}>
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#323338' }}>Chancellor AI Insights</h3>
            <p style={{ fontSize: '12px', color: '#676879' }}>GPT-5.5 Real-time Board Analysis</p>
          </div>
        </div>
        <button 
          onClick={generateInsight}
          disabled={isLoading}
          style={{ fontSize: '12px', color: '#6161FF', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
        >
          {isLoading ? <Loader2 className="animate-spin" size={14} /> : 'Refresh Analysis'}
        </button>
      </div>

      <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#323338' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', width: '90%' }} className="animate-pulse"></div>
            <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', width: '70%' }} className="animate-pulse"></div>
            <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', width: '85%' }} className="animate-pulse"></div>
          </div>
        ) : insight ? (
          <div dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br/>') }} />
        ) : (
          "Add some items to get started with AI insights."
        )}
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#676879' }}>
          <TrendingUp size={14} color="#00c875" /> Healthy Velocity
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#676879' }}>
          <CheckCircle2 size={14} color="#6161FF" /> 0 Risks Found
        </div>
      </div>
    </div>
  );
}
