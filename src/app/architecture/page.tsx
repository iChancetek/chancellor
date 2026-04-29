'use client';

import { 
  Server, Zap, Share2, Database, Network, Search, 
  ShieldCheck, Layers, ArrowRight, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/layout/PublicNavbar';
import VideoBackground from '@/components/layout/VideoBackground';

export default function ArchitecturePage() {
  const specs = [
    {
      icon: Server,
      title: 'Microservices Architecture',
      desc: 'Decoupled, high-performance services designed for modularity and fault tolerance. Each module (ERP, CRM, AI) operates as an independent service with its own resource allocation.',
      color: '#0073ea'
    },
    {
      icon: Zap,
      title: 'Event-Driven Architecture',
      desc: 'Real-time event streams power the platform\'s reactivity. Changes in data trigger immediate, cascading updates across the entire ecosystem via a high-throughput messaging backbone.',
      color: '#ffcb00'
    },
    {
      icon: Network,
      title: 'Multi-Agent Runtime',
      desc: 'An orchestration layer for autonomous AI agents. Our proprietary runtime enables agents to collaborate, share context, and perform multi-step business logic without human intervention.',
      color: '#6161FF'
    },
    {
      icon: Database,
      title: 'Neural Vector Memory',
      desc: 'Long-term organizational memory stored in high-dimensional vector spaces. Enables RAG (Retrieval-Augmented Generation) with semantic accuracy and millisecond latency.',
      color: '#00c875'
    },
    {
      icon: Share2,
      title: 'Enterprise Knowledge Graph',
      desc: 'A mapping of complex organizational relationships. It connects siloed data points into a semantic network, providing the AI with deep contextual awareness of your business.',
      color: '#a25ddc'
    },
    {
      icon: Search,
      title: 'Advanced RAG Engine',
      desc: 'Retrieval-Augmented Generation at scale. We dynamically inject real-time enterprise data into LLM prompts to ensure every AI response is grounded in current organizational truth.',
      color: '#579bfc'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Data Layers',
      desc: 'Military-grade data protection. Multi-layered encryption, granular RBAC (Role-Based Access Control), and air-gapped deployment options for highly sensitive enterprise environments.',
      color: '#ff3d57'
    },
    {
      icon: Layers,
      title: 'Multi-Tenant Infrastructure',
      desc: 'High-density, secure isolation for enterprise organizations. Scalable compute clusters ensure that your data remains strictly isolated while benefiting from global platform updates.',
    },
    {
      icon: Zap,
      title: 'Horizontal Scalability',
      desc: 'Elastic resource orchestration that grows with your organization. Our cloud-native infrastructure automatically provisions capacity based on real-time operational demand.',
      color: '#6161FF'
    }
  ];

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', overflowX: 'hidden' }}>
      <VideoBackground src="/Chancellor_CRM_ERP2.mp4" overlayOpacity={0.8} />
      <PublicNavbar />
      
      {/* Hero */}
      <section style={{ padding: '120px 5% 80px', textAlign: 'center', background: 'transparent' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 className="heading-hero" style={{ marginBottom: '24px' }}>
            Enterprise <span className="gradient-text">Architecture</span>
          </h1>
          <p className="text-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
            The technical foundation of the ChancellorOS Neural Work OS. 
            Built for scale, security, and autonomous intelligence.
          </p>
        </div>
      </section>

      {/* Grid of Specs */}
      <section style={{ padding: '80px 5%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          {specs.map((spec, i) => (
            <div key={i} className="modern-grid-card" style={{ padding: '40px', background: '#fff', borderRadius: '24px', border: '1px solid #eee', transition: 'all 0.3s' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${spec.color}15` || '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: spec.color || '#323338', marginBottom: '24px' }}>
                <spec.icon size={28} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: '#323338' }}>{spec.title}</h3>
              <p style={{ color: '#676879', lineHeight: '1.7', fontSize: '16px' }}>{spec.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Summary */}
      <section style={{ padding: '100px 10%', background: '#0f111a', color: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '24px' }}>Built for the Next Decade</h2>
            <p style={{ fontSize: '18px', color: '#9699a6', lineHeight: '1.6' }}>
              ChancellorOS is not a legacy platform retrofitted with AI. It is a ground-up reimagining of enterprise software, 
              utilizing a neural-first architecture where data, logic, and agents are fundamentally interconnected.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#6161FF' }}>Reliability</h4>
              <p style={{ fontSize: '14px', color: '#9699a6', lineHeight: '1.6' }}>
                Our microservices approach ensures that if one service fails, the platform remains operational. 
                Coupled with multi-region failover and horizontal scaling, we guarantee 99.99% uptime for global operations.
              </p>
            </div>
            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#00c875' }}>Intelligence</h4>
              <p style={{ fontSize: '14px', color: '#9699a6', lineHeight: '1.6' }}>
                The multi-agent runtime and vector memory allow for truly autonomous behavior. 
                The platform doesn't just store data; it understands and acts upon it through semantic reasoning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 5%', textAlign: 'center' }}>
        <h2 className="heading-section" style={{ marginBottom: '40px' }}>Scale your enterprise with ChancellorOS</h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/login" className="btn-monday-primary" style={{ padding: '18px 40px', fontSize: '18px' }}>Get Started Now</Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6161FF', fontWeight: 700, textDecoration: 'none' }}>
            Talk to an expert <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
