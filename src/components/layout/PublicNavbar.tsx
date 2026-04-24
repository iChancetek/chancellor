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
        <Link href="/" style={{ fontWeight: 500, color: '#333', textDecoration: 'none' }}>Products</Link>
        <Link href="/" style={{ fontWeight: 500, color: '#333', textDecoration: 'none' }}>Solutions</Link>
        <Link href="/" style={{ fontWeight: 500, color: '#333', textDecoration: 'none' }}>Resources</Link>
        
        {user ? (
          <Link href="/dashboard" className="btn-monday-primary" style={{ padding: '10px 24px', fontSize: '15px', textDecoration: 'none' }}>
            Go to Workspace
          </Link>
        ) : (
          <>
            <Link href="/" style={{ fontWeight: 500, color: '#0073ea', marginLeft: '20px', textDecoration: 'none' }}>Log in</Link>
            <Link href="/" className="btn-monday-primary" style={{ padding: '10px 24px', fontSize: '15px', textDecoration: 'none' }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
