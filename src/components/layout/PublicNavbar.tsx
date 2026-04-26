'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function PublicNavbar() {
  const { user } = useAuth();

  return (
    <nav className="lp-navbar">
      <Link href="/" className="landing-logo" style={{ color: '#000', fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <img src="/icon.svg" alt="Chancellor Logo" style={{ width: '32px', height: '32px' }} />
        Chancellor
      </Link>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <div className="hide-on-mobile" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/#products-section" style={{ fontWeight: 500, color: '#333', textDecoration: 'none' }}>Products</Link>
          <Link href="/#solutions-section" style={{ fontWeight: 500, color: '#333', textDecoration: 'none' }}>Solutions</Link>
          <Link href="/architecture" style={{ fontWeight: 500, color: '#333', textDecoration: 'none' }}>Architecture</Link>
          <Link href="/#resources-section" style={{ fontWeight: 500, color: '#333', textDecoration: 'none' }}>Resources</Link>
        </div>
        
        {user ? (
          <Link href="/dashboard" className="btn-monday-primary" style={{ padding: '10px 24px', fontSize: '15px', textDecoration: 'none' }}>
            Go to Workspace
          </Link>
        ) : (
          <>
            <Link href="/login" style={{ fontWeight: 500, color: '#0073ea', marginLeft: '20px', textDecoration: 'none' }}>Log in</Link>
            <Link href="/#auth-section" className="btn-monday-primary" style={{ padding: '10px 24px', fontSize: '15px', textDecoration: 'none' }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
