import { LayoutGrid, Users, Code2, Megaphone, Headphones, Bot, Building2 } from 'lucide-react';

export const PRODUCT_DATA: Record<string, any> = {
  work: {
    title: 'Work Management',
    subtitle: 'Manage everything your team works on in one place.',
    description: 'ChancellorOS Work Management is an all-in-one productivity suite designed to help teams plan, track, and execute complex projects with precision. Whether you are managing a small team or a global enterprise, our visual tools provide the transparency needed to hit every deadline.',
    color: '#0073ea',
    icon: LayoutGrid,
    features: [
      'Visual project tracking with interactive Gantt charts & Timelines',
      'Automated status updates and AI-driven reminders to keep momentum',
      'Highly customizable workflows tailored for any team size or industry',
      'Intelligent resource management and real-time workload balancing',
      'Interconnected boards that sync data across your entire organization',
      'Advanced reporting dashboards with customizable KPIs and metrics'
    ]
  },
  erp: {
    title: 'ChancellorOS ERP',
    subtitle: 'Unified resource planning and enterprise financials.',
    description: 'The ChancellorOS ERP module bridges the gap between operations and finance. By centralizing your resource planning, inventory, and payroll into a single neural network, you gain an unprecedented view of your organization’s health and efficiency.',
    color: '#00c875',
    icon: Building2,
    features: [
      'Comprehensive financial planning and real-time expense tracking',
      'Dynamic inventory and global supply chain management system',
      'Integrated Human Capital Management (HCM) with automated payroll',
      'Real-time automated compliance reporting and fiscal governance',
      'Predictive cash flow analysis using Chancellor AI neural engines',
      'Vendor management portal with automated procurement workflows'
    ]
  },
  crm: {
    title: 'ChancellorOS CRM',
    subtitle: 'Track and manage your entire sales pipeline with AI.',
    description: 'Transform your sales process with ChancellorOS CRM. Our platform doesn’t just store contacts; it uses AI to score leads, automate outreach, and provide your sales team with the insights they need to close deals faster and more effectively.',
    color: '#ffcb00',
    icon: Users,
    features: [
      '360-degree Contact & Account management with social integration',
      'AI-powered lead scoring and dynamic pipeline visualization',
      'Seamless email tracking and intelligent sequence automation',
      'Advanced sales forecasting with historical trend analysis',
      'Mobile-first CRM interface for sales teams on the move',
      'Integrated document management for contracts and proposals'
    ]
  },
  dev: {
    title: 'Dev & R&D',
    subtitle: 'Build faster with agile project management and Git.',
    description: 'Designed by developers for developers, the ChancellorOS Dev module integrates directly into your coding workflow. Track sprints, manage backlogs, and monitor deployments without ever losing context of the business goals.',
    color: '#ff3d57',
    icon: Code2,
    features: [
      'Comprehensive sprint planning and backlog grooming tools',
      'Automated bug tracking and multi-stage release management',
      'Deep Git integration with GitHub, GitLab, and Bitbucket',
      'Real-time agile reporting including Burndown and Velocity charts',
      'Code review orchestration and automated testing triggers',
      'Technical debt tracking and architectural roadmap visualization'
    ]
  },
  marketing: {
    title: 'Marketing',
    subtitle: 'Plan and execute high-impact campaigns across channels.',
    description: 'ChancellorOS Marketing empowers creative teams to deliver consistent, high-impact campaigns. From the first spark of an idea to the final performance analysis, every step of the creative process is managed in a collaborative, visual environment.',
    color: '#a25ddc',
    icon: Megaphone,
    features: [
      'Integrated content calendar and multi-channel social planning',
      'Real-time campaign performance tracking and ROI analysis',
      'Streamlined creative request management and approval workflows',
      'Centralized brand asset library with version control and tagging',
      'Collaborative whiteboards for brainstorming and campaign ideation',
      'Automated marketing reporting and stakeholder dashboards'
    ]
  },
  support: {
    title: 'Support',
    subtitle: 'Deliver world-class customer service with AI assistance.',
    description: 'Elevate your customer experience with ChancellorOS Support. Our AI-driven ticketing system ensures that no customer is left waiting, while our integrated knowledge base empowers both agents and customers to find solutions faster.',
    color: '#579bfc',
    icon: Headphones,
    features: [
      'Omnichannel ticket management and strict SLA tracking',
      'Intelligent knowledge base with integrated self-service portal',
      'AI-powered ticket triage and automated sentiment analysis',
      'Comprehensive customer satisfaction (CSAT) and NPS reporting',
      'Live agent dashboards with real-time workload monitoring',
      'Automated customer follow-ups and feedback collection'
    ]
  },
  ai: {
    title: 'Chancellor AI',
    subtitle: 'The neural engine powering your entire Work OS.',
    description: 'Chancellor AI is more than a chatbot; it is the core intelligence layer of your organization. It works silently in the background to optimize workflows, predict risks, and surface insights that would otherwise remain hidden in your data.',
    color: '#6161FF',
    icon: Bot,
    features: [
      'Predictive task duration modeling and proactive risk analysis',
      'Automated data extraction from documents and images (OCR)',
      'Natural language board querying for instant data insights',
      'Autonomous workflow optimization and bottleneck identification',
      'Multimodal interaction: See, Hear, and Speak to your data',
      'Enterprise-grade governance for AI-driven decision making'
    ]
  }
};
