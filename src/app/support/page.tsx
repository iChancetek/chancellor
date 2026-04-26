'use client';

import { Search, LifeBuoy, BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import LandingAIChat from '@/components/ai/LandingAIChat';

export default function SupportPage() {
  const categories = [
    { icon: LifeBuoy, title: 'Getting Started', desc: 'New to Chancellor? Learn the basics here.' },
    { icon: BookOpen, title: 'Documentation', desc: 'Deep dive into our enterprise features.' },
    { icon: MessageSquare, title: 'Community', desc: 'Connect with other ChancellorOS users.' }
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <PublicNavbar />
      
      <section style={{ padding: '120px 5% 80px', textAlign: 'center', background: 'linear-gradient(180deg, #f5f6f8 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#323338', marginBottom: '32px' }}>How can we help?</h1>
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#676879' }} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or help..." 
              style={{ width: '100%', padding: '20px 20px 20px 60px', borderRadius: '12px', border: '1px solid #d0d4e4', fontSize: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 10%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ padding: '40px', background: '#fff', borderRadius: '24px', border: '1px solid #eee', transition: 'all 0.3s', cursor: 'pointer' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#6161FF15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6161FF', marginBottom: '24px' }}>
                <cat.icon size={28} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>{cat.title}</h3>
              <p style={{ color: '#676879', lineHeight: '1.6', marginBottom: '24px' }}>{cat.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6161FF', fontWeight: 700 }}>
                Learn more <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '100px 10%', background: '#0f111a', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px' }}>Still need help?</h2>
        <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px' }}>Our support team is available 24/7 to assist you.</p>
        <button className="btn-monday-primary" style={{ padding: '16px 48px', fontSize: '18px' }}>Contact Support</button>
      </section>

      <LandingAIChat />
      <PublicFooter />
    </div>
  );
}
