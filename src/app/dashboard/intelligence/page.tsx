'use client';

import { useState } from 'react';
import { 
  Database, Search, Network, Brain, Shield, 
  Cpu, Zap, ArrowRight, CheckCircle2, Info, Lock
} from 'lucide-react';

export default function IntelligencePage() {
  const stats = [
    { label: 'Indexed Documents', value: 'Live', icon: <Database size={18} /> },
    { label: 'Semantic Nodes', value: 'Ready', icon: <Network size={18} /> },
    { label: 'RAG Hit Rate', value: 'Active', icon: <Zap size={18} /> },
    { label: 'Vector Clusters', value: 'Secure', icon: <Cpu size={18} /> },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-greeting">
        <h1>🧠 Enterprise Intelligence</h1>
        <p>Your organizational memory — semantic search, vector storage, and knowledge mapping.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '32px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '20px' }}>
            <div style={{ color: '#6161FF', marginBottom: '12px' }}>{s.icon}</div>
            <div style={{ fontSize: '12px', color: '#676879', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#323338' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginTop: '24px' }}>
        {/* Knowledge Graph Visualization */}
        <div style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '16px', padding: '24px', height: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Network size={20} color="#6161FF" />
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Semantic Knowledge Graph</h2>
          </div>
          <div style={{ flex: 1, background: '#f8f9ff', borderRadius: '12px', border: '1px dashed #6161FF33', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div className="pulse-ring" style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(97, 97, 255, 0.1)', border: '2px solid #6161FF33' }} />
              <div style={{ marginTop: '20px', fontWeight: 700, color: '#6161FF', fontSize: '14px' }}>MAPPING ORGANIZATIONAL CONTEXT...</div>
              <div style={{ fontSize: '11px', color: '#9699a6', marginTop: '4px' }}>RELATING CRM DATA TO ERP FINANCE NODES</div>
            </div>
            
            {/* Nodes will populate dynamically from indexed enterprise data */}
          </div>
        </div>

        {/* Intelligence Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #292d3e, #1a1c2c)', borderRadius: '16px', padding: '24px', color: '#fff', border: '1px solid rgba(97, 97, 255, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Brain size={20} color="#6161FF" />
              <h3 style={{ fontWeight: 700 }}>Neural Reasoning Engine</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#9699a6', lineHeight: '1.6', marginBottom: '20px' }}>
              Chancellor AI is currently synthesizing cross-module relationships to predict fiscal outcomes.
            </p>
            <button style={{ width: '100%', padding: '12px', background: '#6161FF', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none' }}>
              Re-Sync Enterprise Memory
            </button>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '16px', padding: '24px', flex: 1 }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>Vector Privacy & Security</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Lock size={16} color="#00c875" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>AES-256 Encryption</div>
                  <div style={{ fontSize: '11px', color: '#676879' }}>At-rest & in-transit protection</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Shield size={16} color="#00c875" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>SOC2 Data Segregation</div>
                  <div style={{ fontSize: '11px', color: '#676879' }}>Multi-tenant neural isolation</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={16} color="#00c875" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Zero-Trust Retrieval</div>
                  <div style={{ fontSize: '11px', color: '#676879' }}>Identity-aware RAG access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
