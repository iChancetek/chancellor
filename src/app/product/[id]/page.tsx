import Link from 'next/link';
import { ArrowRight, CheckCircle2, LayoutGrid, Users, Code2, Megaphone, Headphones, Bot } from 'lucide-react';
import { notFound } from 'next/navigation';
import PublicNavbar from '@/components/layout/PublicNavbar';

const productData: Record<string, any> = {
  work: {
    title: "Work Management",
    color: "#0073ea",
    icon: LayoutGrid,
    subtitle: "The AI cloud-based platform designed to plan, track, and scale any project.",
    features: [
      { title: "Customizable Boards & Gantt", desc: "Replace static spreadsheets with dynamic boards. Toggle between Kanban, Gantt charts, and Timelines to suit any project methodology." },
      { title: "AI Workflow Automations", desc: "Reduce manual overhead with smart status triggers, automated task assignments, and real-time dependency updates." },
      { title: "Dashboards & Portfolio Reporting", desc: "Monitor budgets, team capacity, and overall project health across multiple boards with PMO-level dashboard visualization." },
      { title: "Contextual Collaboration", desc: "Centralize your files and communication with in-context @mentions, threaded comments, and integrated file sharing." },
      { title: "Enterprise Integrations", desc: "Seamlessly connect with Google Drive, Microsoft Teams, and Salesforce to unify your workspace data." },
      { title: "Initiation to Completion", desc: "From high-level product launches to marketing campaigns, manage the entire lifecycle with pre-built professional templates." }
    ],
    heroImg: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&w=1200&q=80"
  },
  crm: {
    title: "Chancellor CRM",
    color: "#ffcb00",
    icon: Users,
    subtitle: "The all-in-one sales CRM to manage every stage of your customer journey.",
    features: [
      { title: "AI Lead Agent & Round-Robin", desc: "Automatically capture, score, and route leads to the right reps using intelligent round-robin assignment." },
      { title: "360-degree Communication Sync", desc: "Sync natively with Gmail and Outlook. Track email opens, log calls, and view a complete engagement timeline automatically." },
      { title: "AI Sales Agent & Notetaker", desc: "Let AI analyze your customer communications to suggest next steps and summarize meetings into actionable items." },
      { title: "Visual Pipeline & Sales Gauge", desc: "Track deals through customizable visual stages and monitor performance against targets with the Sales Gauge widget." },
      { title: "Sales Forecasting & Analytics", desc: "Real-time dashboards providing actual vs. projected revenue, team performance metrics, and deep-dive reports." },
      { title: "Quotes & Invoices to Workflows", desc: "Generate professional quotes and invoices directly from a deal and trigger automated follow-ups until payment." }
    ],
    heroImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  },
  dev: {
    title: "Dev & R&D",
    color: "#ff3d57",
    icon: Code2,
    subtitle: "Connect R&D and product workflows for faster shipping.",
    features: [
      { title: "Sprint Planning", desc: "Manage agile sprints, story points, and backlog items effortlessly." },
      { title: "Git Integration", desc: "Native connections to GitHub and GitLab map commits directly to tasks." },
      { title: "Bug Tracking", desc: "Easily ingest and triage bugs from external forms or API sources." }
    ],
    heroImg: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
  },
  marketing: {
    title: "Marketing",
    color: "#a25ddc",
    icon: Megaphone,
    subtitle: "Manage high-impact marketing campaigns from start to finish.",
    features: [
      { title: "Campaign Planning", desc: "Coordinate diverse channels and track marketing spend ROI natively." },
      { title: "Asset Management", desc: "Review, annotate, and approve creative assets with your team." },
      { title: "Content Calendar", desc: "Visualize publication schedules and social media drops." }
    ],
    heroImg: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80"
  },
  support: {
    title: "Support Desk",
    color: "#579bfc",
    icon: Headphones,
    subtitle: "Streamline customer queries into a unified ticketing system.",
    features: [
      { title: "SLA Tracking", desc: "Ensure no ticket is left behind with automated SLA countdown timers." },
      { title: "Omnichannel Inbox", desc: "Consolidate email, live chat, and form submissions instantly." },
      { title: "Canned Responses", desc: "Respond faster using AI-suggested macros and support templates." }
    ],
    heroImg: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80"
  },
  ai: {
    title: "Chancellor AI",
    color: "#6161FF",
    icon: Bot,
    subtitle: "An intelligent autonomous agent built into every layer of your workspace.",
    features: [
      { title: "Automated Context", desc: "Chat natively with your boards and ask complex analytical questions." },
      { title: "Generative Drafting", desc: "Let the AI write project briefs, support responses, and sprint tickets." },
      { title: "Data Structuring", desc: "Extract unstructured text from emails and turn them into CRM items automatically." }
    ],
    heroImg: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"
  }
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = productData[id];

  if (!product) {
    notFound();
  }

  const Icon = product.icon;

  return (
    <div className="landing-container" style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Navigation */}
      <PublicNavbar />

      {/* Product Hero */}
      <section style={{ padding: '100px 5% 60px', textAlign: 'center', background: '#f5f6f8' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: product.color, color: '#fff', padding: '12px 24px', borderRadius: '999px', marginBottom: '32px' }}>
          <Icon size={24} />
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{product.title}</span>
        </div>
        <h1 className="heading-hero" style={{ fontSize: '64px', marginBottom: '24px' }}>
          {product.subtitle}
        </h1>
        <p className="text-subtitle" style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '48px' }}>
          Built deeply into the Chancellor Work OS, utilizing intelligent data tables and real-time collaboration. Transform how your team executes.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/" className="btn-monday-primary" style={{ padding: '16px 36px', fontSize: '18px', background: product.color }}>
            Get Started For Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Feature Showcase */}
      <section style={{ padding: '100px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="heading-section" style={{ textAlign: 'center', marginBottom: '60px' }}>
          Why choose <span style={{ color: product.color }}>{product.title}</span>?
        </h2>
        
        <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', marginBottom: '80px' }}>
          <img src={product.heroImg} alt={product.title} style={{ width: '100%', display: 'block', maxHeight: '500px', objectFit: 'cover' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
          {product.features.map((feat: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', gap: '20px', padding: '32px', borderRadius: '16px', background: '#f8f9fa', border: '1px solid #eee' }}>
              <CheckCircle2 color={product.color} size={28} style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>{feat.title}</h3>
                <p style={{ color: '#676879', fontSize: '16px', lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '100px 5%', textAlign: 'center', background: '#292d3e', color: '#fff' }}>
        <h2 className="heading-section" style={{ color: '#fff' }}>Ready to elevate your workflow?</h2>
        <p className="text-subtitle" style={{ marginTop: '20px', color: '#d0d4e4', marginBottom: '40px' }}>Join teams completely transforming their productivity.</p>
        <Link href="/" className="btn-monday-primary" style={{ display: 'inline-flex', padding: '16px 36px', fontSize: '18px', background: product.color }}>
          Start building now
        </Link>
      </section>
    </div>
  );
}
