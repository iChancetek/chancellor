'use client';

import { useState } from 'react';
import { 
  X, Upload, Download, Database, Mail, Globe, 
  MessageSquare, Layout, Server, ArrowRight, CheckCircle2, 
  FileJson, FileSpreadsheet, AlertCircle, Loader2
} from 'lucide-react';

interface ImportModalProps {
  onClose: () => void;
  onImport: (data: any[]) => void;
}

const SOURCES = [
  { id: 'hubspot', name: 'HubSpot', icon: Database, color: '#ff7a59', description: 'Import contacts, deals, and notes' },
  { id: 'monday', name: 'Monday.com', icon: Layout, color: '#6161FF', description: 'Import boards, groups, and items' },
  { id: 'salesforce', name: 'Salesforce', icon: Globe, color: '#00a1e0', description: 'Sync leads and opportunities' },
  { id: 'google', name: 'Google Workspace', icon: Mail, color: '#4285F4', description: 'Import Google Contacts and Sheets' },
  { id: 'microsoft', name: 'Dynamics 365', icon: Server, color: '#00a4ef', description: 'Enterprise ERP/CRM integration' },
  { id: 'csv', name: 'CSV / Excel', icon: FileSpreadsheet, color: '#1D6F42', description: 'Universal spreadsheet upload' },
];

export default function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [step, setStep] = useState<'source' | 'upload' | 'mapping' | 'success'>('source');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
    setStep('upload');
  };

  const handleSimulateImport = () => {
    setIsProcessing(true);
    // Simulate data processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      // Pass some mock data
      onImport([
        { name: 'John Doe', email: 'john@example.com', phone: '+1 555-0123' },
        { name: 'Jane Smith', email: 'jane@acme.corp', phone: '+1 555-9876' }
      ]);
    }, 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '800px', borderRadius: '16px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px' }}>
        
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#323338' }}>Import Data to Chancellor</h2>
            <p style={{ fontSize: '13px', color: '#676879', marginTop: '4px' }}>Populate your workspace with existing data from other platforms</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#676879' }}><X size={24} /></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {step === 'source' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {SOURCES.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => handleSourceSelect(s.id)}
                  style={{ 
                    padding: '24px', border: '1px solid #e1e4e8', borderRadius: '12px', cursor: 'pointer',
                    transition: 'all 0.2s', display: 'flex', gap: '20px', alignItems: 'center'
                  }}
                  className="import-source-card"
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}05`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e1e4e8'; e.currentTarget.style.background = 'none'; }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#323338' }}>{s.name}</h4>
                    <p style={{ fontSize: '12px', color: '#676879', marginTop: '4px' }}>{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 'upload' && (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f5f6f8', color: '#6161FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Upload size={48} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#323338', marginBottom: '12px' }}>Connect to {SOURCES.find(s => s.id === selectedSource)?.name}</h3>
              <p style={{ fontSize: '15px', color: '#676879', maxWidth: '400px', margin: '0 auto 32px' }}>
                Chancellor will securely authenticate and map your external fields to your active board columns.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button 
                  onClick={() => setStep('source')}
                  style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #d0d4e4', background: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Back
                </button>
                <button 
                  onClick={handleSimulateImport}
                  disabled={isProcessing}
                  className="btn-monday-primary"
                  style={{ padding: '12px 40px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Authorizing...</> : <>Authorize & Import <ArrowRight size={16} /></>}
                </button>
              </div>
              
              <div style={{ marginTop: '48px', padding: '16px', background: '#fff8f0', borderRadius: '12px', border: '1px solid #fde7cc', display: 'flex', gap: '12px', textAlign: 'left' }}>
                <AlertCircle size={20} color="#FDAB3D" />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#323338' }}>Security Note</p>
                  <p style={{ fontSize: '12px', color: '#676879' }}>Chancellor uses read-only enterprise tokens. Your source data remains untouched.</p>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#00C87515', color: '#00C875', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#323338', marginBottom: '12px' }}>Import Successful!</h3>
              <p style={{ fontSize: '15px', color: '#676879', marginBottom: '32px' }}>We've successfully mapped 1,248 records from {SOURCES.find(s => s.id === selectedSource)?.name} to your board.</p>
              
              <button 
                onClick={onClose}
                className="btn-monday-primary"
                style={{ padding: '12px 40px', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }}
              >
                Go to Board
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 32px', background: '#f5f6f8', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <FileJson size={18} color="#676879" aria-label="JSON Support" />
            <FileSpreadsheet size={18} color="#676879" aria-label="Excel Support" />
          </div>
          <span style={{ fontSize: '12px', color: '#676879' }}>Chancellor Enterprise Integration Engine v2.4</span>
        </div>
      </div>
    </div>
  );
}
