'use client';

import { useState } from 'react';
import { 
  Link as LinkIcon, Share2, Zap, Shield, Database, 
  MessageSquare, Code2, Mail, Globe, Settings, Plus, CheckCircle2
} from 'lucide-react';

export default function MCPConnectorsPage() {
  const [connectors, setConnectors] = useState([
    { id: 'slack', name: 'Slack', status: 'connected', type: 'Messaging', icon: <MessageSquare size={20} color="#4A154B" /> },
    { id: 'github', name: 'GitHub', status: 'connected', type: 'Dev Tools', icon: <Code2 size={20} color="#181717" /> },
    { id: 'salesforce', name: 'Salesforce', status: 'pending', type: 'CRM', icon: <Database size={20} color="#00A1E0" /> },
    { id: 'zapier', name: 'Zapier', status: 'disconnected', type: 'Automation', icon: <Zap size={20} color="#FF4A00" /> },
    { id: 'gmail', name: 'Gmail', status: 'connected', type: 'Email', icon: <Mail size={20} color="#EA4335" /> },
  ]);

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>🔌 Tool Orchestration & MCP</h1>
        <p>Connect ChancellorOS Agents to your entire enterprise ecosystem via Model Context Protocol.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginTop: '32px' }}>
        {connectors.map(connector => (
          <div key={connector.id} style={{ 
            background: '#fff', border: '1px solid #e1e4e8', borderRadius: '16px', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {connector.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#323338' }}>{connector.name}</div>
                <div style={{ fontSize: '12px', color: '#676879' }}>{connector.type}</div>
              </div>
              <div style={{ 
                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                background: connector.status === 'connected' ? '#00c8751a' : '#f5f6f8',
                color: connector.status === 'connected' ? '#00c875' : '#676879',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: connector.status === 'connected' ? '#00c875' : '#9699a6' }} />
                {connector.status.toUpperCase()}
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#676879', lineHeight: '1.5' }}>
              Enable agents to read, write, and execute actions within {connector.name} using autonomous tool-calling.
            </div>

            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #f5f6f8', paddingTop: '20px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#f5f6f8', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#323338' }}>
                Manage Scopes
              </button>
              <button style={{ 
                flex: 1, padding: '10px', 
                background: connector.status === 'connected' ? '#fff' : '#6161FF', 
                border: connector.status === 'connected' ? '1px solid #e1e4e8' : 'none',
                borderRadius: '8px', fontSize: '13px', fontWeight: 600, 
                color: connector.status === 'connected' ? '#323338' : '#fff' 
              }}>
                {connector.status === 'connected' ? 'Configure MCP' : 'Connect'}
              </button>
            </div>
          </div>
        ))}

        <div style={{ 
          background: '#f8f9ff', border: '2px dashed #6161FF33', borderRadius: '16px', padding: '24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
          cursor: 'pointer'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#6161FF1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6161FF' }}>
            <Plus size={24} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#6161FF' }}>Add Custom MCP Tool</div>
            <div style={{ fontSize: '12px', color: '#676879', marginTop: '4px' }}>Connect via OpenAI-compatible tool spec</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '24px', background: 'linear-gradient(90deg, #292d3e, #1a1c2c)', borderRadius: '16px', border: '1px solid rgba(97, 97, 255, 0.3)', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Shield size={20} color="#6161FF" />
          <h3 style={{ fontWeight: 700 }}>Zero-Trust Agent Governance</h3>
        </div>
        <p style={{ fontSize: '14px', color: '#9699a6', lineHeight: '1.6' }}>
          All tool calls executed by agents across external connectors are logged and subject to approval gates. ChancellorOS uses fine-grained RBAC to ensure agents only access data they are authorized to see.
        </p>
      </div>
    </div>
  );
}
