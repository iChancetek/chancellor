'use client';

import { useState } from 'react';
import { 
  Search, Grid, Box, MessageSquare, Users, Code2, 
  Megaphone, HardDrive, Zap, ExternalLink, ShieldCheck, 
  LayoutGrid, ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Apps', icon: LayoutGrid },
  { id: 'communication', label: 'Communication', icon: MessageSquare },
  { id: 'crm', label: 'CRM & Sales', icon: Users },
  { id: 'dev', label: 'Software Development', icon: Code2 },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'storage', label: 'File Storage', icon: HardDrive },
  { id: 'automation', label: 'Automation', icon: Zap },
];

const APPS = [
  // Communication
  { id: 'slack', name: 'Slack', category: 'communication', description: 'Get notifications and sync messages between Slack and Chancellor.', icon: '💬', color: '#4A154B' },
  { id: 'teams', name: 'Microsoft Teams', category: 'communication', description: 'Streamline collaboration with Microsoft Teams integration.', icon: '👥', color: '#6264A7' },
  { id: 'zoom', name: 'Zoom', category: 'communication', description: 'Schedule and join Zoom meetings directly from your tasks.', icon: '📹', color: '#2D8CFF' },
  { id: 'gmail', name: 'Gmail', category: 'communication', description: 'Turn emails into tasks and sync conversations.', icon: '✉️', color: '#EA4335' },
  
  // CRM
  { id: 'salesforce', name: 'Salesforce', category: 'crm', description: 'Sync leads, opportunities, and accounts with your CRM boards.', icon: '☁️', color: '#00A1E0' },
  { id: 'hubspot', name: 'HubSpot', category: 'crm', description: 'Automate your marketing and sales pipelines with HubSpot.', icon: '🧡', color: '#FF7A59' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'crm', description: 'Manage your sales deals and activities seamlessly.', icon: '📈', color: '#223B49' },

  // Dev
  { id: 'github', name: 'GitHub', category: 'dev', description: 'Track pull requests and issues directly on your roadmap.', icon: '🐙', color: '#181717' },
  { id: 'jira', name: 'Jira', category: 'dev', description: 'Two-way sync between Jira issues and Chancellor tasks.', icon: '🏗️', color: '#0052CC' },
  { id: 'gitlab', name: 'GitLab', category: 'dev', description: 'Monitor your DevOps lifecycle and CI/CD pipelines.', icon: '🦊', color: '#FC6D26' },

  // Marketing
  { id: 'mailchimp', name: 'Mailchimp', category: 'marketing', description: 'Sync campaign performance and subscriber lists.', icon: '🐵', color: '#FFE01B' },
  { id: 'fb-ads', name: 'Facebook Ads', category: 'marketing', description: 'Track ad spend and lead conversion in real-time.', icon: '📱', color: '#1877F2' },

  // Storage
  { id: 'google-drive', name: 'Google Drive', category: 'storage', description: 'Attach and preview Google Drive files in any task.', icon: '📂', color: '#4285F4' },
  { id: 'dropbox', name: 'Dropbox', category: 'storage', description: 'Access your Dropbox files without leaving Chancellor.', icon: '📦', color: '#0061FF' },

  // Automation
  { id: 'zapier', name: 'Zapier', category: 'automation', description: 'Connect Chancellor to 5,000+ apps using Zapier.', icon: '⚡', color: '#FF4A00' },
  { id: 'make', name: 'Make', category: 'automation', description: 'Build complex visual automations between your tools.', icon: '🧪', color: '#6100FF' },
];

export default function AppsMarketplace() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = APPS.filter(app => {
    const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#323338', marginBottom: '12px' }}>Chancellor Apps Marketplace</h1>
        <p style={{ fontSize: '16px', color: '#676879', maxWidth: '800px' }}>
          Connect Chancellor to the tools you use every day. Boost your workflow with seamless two-way sync, 
          automated recipes, and deep integrations across communication, CRM, and development.
        </p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#676879' }} />
          <input 
            type="text" 
            placeholder="Search for apps, categories, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #d0d4e4', fontSize: '15px', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f5f6f8', padding: '4px', borderRadius: '8px' }}>
          <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Featured</button>
          <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#676879' }}>Top Rated</button>
          <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#676879' }}>Newest</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Categories Sidebar */}
        <div style={{ width: '240px', flexShrink: 0 }}>
          <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#323338', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', 
                  borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
                  background: activeCategory === cat.id ? '#e1f0ff' : 'transparent',
                  color: activeCategory === cat.id ? '#0073ea' : '#323338',
                  fontWeight: activeCategory === cat.id ? 600 : 400
                }}
              >
                <cat.icon size={18} />
                {cat.label}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px', padding: '20px', background: 'linear-gradient(135deg, #6161FF 0%, #4848d1 100%)', borderRadius: '12px', color: '#fff' }}>
            <Box size={24} style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Build your own app</h4>
            <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '16px', lineHeight: '1.4' }}>Use our SDK and API to build custom integrations for your team.</p>
            <button style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: '#fff', color: '#6161FF', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>View Docs</button>
          </div>
        </div>

        {/* Apps Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredApps.map(app => (
              <div 
                key={app.id} 
                className="app-card-hover"
                style={{ 
                  padding: '24px', borderRadius: '12px', border: '1px solid #e1e4e8', 
                  background: '#fff', cursor: 'pointer', transition: 'all 0.2s ease',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '12px', background: app.color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff' 
                  }}>
                    {app.icon}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#00c875', fontWeight: 700, background: '#e1f9eb', padding: '4px 8px', borderRadius: '4px' }}>
                    <ShieldCheck size={12} /> Verified
                  </div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#323338', marginBottom: '8px' }}>{app.name}</h3>
                <p style={{ fontSize: '14px', color: '#676879', lineHeight: '1.5', marginBottom: '20px', flex: 1 }}>{app.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #f5f6f8' }}>
                  <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#0073ea', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Connect</button>
                  <div style={{ color: '#676879', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                    Learn more <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <LayoutGrid size={48} color="#d0d4e4" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#323338' }}>No apps found</h3>
              <p style={{ color: '#676879' }}>Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
