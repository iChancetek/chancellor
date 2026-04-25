import { LayoutGrid, Users, Code2, Megaphone, Headphones, Bot, Building2 } from 'lucide-react';

export const PRODUCT_DATA: Record<string, any> = {
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
    title: 'ChancellorOS CRM',
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
