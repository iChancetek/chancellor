'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, Sparkles, Building2, Users, Bot, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, error, clearError } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setSubmitting(true);
    if (isLogin) {
      await signInWithEmail(email, password);
    } else {
      await signUpWithEmail(email, password, name);
      router.push('/verify');
    }
    setSubmitting(false);
  };

  if (loading || user) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <img src="/icon.svg" alt="Chancellor" style={{ width: '80px', height: '80px', marginBottom: '32px' }} />
        <div className="loading-spinner" style={{ width: '32px', height: '32px', border: '3px solid #6161FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', overflowX: 'hidden' }}>
      
      {/* Centered Logo */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#000', fontSize: '32px', fontWeight: 800, marginBottom: '48px' }}>
        <img src="/icon.svg" alt="Logo" style={{ width: '40px', height: '40px' }} />
        Chancellor
      </Link>

      <div style={{ 
        maxWidth: '460px', 
        width: '100%', 
        padding: 'clamp(24px, 5vw, 48px)',
        borderRadius: '24px',
        border: '1px solid #e1e4e8',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        background: '#fff'
      }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 className="heading-section" style={{ color: '#323338', marginBottom: '12px' }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ color: '#676879' }}>ChancellorOS CRM and EPR Cloud Platform</p>
        </div>

        <button
          className="btn-google btn-full monday-input"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#fff', height: '52px', marginBottom: '24px', borderRadius: '12px', border: '1px solid #d0d4e4', cursor: 'pointer', fontWeight: 600 }}
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

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <div className="monday-input-group">
              <label className="monday-label">Full Name</label>
              <input className="monday-input" style={{ borderRadius: '12px' }} type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your full name" required/>
            </div>
          )}
          <div className="monday-input-group">
            <label className="monday-label">Work Email</label>
            <input className="monday-input" style={{ borderRadius: '12px' }} type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@company.com" required/>
          </div>
          <div className="monday-input-group" style={{ marginTop: '20px' }}>
            <label className="monday-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="monday-input" style={{ borderRadius: '12px', paddingRight: '48px' }} type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#676879', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="monday-input-group" style={{ marginTop: '20px' }}>
              <label className="monday-label">Confirm Password</label>
              <input className="monday-input" style={{ borderRadius: '12px' }} type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Repeat password" required/>
            </div>
          )}

          {error && <p style={{ color: '#df2f4a', fontSize: '12px', margin: '12px 0' }}>{error}</p>}

          <button className="btn-monday-primary" style={{ width: '100%', marginTop: '32px', borderRadius: '12px', padding: '16px', fontSize: '16px' }} disabled={submitting}>
            {submitting ? 'Processing...' : isLogin ? 'Log in' : 'Get Started Free'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#676879' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => { setIsLogin(!isLogin); clearError(); }}
            style={{ color: '#6161FF', fontWeight: 700, marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>

      <Link href="/" style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px', color: '#676879', fontWeight: 600, textDecoration: 'none', fontSize: '14px' }}>
        <ArrowLeft size={18} /> Back to home
      </Link>
    </div>
  );
}
