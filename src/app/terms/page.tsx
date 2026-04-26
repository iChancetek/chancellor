'use client';

import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import TTSPlayer from '@/components/ai/TTSPlayer';
import { Shield, Scale, FileText, Lock } from 'lucide-react';

export default function TermsPage() {
  const pageContent = "Terms of Service. Last Updated April 2026. 1. Acceptance of Terms. By accessing or using ChancellorOS, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not use the platform. 2. Use of the Platform. ChancellorOS provides a multi-tenant enterprise infrastructure. You are responsible for maintaining the confidentiality of your account credentials. 3. Enterprise Architecture. Our platform utilizes advanced neural technologies, including RAG and multi-agent runtimes. You acknowledge that AI-generated content is provided as is. 4. Data Privacy and Multi-tenancy. Data isolation is a core pillar of our architecture. Each tenant's data is logically separated and protected by military-grade encryption.";

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <PublicNavbar />
      
      {/* Hero Section */}
      <section style={{ padding: '120px 5% 80px', textAlign: 'center', background: 'linear-gradient(180deg, #6161FF08 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: '#6161FF15', color: '#6161FF', 
            padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 700, marginBottom: '32px' 
          }}>
            <Scale size={18} /> Legal & Compliance
          </div>
          <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#323338', marginBottom: '24px' }}>Terms of Service</h1>
          <p style={{ fontSize: '20px', color: '#676879', marginBottom: '40px' }}>Last Updated: April 2026</p>
          
          <TTSPlayer text={pageContent} title="Listen to Terms" color="#6161FF" />
        </div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '60px' }}>
          <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['Acceptance', 'Platform Use', 'Architecture', 'Privacy'].map((item, i) => (
                <div key={i} style={{ padding: '12px 20px', borderRadius: '10px', background: i === 0 ? '#6161FF10' : 'transparent', color: i === 0 ? '#6161FF' : '#676879', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <main>
            <section style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} color="#6161FF" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#323338' }}>1. Acceptance of Terms</h2>
              </div>
              <p style={{ color: '#323338', lineHeight: '1.8', fontSize: '17px' }}>
                By accessing or using ChancellorOS, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not use the platform.
              </p>
            </section>

            <section style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} color="#00c875" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#323338' }}>2. Use of the Platform</h2>
              </div>
              <p style={{ color: '#323338', lineHeight: '1.8', fontSize: '17px' }}>
                ChancellorOS provides a multi-tenant enterprise infrastructure. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={20} color="#ffcb00" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#323338' }}>3. Enterprise Architecture</h2>
              </div>
              <p style={{ color: '#323338', lineHeight: '1.8', fontSize: '17px' }}>
                Our platform utilizes advanced neural technologies, including RAG and multi-agent runtimes. You acknowledge that AI-generated content is provided "as is" and should be reviewed for accuracy.
              </p>
            </section>

            <section style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} color="#ff3d57" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#323338' }}>4. Data Privacy & Multi-tenancy</h2>
              </div>
              <p style={{ color: '#323338', lineHeight: '1.8', fontSize: '17px' }}>
                Data isolation is a core pillar of our architecture. Each tenant's data is logically separated and protected by military-grade encryption.
              </p>
            </section>
          </main>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
