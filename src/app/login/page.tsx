'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await signInWithEmail(email, password);
    setSubmitting(false);
  };

  if (loading || user) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f6f8' }}>
        <img src="/icon.svg" alt="Chancellor" style={{ width: '80px', height: '80px', marginBottom: '32px' }} />
        <div className="loading-spinner" style={{ width: '32px', height: '32px', border: '3px solid #6161FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#f5f6f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <Link href="/" style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', alignItems: 'center', gap: '8px', color: '#676879', fontWeight: 600, textDecoration: 'none' }}>
        <ArrowLeft size={20} /> Back to home
      </Link>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#000', fontSize: '32px', fontWeight: 800, marginBottom: '24px' }}>
            <img src="/icon.svg" alt="Logo" style={{ width: '40px', height: '40px' }} />
            Chancellor
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#323338' }}>Log in to your account</h1>
          <p style={{ color: '#676879', marginTop: '12px' }}>Enter your details to continue to your workspace</p>
        </div>

        <div className="monday-auth-card" style={{ padding: '40px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
          <button
            className="btn-google btn-full monday-input"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#fff', height: '52px', marginBottom: '24px', borderRadius: '12px', border: '1px solid #d0d4e4', cursor: 'pointer' }}
            onClick={signInWithGoogle}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-2.45 0-4.5 1.53-5.33 3.66L3.02 1.83C4.83.67 7 0 9.38 0c4.14 0 7.72 2.3 9.4 5.62l-3.17 1.62c-1.33-1.12-3-1.86-4.85-1.86z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#676879', fontSize: '13px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#d0d4e4' }} />
            <span>or use email</span>
            <div style={{ flex: 1, height: '1px', background: '#d0d4e4' }} />
          </div>

          <form onSubmit={handleLogin}>
            <div className="monday-input-group">
              <label className="monday-label">Work Email</label>
              <input className="monday-input" style={{ borderRadius: '12px' }} type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="example@company.com" required/>
            </div>
            <div className="monday-input-group" style={{ marginTop: '16px' }}>
              <label className="monday-label">Password</label>
              <input className="monday-input" style={{ borderRadius: '12px' }} type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password" required/>
            </div>

            {error && <p style={{ color: '#df2f4a', fontSize: '12px', margin: '8px 0' }}>{error}</p>}

            <button className="btn-monday-primary" style={{ width: '100%', marginTop: '32px', borderRadius: '12px', padding: '14px', fontSize: '16px' }} disabled={submitting}>
              {submitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#676879' }}>
            Don&apos;t have an account? 
            <Link href="/#auth-section" style={{ color: '#6161FF', fontWeight: 700, marginLeft: '8px', textDecoration: 'none' }}>
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
