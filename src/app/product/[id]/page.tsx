'use client';

import { use, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle2, Zap, Sparkles, Mic, Volume2, 
  HardDrive, LayoutGrid, Users, Code2, Megaphone, Headphones, Bot, Building2,
  Play, Pause, Square, Loader2
} from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';

const PRODUCT_DATA: Record<string, any> = {
  work: {
    title: 'Work Management',
    subtitle: 'Manage everything your team works on in one place.',
    color: '#0073ea',
    icon: LayoutGrid,
    features: [
      'Visual project tracking with Gantt & Timeline',
      'Automated status updates and reminders',
      'Custom workflows for any team size',
      'Resource management and workload balancing'
    ]
  },
  erp: {
    title: 'ChancellorOS ERP',
    subtitle: 'Unified resource planning and financials.',
    color: '#00c875',
    icon: Building2,
    features: [
      'Financial planning and expense tracking',
      'Inventory and supply chain management',
      'Human capital and payroll integrations',
      'Real-time automated compliance reporting'
    ]
  },
  crm: {
    title: 'Sales CRM',
    subtitle: 'Track and manage your entire sales pipeline.',
    color: '#ffcb00',
    icon: Users,
    features: [
      'Contact & Account management',
      'Lead scoring and pipeline visualization',
      'Email tracking and sequence automation',
      'Sales forecasting and analytics'
    ]
  },
  dev: {
    title: 'Dev & R&D',
    subtitle: 'Build faster with agile project management.',
    color: '#ff3d57',
    icon: Code2,
    features: [
      'Sprint planning and backlog grooming',
      'Bug tracking and release management',
      'Git integration (GitHub, GitLab)',
      'Agile reporting (Burndown, Velocity)'
    ]
  },
  marketing: {
    title: 'Marketing',
    subtitle: 'Plan and execute high-impact campaigns.',
    color: '#a25ddc',
    icon: Megaphone,
    features: [
      'Content calendar and social planning',
      'Campaign performance tracking',
      'Creative request management',
      'Brand asset library'
    ]
  },
  support: {
    title: 'Support',
    subtitle: 'Deliver world-class customer service.',
    color: '#579bfc',
    icon: Headphones,
    features: [
      'Ticket management and SLA tracking',
      'Knowledge base and self-service',
      'AI-powered ticket triage',
      'Customer satisfaction reporting'
    ]
  },
  ai: {
    title: 'Chancellor AI',
    subtitle: 'The neural engine powering your Work OS.',
    color: '#6161FF',
    icon: Bot,
    features: [
      'Predictive task duration and risk analysis',
      'Automated data extraction and entry',
      'Natural language board querying',
      'Autonomous workflow optimization'
    ]
  }
};

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
            Experience the next generation of productivity with Chancellor&apos;s Multimodal Work OS. 
            Automate the mundane and focus on what truly matters.
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

      {/* Product Features List */}
      <section style={{ padding: '100px 10%' }}>
        <div style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#323338', marginBottom: '32px' }}>
              Powering {product.title} <br /> for modern teams
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {product.features.map((feature: string) => (
                <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '18px', color: '#323338' }}>
                  <CheckCircle2 size={24} color={product.color} />
                  {feature}
                </div>
              ))}
            </div>
            <Link href="/" className="btn-monday-primary" style={{ marginTop: '48px', display: 'inline-flex' }}>Try {product.title} Free</Link>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ width: '100%', height: '400px', background: `${product.color}10`, borderRadius: '32px', border: `1px dashed ${product.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <product.icon size={120} color={product.color} style={{ opacity: 0.2 }} />
               <div style={{ position: 'absolute', top: '40px', left: '40px', background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Sparkles size={20} color="#6161FF" />
                 <span style={{ fontWeight: 600 }}>AI Optimized Workflow</span>
               </div>
            </div>
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
