'use client';

import { useState } from 'react';
import { 
  Users, Share2, Zap, Shield, Database, 
  ArrowRight, Play, CheckCircle2, MessageSquare, Repeat, Layers
} from 'lucide-react';

export default function AgentSwarmsPage() {
  const swarms = [
    { 
      id: 'q2c', name: 'Quote-to-Cash Swarm', 
      agents: ['Sales Agent', 'Finance Agent', 'CFO Agent'],
      status: 'active',
      desc: 'Collaborative pipeline for automated deal closing, invoicing, and revenue recognition.',
      color: '#00C875'
    },
    { 
      id: 'p2p', name: 'Procure-to-Pay Swarm', 
      agents: ['Procurement Agent', 'Finance Agent', 'Ops Agent'],
      status: 'idle',
      desc: 'End-to-end supply chain orchestration from vendor selection to payment settlement.',
      color: '#579BFC'
    },
    { 
      id: 'delivery', name: 'Project Delivery Swarm', 
      agents: ['PM Agent', 'Dev Agent', 'Support Agent'],
      status: 'active',
      desc: 'Autonomous execution of project milestones, bug triaging, and customer handoff.',
      color: '#FDAB3D'
    },
    { 
      id: 'revops', name: 'Revenue Operations Swarm', 
      agents: ['Sales Agent', 'Marketing Agent', 'Staff Agent'],
      status: 'idle',
      desc: 'Strategic alignment of marketing spend, sales activity, and executive KPIs.',
      color: '#A25DDC'
    }
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>🐝 Agent Swarms</h1>
        <p>Orchestrate collaborative teams of digital employees for end-to-end business processes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '32px' }}>
        {swarms.map(swarm => (
          <div key={swarm.id} style={{ 
            background: '#fff', border: '1px solid #e1e4e8', borderRadius: '16px', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: swarm.color }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${swarm.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={24} style={{ color: swarm.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#323338' }}>{swarm.name}</div>
                <div style={{ fontSize: '12px', color: '#676879' }}>{swarm.agents.length} Agents Assigned</div>
              </div>
              <div style={{ 
                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                background: swarm.status === 'active' ? '#00c8751a' : '#f5f6f8',
                color: swarm.status === 'active' ? '#00c875' : '#676879',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: swarm.status === 'active' ? '#00c875' : '#9699a6' }} />
                {swarm.status.toUpperCase()}
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#676879', lineHeight: '1.5' }}>{swarm.desc}</p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {swarm.agents.map(agent => (
                <div key={agent} style={{ background: '#f5f6f8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#323338', fontWeight: 600 }}>
                  {agent}
                </div>
              ))}
            </div>

            {swarm.status === 'active' && (
              <div style={{ marginTop: '10px', padding: '16px', background: '#f8f9ff', borderRadius: '12px', border: '1px solid #6161FF1a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '12px', fontWeight: 800, color: '#6161FF' }}>
                  <MessageSquare size={14} /> LIVE COORDINATION
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', display: 'flex', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#323338' }}>Sales:</span>
                    <span style={{ color: '#676879' }}>"Quote generated for Initech. Notifying Finance for invoice."</span>
                  </div>
                  <div style={{ fontSize: '12px', display: 'flex', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#323338' }}>Finance:</span>
                    <span style={{ color: '#676879' }}>"Invoice #402 drafted. Pending CFO approval for risk check."</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '10px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#f5f6f8', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#323338' }}>
                View Logs
              </button>
              <button style={{ 
                flex: 1, padding: '10px', 
                background: swarm.status === 'active' ? 'rgba(226, 68, 92, 0.1)' : '#6161FF', 
                borderRadius: '8px', fontSize: '13px', fontWeight: 600, 
                color: swarm.status === 'active' ? '#E2445C' : '#fff',
                border: 'none'
              }}>
                {swarm.status === 'active' ? 'Stop Swarm' : 'Deploy Swarm'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Governance & Trust Controls */}
      <div style={{ marginTop: '40px', padding: '32px', background: '#fff', border: '1px solid #e1e4e8', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Shield size={24} color="#6161FF" />
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Governance & Approval Gates</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {[
            { label: 'Agent Confidence Threshold', value: '95%', desc: 'Agents will request approval if confidence is lower.' },
            { label: 'Max Autonomous Spend', value: '$5,000', desc: 'Financial transactions above this require CFO gate.' },
            { label: 'Sandbox Mode', value: 'ENABLED', desc: 'Test agents in a risk-free environment.' },
            { label: 'Audit Trail Retention', value: '7 Years', desc: 'Full step-by-step reasoning logs preserved.' }
          ].map(item => (
            <div key={item.label} style={{ padding: '16px', background: '#f5f6f8', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#676879', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#323338', marginBottom: '8px' }}>{item.value}</div>
              <div style={{ fontSize: '11px', color: '#9699a6', lineHeight: '1.4' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
