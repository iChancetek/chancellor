'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, Bot, MessageSquare, Loader2 } from 'lucide-react';
import { useUIStore } from '@/lib/store';

interface ModuleCopilotProps {
  module: 'crm' | 'erp' | 'dev' | 'support' | 'marketing' | 'work' | 'finance' | 'hr';
}

export default function ModuleCopilot({ module }: ModuleCopilotProps) {
  const { toggleAIChat } = useUIStore();
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const moduleNames: Record<string, string> = {
    crm: 'Sales Copilot',
    erp: 'ERP Copilot',
    dev: 'Dev Copilot',
    support: 'Support Copilot',
    marketing: 'Marketing Copilot',
    work: 'Work Copilot',
    finance: 'Finance Copilot',
    hr: 'HR Copilot'
  };

  const suggestions: Record<string, string[]> = {
    crm: ['Score pipeline leads', 'Predict quarterly close', 'Draft outreach sequence', 'Analyze deal sentiment', 'Voice deal summary', 'Deploy CRM agent'],
    erp: ['Analyze spend trends', 'Generate ledger summary', 'Forecast cash flow'],
    dev: ['Review sprint velocity', 'Predict bug risks', 'Draft release notes'],
    support: ['Analyze ticket sentiment', 'Optimize SLA response', 'Suggest macro updates'],
    marketing: ['Review campaign ROAS', 'Generate content ideas', 'Analyze audience reach'],
    work: ['Optimize project timeline', 'Identify resource gaps', 'Summarize board status'],
    finance: ['Analyze budget utilization', 'Detect expense anomalies', 'Forecast quarterly spend'],
    hr: ['Review onboarding pipeline', 'Analyze retention risk', 'Audit policy compliance']
  };

  useEffect(() => {
    // Simulate neural reasoning for a proactive insight
    const timer = setTimeout(() => {
      const moduleInsights: Record<string, string> = {
        crm: "GPT-5.4 NLP analysis detected 2 deals at risk due to declining engagement velocity. I can deploy an autonomous agent to draft re-engagement sequences and schedule follow-ups via voice command.",
        erp: "Cash flow analysis detects a $4.2k variance in 'Liabilities'. I recommend a reconciliation review.",
        dev: "Sprint velocity is up 12%. I can generate a performance summary for the retro.",
        support: "Sentiment analysis shows an uptick in 'Login' issues. I've prepared a draft for a knowledge base article.",
        marketing: "Your 'Email Outreach' campaign has a 4.2% click-through rate, exceeding benchmark. I suggest scaling budget by 15%.",
        work: "Resource allocation is currently 92% optimized. I identified 2 tasks that could be parallelized to save 3 days.",
        finance: "Marketing is currently 5.4% over budget. I recommend reallocating $15k from Operations' surplus to cover the overspend before month-end close.",
        hr: "Onboarding for James Wilson is 33% complete. 2 tasks are pending — I can auto-send reminders to the assigned stakeholders."
      };
      setInsight(moduleInsights[module]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [module]);

  return (
    <div className="module-copilot-card" style={{ 
      background: 'linear-gradient(135deg, #292d3e, #1a1c2c)', 
      borderRadius: '16px', 
      padding: '24px', 
      color: '#fff',
      marginBottom: '32px',
      boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
      border: '1px solid rgba(97, 97, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, #6161FF22 0%, transparent 70%)' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '8px', background: 'rgba(97, 97, 255, 0.2)', borderRadius: '10px', color: '#6161FF' }}>
          <Sparkles size={20} className="animate-pulse" />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{moduleNames[module]}</h3>
        <div style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, color: '#6161FF', background: 'rgba(97, 97, 255, 0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(97, 97, 255, 0.2)' }}>
          ACTIVE NEURAL LAYER
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9699a6', fontSize: '14px' }}>
              <Loader2 size={16} className="animate-spin" />
              <span>Analyzing module context...</span>
            </div>
          ) : (
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#d0d4e4', marginBottom: '20px' }}>
              {insight}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {suggestions[module].map(s => (
              <button 
                key={s} 
                onClick={toggleAIChat}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  color: '#fff', 
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                className="hover-bright"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={toggleAIChat}
          style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: 'rgba(97, 97, 255, 0.1)', border: '2px solid rgba(97, 97, 255, 0.3)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '8px', transition: 'all 0.3s'
          }}
          className="copilot-action-button"
        >
          <Bot size={32} color="#6161FF" />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#6161FF' }}>TALK TO AI</span>
        </button>
      </div>

      <style jsx>{`
        .hover-bright:hover {
          background: rgba(255,255,255,0.1) !important;
          border-color: #6161FF !important;
          color: #6161FF !important;
        }
        .copilot-action-button:hover {
          background: rgba(97, 97, 255, 0.2) !important;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(97, 97, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
