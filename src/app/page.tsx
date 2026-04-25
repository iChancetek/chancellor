'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { 
  Sparkles, ArrowRight, CheckCircle2, LayoutGrid, 
  Users, Code2, Headphones, Megaphone, Zap, Bot, Building2
} from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';

export default function LandingPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, error, clearError } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('work');

  const products = [
    { id: 'work', label: 'Work Management', icon: LayoutGrid, color: '#0073ea' },
    { id: 'erp', label: 'ChancellorOS ERP', icon: Building2, color: '#00c875' },
    { id: 'crm', label: 'CRM', icon: Users, color: '#ffcb00' },
    { id: 'dev', label: 'Dev', icon: Code2, color: '#ff3d57' },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, color: '#a25ddc' },
    { id: 'support', label: 'Support', icon: Headphones, color: '#579bfc' },
    { id: 'ai', label: 'Chancellor AI', icon: Bot, color: '#6161FF' }
  ];

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (isLogin) await signInWithEmail(email, password);
    else await signUpWithEmail(email, password, name);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f6f8' }}>
        <img src="/icon.svg" alt="Chancellor" style={{ width: '80px', height: '80px', marginBottom: '32px', filter: 'drop-shadow(0 4px 12px rgba(97,97,255,0.2))' }} />
        <div className="loading-spinner" style={{ width: '32px', height: '32px', border: '3px solid #6161FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#323338', fontSize: '16px', marginTop: '24px', fontWeight: 600 }}>Securing connection...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f6f8' }}>
        <img src="/icon.svg" alt="Chancellor" style={{ width: '80px', height: '80px', marginBottom: '32px', filter: 'drop-shadow(0 4px 12px rgba(97,97,255,0.2))' }} />
        <div className="loading-spinner" style={{ width: '32px', height: '32px', border: '3px solid #6161FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#323338', fontSize: '16px', marginTop: '24px', fontWeight: 600 }}>Initializing your workspace...</p>
        <p style={{ color: '#676879', fontSize: '13px', marginTop: '8px' }}>This may take a moment on your first visit.</p>
      </div>
    );
  }

  return (
    <div className="landing-container">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="lp-hero">
        <h1 className="heading-hero animate-fade-in-up">
          A platform built for a <br />
          <span style={{ color: '#6161FF' }}>new way of working</span>
        </h1>
        <p className="text-subtitle animate-fade-in-up" style={{ marginTop: '32px', animationDelay: '0.1s' }}>
          What would you like to manage with Chancellor Work OS?
        </p>

        {/* Product selector grid - EXACT Monday look */}
        <div className="product-selector-grid animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {products.map((p) => (
            <div 
              key={p.id} 
              className={`product-selector-card ${selectedProduct === p.id ? 'active' : ''}`}
              onClick={() => setSelectedProduct(p.id)}
            >
              <div className="product-icon-wrapper" style={{ backgroundColor: p.color }}>
                <p.icon size={24} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.label}</span>
            </div>
          ))}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="#auth-section" className="btn-monday-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Get Started <ArrowRight size={20} />
          </Link>
          <Link href={`/product/${selectedProduct}`} className="btn-monday-secondary" style={{ padding: '14px 24px', fontSize: '16px', fontWeight: 600, color: '#333', border: '1px solid #d0d4e4', borderRadius: '9999px', background: '#fff' }}>
            Learn more about {products.find(p => p.id === selectedProduct)?.label}
          </Link>
        </div>
        <p style={{ marginTop: '16px', fontSize: '13px', color: '#676879' }}>No credit card needed ✦ Unlimited time on Free plan</p>
      </section>

      {/* Auth Section - Replicating the clean Monday sign-up feel */}
      <section id="auth-section" style={{ backgroundColor: '#f5f6f8', padding: '100px 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '80px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h2 className="heading-section" style={{ marginBottom: '24px' }}>
              The OS that powers <br /> teams to run <br /> everything
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                'Work Management: Automated projects & Gantt charts',
                'ChancellorOS ERP: Resource planning & financials',
                'Sales CRM: AI lead scoring & Gmail/Outlook sync',
                'Dev & R&D: Sprint planning & Git integration',
                'Chancellor AI: Autonomous agents & neural workflows'
              ].map(text => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', color: '#333' }}>
                  <CheckCircle2 size={24} color="#00c875" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="monday-auth-card" style={{ flex: '0 0 440px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>
              {isLogin ? 'Log in to Chancellor' : 'Create your account'}
            </h3>

            <button
              className="btn-google btn-full monday-input"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#fff', height: '48px', marginBottom: '24px' }}
              onClick={signInWithGoogle}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-2.45 0-4.5 1.53-5.33 3.66L3.02 1.83C4.83.67 7 0 9.38 0c4.14 0 7.72 2.3 9.4 5.62l-3.17 1.62c-1.33-1.12-3-1.86-4.85-1.86z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#676879', fontSize: '13px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#d0d4e4' }} />
              <span>or use work email</span>
              <div style={{ flex: 1, height: '1px', background: '#d0d4e4' }} />
            </div>

            <form onSubmit={handleAuth}>
              {!isLogin && (
                <div className="monday-input-group">
                  <label className="monday-label">Name</label>
                  <input className="monday-input" id="name" name="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your full name" required/>
                </div>
              )}
              <div className="monday-input-group">
                <label className="monday-label">Email</label>
                <input className="monday-input" type="email" id="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="example@company.com" required/>
              </div>
              <div className="monday-input-group">
                <label className="monday-label">Password</label>
                <input className="monday-input" type="password" id="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Minimal 8 characters" required/>
              </div>

              {error && <p style={{ color: '#df2f4a', fontSize: '12px', margin: '8px 0' }}>{error}</p>}

              <button className="btn-monday-primary" style={{ width: '100%', marginTop: '24px', borderRadius: '8px', padding: '12px' }} disabled={submitting}>
                {isLogin ? 'Log in' : 'Start free trial'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#333' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); clearError(); }} 
                style={{ color: '#0073ea', fontWeight: 600, marginLeft: '8px' }}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Showcase - INTERCONNECTED APPS */}
      <section style={{ padding: '100px 10%', textAlign: 'center' }}>
        <h2 className="heading-section" style={{ fontSize: '40px' }}>Interconnected apps <br /> for every team</h2>
        <div style={{ marginTop: '60px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: '#fff' }}>
          <img 
            src="/crm_pm_dashboard.png" 
            alt="Chancellor Project Management & CRM Dashboard" 
            style={{ width: '100%', display: 'block', maxHeight: '700px', objectFit: 'cover' }} 
          />
        </div>
      </section>
    </div>
  );
}
