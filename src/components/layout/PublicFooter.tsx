'use client';

import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer style={{ padding: '80px 10% 40px', background: '#fff', borderTop: '1px solid #eee' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '60px' }}>
        <div>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 800, color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <img src="/icon.svg" alt="Logo" style={{ width: '28px', height: '28px' }} />
            Chancellor
          </Link>
          <p style={{ fontSize: '14px', color: '#676879', lineHeight: '1.6' }}>
            The neural Work OS powering the modern enterprise. Scale with intelligence.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Product</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/#products-section" style={{ fontSize: '14px', color: '#676879', textDecoration: 'none' }}>Work Management</Link>
            <Link href="/#products-section" style={{ fontSize: '14px', color: '#676879', textDecoration: 'none' }}>ChancellorOS ERP</Link>
            <Link href="/#products-section" style={{ fontSize: '14px', color: '#676879', textDecoration: 'none' }}>ChancellorOS CRM</Link>
            <Link href="/architecture" style={{ fontSize: '14px', color: '#676879', textDecoration: 'none' }}>Architecture</Link>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Support</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/support" style={{ fontSize: '14px', color: '#676879', textDecoration: 'none' }}>Help Center</Link>
            <Link href="/support" style={{ fontSize: '14px', color: '#676879', textDecoration: 'none' }}>Guides</Link>
            <Link href="/support" style={{ fontSize: '14px', color: '#676879', textDecoration: 'none' }}>Contact Us</Link>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Legal</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/terms" style={{ fontSize: '14px', color: '#676879', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/privacy" style={{ fontSize: '14px', color: '#676879', textDecoration: 'none' }}>Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div style={{ paddingWidth: '100%', height: '1px', background: '#eee', marginBottom: '32px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#9699a6' }}>
        <p>© 2026 ChancellorOS. All rights reserved.</p>
        <p>Built for Enterprise Scale</p>
      </div>
    </footer>
  );
}
