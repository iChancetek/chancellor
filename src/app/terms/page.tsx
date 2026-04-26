'use client';

import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

export default function TermsPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <PublicNavbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#323338', marginBottom: '24px' }}>Terms of Service</h1>
        <p style={{ color: '#676879', marginBottom: '40px' }}>Last Updated: April 2026</p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>1. Acceptance of Terms</h2>
          <p style={{ color: '#323338', lineHeight: '1.7' }}>
            By accessing or using ChancellorOS, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not use the platform.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>2. Use of the Platform</h2>
          <p style={{ color: '#323338', lineHeight: '1.7' }}>
            ChancellorOS provides a multi-tenant enterprise infrastructure. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>3. Enterprise Architecture</h2>
          <p style={{ color: '#323338', lineHeight: '1.7' }}>
            Our platform utilizes advanced neural technologies, including RAG and multi-agent runtimes. You acknowledge that AI-generated content is provided "as is" and should be reviewed for accuracy.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>4. Data Privacy & Multi-tenancy</h2>
          <p style={{ color: '#323338', lineHeight: '1.7' }}>
            Data isolation is a core pillar of our architecture. Each tenant's data is logically separated and protected by military-grade encryption.
          </p>
        </section>
      </div>
      <PublicFooter />
    </div>
  );
}
