'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, ShieldCheck, Copy, Check, Zap, 
  Settings2, HelpCircle, ExternalLink, RefreshCw 
} from 'lucide-react';
import { useBoardStore } from '@/lib/store';

const APPS_DATA: Record<string, any> = {
  slack: { name: 'Slack', color: '#4A154B', icon: '💬', setupDocs: 'https://api.slack.com/messaging/webhooks' },
  github: { name: 'GitHub', color: '#181717', icon: '🐙', setupDocs: 'https://docs.github.com/en/webhooks' },
  zapier: { name: 'Zapier', color: '#FF4A00', icon: '⚡', setupDocs: 'https://zapier.com/apps/webhook/integrations' },
  salesforce: { name: 'Salesforce', color: '#00A1E0', icon: '☁️', setupDocs: 'https://developer.salesforce.com/docs' },
  hubspot: { name: 'HubSpot', color: '#FF7A59', icon: '🧡', setupDocs: 'https://developers.hubspot.com/docs/api/overview' },
};

export default function AppConfigPage({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = use(params);
  const router = useRouter();
  const { boards } = useBoardStore();
  const app = APPS_DATA[appId] || { name: appId, color: '#6161FF', icon: '🔌' };

  const [selectedBoard, setSelectedBoard] = useState(boards[0]?.id || '');
  const [selectedGroup, setSelectedGroup] = useState(boards[0]?.groups[0]?.id || '');
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);

  const webhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/integrations/webhook?boardId=${selectedBoard}&groupId=${selectedGroup}&source=${appId}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => router.back()}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#676879', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontWeight: 600 }}
      >
        <ArrowLeft size={18} /> Back to Marketplace
      </button>

      <div style={{ display: 'flex', gap: '48px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#fff' }}>
              {app.icon}
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#323338' }}>{app.name} Integration</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#00c875', fontWeight: 700 }}>
                <ShieldCheck size={16} /> Elite Verified Integration
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #d0d4e4', borderRadius: '12px', padding: '32px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings2 size={20} color="#6161FF" /> Configuration
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#323338', marginBottom: '8px' }}>Target Board</label>
                <select 
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d0d4e4', outline: 'none' }}
                >
                  {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#323338', marginBottom: '8px' }}>Target Group</label>
                <select 
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d0d4e4', outline: 'none' }}
                >
                  {boards.find(b => b.id === selectedBoard)?.groups.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#323338', marginBottom: '8px' }}>API Key / Token (Optional)</label>
                <input 
                  type="password"
                  placeholder={`Enter your ${app.name} API Key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d0d4e4', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '32px', padding: '20px', background: '#f8f9fb', borderRadius: '8px', border: '1px solid #e1e4e8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#323338' }}>Webhook URL</span>
                <button 
                  onClick={handleCopy}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#0073ea', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                >
                  {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy URL</>}
                </button>
              </div>
              <code style={{ display: 'block', wordBreak: 'break-all', fontSize: '12px', color: '#676879', background: '#fff', padding: '12px', borderRadius: '4px', border: '1px solid #d0d4e4' }}>
                {webhookUrl}
              </code>
              <p style={{ fontSize: '12px', color: '#676879', marginTop: '12px', lineHeight: '1.4' }}>
                Paste this URL into your {app.name} webhook settings. Every time an event occurs in {app.name}, Chancellor will automatically create a new item in your selected board.
              </p>
            </div>

            <button style={{ width: '100%', padding: '14px', background: '#6161FF', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, marginTop: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Zap size={18} /> Activate Integration
            </button>
          </div>
        </div>

        <div style={{ width: '320px' }}>
          <div style={{ background: '#fff', border: '1px solid #d0d4e4', borderRadius: '12px', padding: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} color="#6161FF" /> Setup Guide
            </h4>
            <div style={{ fontSize: '14px', color: '#676879', lineHeight: '1.6' }}>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>Configure your target Board and Group in the settings panel.</li>
                <li>Copy the unique Webhook URL generated for your account.</li>
                <li>Go to your {app.name} administration console.</li>
                <li>Add a new Webhook and paste the URL.</li>
                <li>Chancellor will start receiving data instantly!</li>
              </ol>
              <a 
                href={app.setupDocs} 
                target="_blank"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0073ea', textDecoration: 'none', fontWeight: 600, marginTop: '20px' }}
              >
                Official {app.name} Docs <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
