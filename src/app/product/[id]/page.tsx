'use client';

import { use, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Zap, Sparkles, Mic, Volume2, 
  HardDrive, LayoutGrid, Users, Code2, Megaphone, Headphones, Bot, Building2,
  Play, Pause, Square, Loader2
} from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import TTSPlayer from '@/components/ai/TTSPlayer';
import VideoBackground from '@/components/layout/VideoBackground';

import { PRODUCT_DATA } from '@/lib/products';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCT_DATA[id] || PRODUCT_DATA.work;

  return (
    <div style={{ background: '#fcfcfd', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 24px rgba(0,0,0,0.02);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .glass-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 48px rgba(0,0,0,0.08);
          background: rgba(255, 255, 255, 0.9);
        }
        .ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
          animation: float 12s infinite ease-in-out alternate;
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -40px) scale(1.1); }
        }
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      <VideoBackground src="/Chancellor_CRM_ERP2.mp4" overlayOpacity={0.8} />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <PublicNavbar />
      </div>
      
      {/* Hero Section */}
      <section style={{ padding: '120px 5% 80px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: `${product.color}15`, color: product.color, 
            padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 700, marginBottom: '32px' 
          }}>
            <product.icon size={18} /> {product.title}
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#323338', lineHeight: '1.1', marginBottom: '24px' }}>
            {product.subtitle}
          </h1>
          <p style={{ fontSize: '20px', color: '#676879', marginBottom: '40px', lineHeight: '1.6' }}>
            {product.description}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-monday-primary">Start Building Now</Link>
            
            <TTSPlayer 
              text={`${product.title}. ${product.subtitle}. Our core features include: ${product.features.join(', ')}. Experience the next generation of productivity with Chancellor's Multimodal Work OS.`} 
              title="Listen to Overview" 
              color={product.color} 
            />
          </div>
        </div>
      </section>

      {/* AI Capabilities Showcase */}
      <section style={{ padding: '100px 10%', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient Background Orbs */}
        <div className="ambient-orb" style={{ top: '-10%', left: '-10%', width: '600px', height: '600px', background: `${product.color}15`, animationDelay: '0s' }} />
        <div className="ambient-orb" style={{ bottom: '-10%', right: '-10%', width: '800px', height: '800px', background: 'rgba(97, 97, 255, 0.08)', animationDelay: '-5s' }} />
        
        <div style={{ textAlign: 'center', marginBottom: '64px', position: 'relative', zIndex: 10 }}>
          <h2 className="text-gradient" style={{ fontSize: '42px', fontWeight: 800, backgroundImage: `linear-gradient(135deg, #323338 0%, ${product.color} 100%)`, display: 'inline-block' }}>AI-Native Capabilities</h2>
          <p style={{ color: '#676879', fontSize: '18px', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0' }}>GPT-5.4 powered TTS, STT, NLP, and Autonomous Agents built into every workflow.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', position: 'relative', zIndex: 10 }}>
          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ background: '#6161FF', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '24px' }}>
              <Mic size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Speech-to-Text</h3>
            <p style={{ color: '#676879', lineHeight: '1.6', fontSize: '14px' }}>Whisper AI transcription. Dictate notes, updates, and commands directly into the platform with real-time NLP entity extraction.</p>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ background: '#00c875', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '24px' }}>
              <Volume2 size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Text-to-Speech</h3>
            <p style={{ color: '#676879', lineHeight: '1.6', fontSize: '14px' }}>HD audio briefings generated on-demand. Listen to pipeline summaries, board status, and AI analysis hands-free.</p>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ background: '#ffcb00', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '24px' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>NLP Intelligence</h3>
            <p style={{ color: '#676879', lineHeight: '1.6', fontSize: '14px' }}>GPT-5.4 sentiment analysis, entity extraction, deal scoring, and natural language queries across all your data.</p>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ background: '#ff3d57', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '24px' }}>
              <Bot size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Autonomous Agents</h3>
            <p style={{ color: '#676879', lineHeight: '1.6', fontSize: '14px' }}>Deploy specialized AI agents that monitor, analyze, and take action autonomously — from pipeline optimization to outreach generation.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 10%', position: 'relative', zIndex: 10, background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#323338', lineHeight: 1.1 }}>
            Comprehensive features for <span style={{ color: product.color }}>{product.title}</span>
          </h2>
          <p style={{ color: '#676879', fontSize: '20px', marginTop: '16px', maxWidth: '700px', margin: '16px auto 0' }}>Everything you need to scale your workflows and empower your team.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>
          {product.features.map((feature: string, index: number) => (
            <div key={index} className="glass-card" style={{ display: 'flex', gap: '24px', padding: '40px', borderRadius: '24px' }}>
              <div style={{ flexShrink: 0, width: '64px', height: '64px', borderRadius: '16px', background: `${product.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: product.color }}>
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px', color: '#323338' }}>{feature.split(':')[0]}</h3>
                <p style={{ color: '#676879', lineHeight: '1.6', fontSize: '15px' }}>{feature.includes(':') ? feature.split(':')[1] : 'Full enterprise-grade capability included in the ChancellorOS ecosystem.'}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <Link href="/" className="btn-monday-primary" style={{ display: 'inline-flex' }}>Get Started with {product.title}</Link>
        </div>
      </section>

      {/* Global Platform Capabilities */}
      <section style={{ padding: '100px 10%', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#323338' }}>Global Platform Foundations</h2>
          <p style={{ color: '#676879', fontSize: '18px', marginTop: '12px' }}>Every ChancellorOS module is built on our high-performance enterprise core.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { title: 'Enterprise SSO', desc: 'SAML, Okta, and Azure AD integration for secure, unified access.' },
            { title: 'Global 24/7 Support', desc: 'Round-the-clock priority assistance for enterprise-tier partners.' },
            { title: '99.99% Uptime SLA', desc: 'Architected for zero-downtime operations and peak reliability.' },
            { title: 'Advanced Encryption', desc: 'AES-256 at rest and TLS 1.3 in transit for all organizational data.' }
          ].map((cap, i) => (
            <div key={i} className="glass-card" style={{ padding: '32px 24px', borderRadius: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#6161FF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Feature</div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: '#323338' }}>{cap.title}</h4>
              <p style={{ fontSize: '14px', color: '#676879', lineHeight: 1.5 }}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Options Section */}
      <section style={{ padding: '120px 10%', position: 'relative', overflow: 'hidden' }}>
        <div className="ambient-orb" style={{ top: '20%', right: '-10%', width: '700px', height: '700px', background: `${product.color}10`, animationDelay: '-2s' }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', justifyContent: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${product.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={24} color={product.color} />
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#323338' }}>Advanced Enterprise Capabilities</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
            {product.deepOptions?.map((option: string, index: number) => (
              <div key={index} className="glass-card" style={{ padding: '32px', borderRadius: '20px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: '#323338', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.color }} />
                  {option.split(':')[0]}
                </h4>
                <p style={{ fontSize: '13px', color: '#676879', lineHeight: '1.5' }}>{option.split(':')[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Quick Link */}
      <section style={{ padding: '60px 10%', background: '#fff', textAlign: 'center', borderTop: '1px solid #eee' }}>
        <p style={{ color: '#676879', fontSize: '15px' }}>
          Interested in the technical foundation? 
          <Link href="/architecture" style={{ color: '#6161FF', fontWeight: 700, marginLeft: '8px', textDecoration: 'none' }}>
            Explore our Enterprise Architecture <ArrowRight size={16} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
          </Link>
        </p>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 10%', background: '#1c1f3b', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px' }}>Ready to transform your work?</h2>
        <p style={{ fontSize: '20px', opacity: 0.8, marginBottom: '40px' }}>Join thousands of teams scaling with Chancellor Work OS.</p>
        <Link href="/" style={{ 
          background: '#6161FF', color: '#fff', padding: '16px 48px', 
          borderRadius: '999px', fontSize: '18px', fontWeight: 700, 
          textDecoration: 'none', display: 'inline-block' 
        }}>Get Started for Free</Link>
      </section>
    </div>
  );
}
