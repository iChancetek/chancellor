'use client';

import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import TTSPlayer from '@/components/ai/TTSPlayer';
import { Lock, Eye, Shield, Database } from 'lucide-react';

export default function PrivacyPage() {
  const pageContent = "Privacy Policy. Last Updated April 2026. 1. Data Collection. We collect data necessary to provide a high-fidelity enterprise experience. This includes organizational metadata, user activity logs, and vector memory. 2. Data Isolation. As a multi-tenant platform, your data is isolated using advanced secure data layers. We do not share organizational data between tenants. 3. AI and Vector Memory. Vector memory is used to power the RAG engine. This data is encrypted at rest and in transit. 4. Security. We employ AES-256 encryption and TLS 1.3 for all communications. Our microservices architecture ensures robust fault tolerance.";

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <PublicNavbar />
      
      {/* Hero Section */}
      <section style={{ padding: '120px 5% 80px', textAlign: 'center', background: 'linear-gradient(180deg, #00c87508 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: '#00c87515', color: '#00c875', 
            padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 700, marginBottom: '32px' 
          }}>
            <Lock size={18} /> Privacy & Security
          </div>
          <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#323338', marginBottom: '24px' }}>Privacy Policy</h1>
          <p style={{ fontSize: '20px', color: '#676879', marginBottom: '40px' }}>Last Updated: April 2026</p>
          
          <TTSPlayer text={pageContent} title="Listen to Privacy Policy" color="#00c875" />
        </div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '60px' }}>
          <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['Data Collection', 'Data Isolation', 'AI Storage', 'Security Specs'].map((item, i) => (
                <div key={i} style={{ padding: '12px 20px', borderRadius: '10px', background: i === 0 ? '#00c87510' : 'transparent', color: i === 0 ? '#00c875' : '#676879', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <main>
            <section style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Eye size={20} color="#00c875" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#323338' }}>1. Data Collection</h2>
              </div>
              <p style={{ color: '#323338', lineHeight: '1.8', fontSize: '17px' }}>
                We collect data necessary to provide a high-fidelity enterprise experience. This includes organizational metadata, user activity logs, and vector memory for AI reasoning.
              </p>
            </section>

            <section style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} color="#6161FF" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#323338' }}>2. Data Isolation</h2>
              </div>
              <p style={{ color: '#323338', lineHeight: '1.8', fontSize: '17px' }}>
                As a multi-tenant platform, your data is isolated using advanced secure data layers. We do not share organizational data between tenants.
              </p>
            </section>

            <section style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={20} color="#a25ddc" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#323338' }}>3. AI & Vector Memory</h2>
              </div>
              <p style={{ color: '#323338', lineHeight: '1.8', fontSize: '17px' }}>
                Vector memory is used to power the RAG (Retrieval-Augmented Generation) engine. This data is encrypted at rest and in transit.
              </p>
            </section>

            <section style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={20} color="#ff3d57" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#323338' }}>4. Security</h2>
              </div>
              <p style={{ color: '#323338', lineHeight: '1.8', fontSize: '17px' }}>
                We employ AES-256 encryption and TLS 1.3 for all communications. Our microservices architecture ensures robust fault tolerance and data protection.
              </p>
            </section>
          </main>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
