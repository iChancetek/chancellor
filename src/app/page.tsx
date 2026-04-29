'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { 
  Sparkles, ArrowRight, CheckCircle2, LayoutGrid, 
  Users, Code2, Headphones, Megaphone, Zap, Bot, Building2,
  Eye, EyeOff, PieChart, Briefcase
} from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import LandingAIChat from '@/components/ai/LandingAIChat';

export default function LandingPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, error, clearError } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('work');

  const products = [
    { id: 'work', label: 'Work Management', icon: LayoutGrid, color: '#0073ea' },
    { id: 'erp', label: 'ChancellorOS ERP', icon: Building2, color: '#00c875' },
    { id: 'crm', label: 'ChancellorOS CRM', icon: Users, color: '#ffcb00' },
    { id: 'finance', label: 'Finance', icon: PieChart, color: '#00d745' },
    { id: 'hr', label: 'HR', icon: Briefcase, color: '#ff5ac4' },
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
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setSubmitting(true);
    if (isLogin) {
      await signInWithEmail(email, password);
    } else {
      await signUpWithEmail(email, password, name);
      // Redirect to verification page
      router.push('/verify');
    }
    setSubmitting(false);
  };

  useEffect(() => {
    // Force body transparency so fixed video at z-index -1 is visible
    document.body.style.background = 'transparent';
    return () => { document.body.style.background = ''; };
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <img src="/icon.svg" alt="Chancellor" style={{ width: '80px', height: '80px', marginBottom: '32px', filter: 'drop-shadow(0 4px 12px rgba(97,97,255,0.2))' }} />
        <div className="loading-spinner" style={{ width: '32px', height: '32px', border: '3px solid #6161FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#323338', fontSize: '16px', marginTop: '24px', fontWeight: 600 }}>Securing connection...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <img src="/icon.svg" alt="Chancellor" style={{ width: '80px', height: '80px', marginBottom: '32px', filter: 'drop-shadow(0 4px 12px rgba(97,97,255,0.2))' }} />
        <div className="loading-spinner" style={{ width: '32px', height: '32px', border: '3px solid #6161FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#323338', fontSize: '16px', marginTop: '24px', fontWeight: 600 }}>Initializing your workspace...</p>
        <p style={{ color: '#676879', fontSize: '13px', marginTop: '8px' }}>This may take a moment on your first visit.</p>
      </div>
    );
  }

  return (
    <div className="landing-container" style={{ position: 'relative', background: 'transparent' }}>
      {/* Background Video Layer */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, overflow: 'hidden' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="/ChancellorOS.mp4"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Even more subtle overlay to allow the video to be seen clearly */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
      </div>

      {/* Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section id="products-section" className="lp-hero" style={{ background: 'transparent' }}>
        <h1 className="heading-hero">
          A platform built for a <br />
          <span style={{ color: '#6161FF' }}>new way of working</span>
        </h1>
        
        <div style={{ marginTop: '32px', padding: '24px 32px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
          <p className="text-subtitle" style={{ color: '#1c1c1c', fontWeight: 600, margin: 0 }}>
            What would you like to manage with Chancellor Work OS?
          </p>
        </div>

        {/* Product selector grid */}
        <div className="product-selector-grid">
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

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="#auth-section" className="btn-monday-primary full-width-on-mobile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            Get Started <ArrowRight size={20} />
          </Link>
          <Link href={`/product/${selectedProduct}`} className="btn-monday-secondary full-width-on-mobile" style={{ padding: '14px 24px', fontSize: '16px', fontWeight: 600, color: '#333', border: '1px solid #d0d4e4', borderRadius: '9999px', background: '#fff', textAlign: 'center' }}>
            Learn more about {products.find(p => p.id === selectedProduct)?.label}
          </Link>
        </div>
        <p style={{ marginTop: '24px', fontSize: '14px', color: '#676879', textAlign: 'center', fontWeight: 500 }}>No credit card needed ✦ Unlimited time on Free plan</p>
      </section>

      {/* Solutions Section */}
      <section id="solutions-section" className="dark-premium-section section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(97,97,255,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        
        <div className="responsive-flex" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <h2 className="heading-section" style={{ marginBottom: '32px', color: '#fff' }}>
              The OS that powers <br /> <span className="gradient-text">teams to run everything</span>
            </h2>
            <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: '#b0b3c0', marginBottom: '48px', lineHeight: '1.6', fontWeight: 400 }}>
              ChancellorOS is not just a tool; it is a comprehensive neural ecosystem designed for the modern enterprise. 
              Seamlessly bridge the gap between CRM, ERP, and project execution.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Work Management', desc: 'Automated projects & Gantt charts' },
                { title: 'ChancellorOS ERP', desc: 'Unified resource planning & financials' },
                { title: 'ChancellorOS CRM', desc: 'AI lead scoring & sales automation' },
                { title: 'Dev & R&D', desc: 'Sprint planning & technical roadmap' },
                { title: 'Chancellor AI', desc: 'Autonomous agents & multimodal reasoning' }
              ].map((item, i) => (
                <div key={i} className="modern-grid-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '8px', background: 'rgba(97,97,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={18} color="#00c875" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{item.title}</h4>
                    <p style={{ fontSize: '12px', color: '#9699a6' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1.2, position: 'relative', marginTop: '40px' }}>
            <div className="animate-float" style={{ position: 'relative', zIndex: 2 }}>
              <img 
                src="/erp_crm.png" 
                alt="Chancellor ERP and CRM Interface" 
                style={{ width: '100%', height: 'auto', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }} 
              />
              {/* Responsive Decorative elements */}
              <div className="mobile-hide" style={{ position: 'absolute', top: '-20px', left: '-20px', padding: '12px 20px', background: 'rgba(97,97,255,0.9)', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '13px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                Real-time ERP
              </div>
              <div className="mobile-hide" style={{ position: 'absolute', bottom: '40px', right: '-20px', padding: '12px 20px', background: 'rgba(0,200,117,0.9)', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '13px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                Intelligent CRM
              </div>
            </div>
            <div style={{ position: 'absolute', inset: '20px', background: 'linear-gradient(135deg, #6161FF, #00c875)', filter: 'blur(60px)', opacity: 0.15, zIndex: 1 }} />
          </div>
        </div>
      </section>

      {/* Bottom Showcase */}
      <section id="resources-section" className="section-padding" style={{ textAlign: 'center', background: 'transparent' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto 60px', padding: '40px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid #fff', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <h2 className="heading-section" style={{ marginBottom: '16px' }}>
            Interconnected apps <br /> <span className="gradient-text">for every team</span>
          </h2>
          <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: '#323338', maxWidth: '800px', margin: '0 auto', fontWeight: 500, lineHeight: 1.6 }}>
            Break down silos and unify your entire organizational workflow. 
            Our suite of interconnected modules ensures that data flows effortlessly between every department.
          </p>
        </div>
        
        <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.12)', background: 'rgba(0,0,0,0.8)', margin: '0 auto', maxWidth: '1000px' }}>
          <img 
            src="/apps_grid.png" 
            alt="Chancellor Interconnected Apps Grid" 
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '600px', objectFit: 'cover', opacity: 0.9 }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
        </div>

        <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { title: 'Global Sync', desc: 'Real-time data parity across all modules.' },
            { title: 'Neural Connect', desc: 'AI-driven cross-module intelligence.' },
            { title: 'Deep Integration', desc: 'Bespoke webhooks for external tools.' },
            { title: 'Enterprise Security', desc: 'Governance and encryption at scale.' }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'left', padding: '24px', borderRadius: '16px', border: '1px solid #d0d4e4', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}>
              <Zap size={24} color="#6161FF" style={{ marginBottom: '16px' }} />
              <h5 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px', color: '#1c1c1c' }}>{item.title}</h5>
              <p style={{ fontSize: '14px', color: '#323338', fontWeight: 500 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      <LandingAIChat />

      {/* Auth Section */}
      <section id="auth-section" style={{ background: 'rgba(245, 246, 248, 0.5)', padding: '80px 24px', borderTop: '1px solid #e1e4e8' }}>
        <div style={{ maxWidth: '460px', margin: '0 auto' }}>
          <div className="monday-auth-card" style={{ padding: 'clamp(24px, 5vw, 48px)', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>
              {isLogin ? 'Welcome back' : 'Start your free trial'}
            </h3>

            <button
              className="btn-google btn-full monday-input"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#fff', height: '52px', marginBottom: '24px', borderRadius: '12px' }}
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
              <span>or use work email</span>
              <div style={{ flex: 1, height: '1px', background: '#d0d4e4' }} />
            </div>

            <form onSubmit={handleAuth}>
              {!isLogin && (
                <div className="monday-input-group">
                  <label className="monday-label">Full Name</label>
                  <input className="monday-input" style={{ borderRadius: '12px' }} id="name" name="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your full name" required/>
                </div>
              )}
              <div className="monday-input-group">
                <label className="monday-label">Work Email</label>
                <input className="monday-input" style={{ borderRadius: '12px' }} type="email" id="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="example@company.com" required/>
              </div>
              <div className="monday-input-group">
                <label className="monday-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="monday-input" style={{ borderRadius: '12px', paddingRight: '48px' }} type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Minimal 8 characters" required/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#676879', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="monday-input-group">
                  <label className="monday-label">Confirm Password</label>
                  <input className="monday-input" style={{ borderRadius: '12px' }} type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Repeat password" required/>
                </div>
              )}

              {error && <p style={{ color: '#df2f4a', fontSize: '12px', margin: '8px 0' }}>{error}</p>}

              <button className="btn-monday-primary" style={{ width: '100%', marginTop: '24px', borderRadius: '12px', padding: '14px', fontSize: '16px' }} disabled={submitting}>
                {isLogin ? 'Log in' : 'Get Started Free'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#676879' }}>
              {isLogin ? "New to Chancellor?" : "Already have an account?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); clearError(); }} 
                style={{ color: '#6161FF', fontWeight: 700, marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {isLogin ? 'Sign up for free' : 'Log in here'}
              </button>
            </p>
          </div>
            <p style={{ textAlign: 'center', marginTop: '32px', color: '#676879', fontSize: '13px' }}>
              By signing up, you agree to our <Link href="/terms" style={{ color: '#6161FF', textDecoration: 'none' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: '#6161FF', textDecoration: 'none' }}>Privacy Policy</Link>.
            </p>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
