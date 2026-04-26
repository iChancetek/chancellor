'use client';

import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

export default function PrivacyPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <PublicNavbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#323338', marginBottom: '24px' }}>Privacy Policy</h1>
        <p style={{ color: '#676879', marginBottom: '40px' }}>Last Updated: April 2026</p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>1. Data Collection</h2>
          <p style={{ color: '#323338', lineHeight: '1.7' }}>
            We collect data necessary to provide a high-fidelity enterprise experience. This includes organizational metadata, user activity logs, and vector memory for AI reasoning.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>2. Data Isolation</h2>
          <p style={{ color: '#323338', lineHeight: '1.7' }}>
            As a multi-tenant platform, your data is isolated using advanced secure data layers. We do not share organizational data between tenants.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>3. AI & Vector Memory</h2>
          <p style={{ color: '#323338', lineHeight: '1.7' }}>
            Vector memory is used to power the RAG (Retrieval-Augmented Generation) engine. This data is encrypted at rest and in transit.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>4. Security</h2>
          <p style={{ color: '#323338', lineHeight: '1.7' }}>
            We employ AES-256 encryption and TLS 1.3 for all communications. Our microservices architecture ensures robust fault tolerance and data protection.
          </p>
        </section>
      </div>
      <PublicFooter />
    </div>
  );
}
