'use client';

import { useState } from 'react';
import { 
  Bot, Activity, Shield, Cpu, Play, Pause, ChevronRight, 
  CheckCircle2, AlertCircle, Clock, Zap, MessageSquare, ExternalLink
} from 'lucide-react';
import { useAgentStore } from '@/lib/store';
import { formatRelativeTime, generateId } from '@/lib/utils';

export default function AgentControlCenter() {
  const { agents, activeAgentId, setActiveAgent, addAgentAction, updateAgent } = useAgentStore();
  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  const simulateAgentLoop = async () => {
    const agentId = activeAgent?.id || 'sales-agent-1';
    updateAgent(agentId, { status: 'thinking', currentGoal: 'Executing Autonomous Goal' });
    
    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: activeAgent?.description || 'Analyze the workspace and identify improvements.',
          agentId: agentId
        })
      });
      
      const data = await response.json();
      
      if (data.steps) {
        data.steps.forEach((step: any, index: number) => {
          setTimeout(() => {
            addAgentAction(agentId, {
              id: generateId(),
              agentId,
              type: step.type === 'tool-call' ? 'tool_call' : 'thought',
              status: 'completed',
              timestamp: Date.now(),
              content: step.content || (step.toolCalls ? `Calling tool: ${step.toolCalls[0].name}` : 'Reasoning...'),
              toolName: step.toolCalls?.[0]?.name,
              toolArgs: step.toolCalls?.[0]?.args
            });
          }, index * 1000);
        });
      }
      
      updateAgent(agentId, { status: 'idle' });
    } catch (error) {
      console.error('Failed to run agent:', error);
      updateAgent(agentId, { status: 'idle' });
    }
  };

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>🤖 Agent Control Center</h1>
        <p>Monitor, govern, and orchestrate your autonomous digital workforce in real-time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', height: 'calc(100vh - 220px)' }}>
        {/* Left: Agent Roster */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #eee', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#6161FF" />
            Active Roster
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {agents.map(agent => (
              <div 
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                style={{ 
                  padding: '16px', borderBottom: '1px solid #f5f6f8', cursor: 'pointer',
                  background: activeAgent?.id === agent.id ? '#f0f3ff' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(97, 97, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    {agent.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#323338' }}>{agent.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: agent.status === 'idle' ? '#9699a6' : '#00c875' }} />
                      <span style={{ fontSize: '11px', color: '#676879', textTransform: 'capitalize' }}>{agent.status}</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#676879', lineHeight: '1.4' }}>{agent.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Agent Runtime & Reasoning */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status Banner */}
          <div style={{ 
            background: 'linear-gradient(90deg, #292d3e, #1a1c2c)', 
            borderRadius: '16px', padding: '24px', color: '#fff',
            display: 'flex', alignItems: 'center', gap: '24px', border: '1px solid rgba(97, 97, 255, 0.3)'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(97, 97, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
              {activeAgent?.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{activeAgent?.name}</h2>
              <p style={{ fontSize: '13px', color: '#9699a6' }}>{activeAgent?.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>
                Configure Model
              </button>
              <button 
                onClick={simulateAgentLoop}
                style={{ padding: '10px 20px', background: '#6161FF', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Play size={16} /> Deploy Agent
              </button>
            </div>
          </div>

          {/* Execution Feed */}
          <div style={{ flex: 1, background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="#6161FF" />
                Live Execution Loop
              </div>
              <div style={{ fontSize: '11px', color: '#676879', display: 'flex', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={12} color="#00c875" /> SOC2 Compliant</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={12} color="#fdab3d" /> Human-in-the-Loop Active</span>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activeAgent?.actions.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: '#9699a6' }}>
                  <Bot size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                  <p>Agent is currently idle. No active execution loops.</p>
                </div>
              ) : (
                activeAgent?.actions.map(action => (
                  <div key={action.id} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ 
                        width: '28px', height: '28px', borderRadius: '50%', 
                        background: action.status === 'completed' ? '#00c8751a' : action.status === 'failed' ? '#e2445c1a' : '#6161FF1a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {action.type === 'thought' && <MessageSquare size={14} color="#6161FF" />}
                        {action.type === 'tool_call' && <Zap size={14} color="#fdab3d" />}
                        {action.type === 'action' && <Play size={14} color="#00c875" />}
                        {action.type === 'approval_request' && <Shield size={14} color="#e2445c" />}
                      </div>
                      <div style={{ flex: 1, width: '2px', background: '#f5f6f8', marginTop: '4px' }} />
                    </div>
                    <div style={{ flex: 1, paddingBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#323338' }}>{action.type.replace('_', ' ')}</span>
                        <span style={{ fontSize: '11px', color: '#9699a6' }}>{formatRelativeTime(action.timestamp)}</span>
                      </div>
                      <div style={{ 
                        background: action.type === 'thought' ? '#f8f9ff' : '#fff',
                        border: '1px solid #e1e4e8', borderRadius: '12px', padding: '16px',
                        fontSize: '14px', color: '#323338', lineHeight: '1.5'
                      }}>
                        {action.content}
                        {action.toolName && (
                          <div style={{ marginTop: '12px', padding: '12px', background: '#f5f6f8', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
                            <span style={{ color: '#6161FF', fontWeight: 700 }}>Tool Call:</span> {action.toolName}({JSON.stringify(action.toolArgs)})
                          </div>
                        )}
                        {action.status === 'waiting_approval' && (
                          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                            <button style={{ padding: '6px 16px', background: '#00c875', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none' }}>Approve Action</button>
                            <button style={{ padding: '6px 16px', background: '#e2445c', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none' }}>Deny</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
