'use client';

import { use, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle2, Zap, Sparkles, Mic, Volume2, 
  HardDrive, LayoutGrid, Users, Code2, Megaphone, Headphones, Bot, Building2,
  Play, Pause, Square, Loader2
} from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';

import { PRODUCT_DATA } from '@/lib/products';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCT_DATA[id] || PRODUCT_DATA.work;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlay = async () => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    // Start fresh
    setIsLoading(true);
    try {
      const text = `${product.title}. ${product.subtitle}. Our core features include: ${product.features.join(', ')}. Experience the next generation of productivity with Chancellor's Multimodal Work OS.`;
      
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Playback failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <PublicNavbar />
      
      {/* Hero Section */}
      <section style={{ padding: '120px 5% 80px', textAlign: 'center', background: `linear-gradient(180deg, ${product.color}05 0%, #ffffff 100%)` }}>
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
            
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #d0d4e4', borderRadius: '999px', padding: '4px 8px' }}>
              <button 
                onClick={handleTogglePlay}
                disabled={isLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '15px', fontWeight: 600, color: '#323338', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isLoading ? 'Loading Audio...' : isPlaying ? 'Pause Overview' : isPaused ? 'Resume Overview' : 'Listen to Overview'}
              </button>
              
              {(isPlaying || isPaused) && (
                <button 
                  onClick={handleStop}
                  style={{ padding: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#676879', borderLeft: '1px solid #d0d4e4', marginLeft: '4px' }}
                  title="Stop Playback"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Multimodal Showcase */}
      <section style={{ padding: '100px 10%', background: '#f5f6f8' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#323338' }}>The Multimodal Advantage</h2>
          <p style={{ color: '#676879', fontSize: '18px', marginTop: '12px' }}>Go beyond text with our integrated audio, video, and AI engines.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#6161FF', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '24px' }}>
              <Mic size={24} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Diction Mics</h3>
            <p style={{ color: '#676879', lineHeight: '1.6' }}>Dictate updates, tasks, and comments directly into the platform with state-of-the-art Whisper AI transcription.</p>
          </div>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#00c875', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '24px' }}>
              <Volume2 size={24} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Listen to Board</h3>
            <p style={{ color: '#676879', lineHeight: '1.6' }}>Catch up on progress eyes-free. Chancellor generates AI audio summaries of your entire board in seconds.</p>
          </div>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#ffcb00', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '24px' }}>
              <HardDrive size={24} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Multimedia Center</h3>
            <p style={{ color: '#676879', lineHeight: '1.6' }}>Centralize all your photos, videos, and slide decks in one task-specific repository with cloud-syncing.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 10%' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#323338' }}>
            Comprehensive features for {product.title}
          </h2>
          <p style={{ color: '#676879', fontSize: '18px', marginTop: '12px' }}>Everything you need to scale your workflows and empower your team.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
          {product.features.map((feature: string, index: number) => (
            <div key={index} style={{ display: 'flex', gap: '20px', background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #eee', transition: 'all 0.3s' }}>
              <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '12px', background: `${product.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: product.color }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#323338' }}>{feature.split(':')[0]}</h3>
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
      <section style={{ padding: '100px 10%', background: '#fff' }}>
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
            <div key={i} style={{ padding: '24px', background: '#f5f6f8', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#6161FF', marginBottom: '12px' }}>CORE FEATURE</div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{cap.title}</h4>
              <p style={{ fontSize: '13px', color: '#676879' }}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Options Section */}
      <section style={{ padding: '100px 10%', background: '#fcfcfd', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <Zap size={24} color={product.color} />
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#323338' }}>Advanced Enterprise Capabilities</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {product.deepOptions?.map((option: string, index: number) => (
              <div key={index} style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', transition: 'all 0.2s' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#323338' }}>{option.split(':')[0]}</h4>
                <p style={{ fontSize: '13px', color: '#676879', lineHeight: '1.5' }}>{option.split(':')[1]}</p>
              </div>
            ))}
          </div>
        </div>
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
