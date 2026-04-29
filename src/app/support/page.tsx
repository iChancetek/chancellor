'use client';

import { Search, LifeBuoy, BookOpen, MessageSquare, ArrowRight, HelpCircle } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import LandingAIChat from '@/components/ai/LandingAIChat';
import TTSPlayer from '@/components/ai/TTSPlayer';
import VideoBackground from '@/components/layout/VideoBackground';

export default function SupportPage() {
  const pageContent = "Chancellor Support Center. How can we help you today? Explore our comprehensive help center. Getting Started: Learn the basics of ChancellorOS. Documentation: Technical specs for enterprise architects. Community: Connect with other neural platform experts. Contact Us: 24/7 priority support for enterprise tenants.";

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <VideoBackground src="/Chancellor_CRM_ERP2.mp4" overlayOpacity={0.8} />
      <PublicNavbar />
      
      {/* Hero Section */}
      <section style={{ padding: '120px 5% 100px', textAlign: 'center', background: 'transparent' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: '#ffcb0015', color: '#ffcb00', 
            padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 700, marginBottom: '32px' 
          }}>
            <HelpCircle size={18} /> Support Center
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#323338', marginBottom: '24px' }}>How can we help?</h1>
          <p style={{ fontSize: '20px', color: '#676879', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 48px' }}>
            Search our knowledge base or connect with our specialized support agents.
          </p>
          
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 48px' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#676879' }} size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, and tutorials..." 
              style={{ width: '100%', padding: '20px 20px 20px 56px', borderRadius: '16px', border: '2px solid #eee', fontSize: '16px', outline: 'none', transition: 'all 0.2s' }}
              className="search-input"
            />
          </div>

          <TTSPlayer text={pageContent} title="Listen to Support Intro" color="#ffcb00" />
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '0 5% 120px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {[
            { icon: LifeBuoy, title: 'Getting Started', desc: 'New to ChancellorOS? Follow our guided setup for your organization.', color: '#0073ea' },
            { icon: BookOpen, title: 'Documentation', desc: 'Deep dive into our enterprise architecture and API specifications.', color: '#00c875' },
            { icon: MessageSquare, title: 'Priority Support', desc: 'Chat with our enterprise support team for immediate assistance.', color: '#a25ddc' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '40px', borderRadius: '24px', border: '1px solid #eee', background: '#fff', transition: 'all 0.3s', cursor: 'pointer' }} className="hover-card">
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <item.icon size={28} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#323338', marginBottom: '16px' }}>{item.title}</h3>
              <p style={{ color: '#676879', lineHeight: '1.6', marginBottom: '24px' }}>{item.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: item.color, fontWeight: 700, fontSize: '15px' }}>
                Explore <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Mini */}
      <section style={{ padding: '80px 5%', background: '#f5f6f8' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px' }}>Common Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              "How does Multi-tenancy work in ChancellorOS?",
              "Can I export my RAG vector memory?",
              "What is the uptime SLA for enterprise tenants?",
              "How do I manage multi-agent permissions?"
            ].map((q, i) => (
              <div key={i} style={{ padding: '24px', borderRadius: '12px', background: '#fff', border: '1px solid #e1e4e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontWeight: 600, color: '#323338' }}>{q}</span>
                <ArrowRight size={18} color="#676879" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingAIChat />
      <PublicFooter />
    </div>
  );
}
