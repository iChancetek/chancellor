import { 
  LayoutGrid, Users, Code2, Megaphone, Headphones, 
  Bot, Building2, FileText, ClipboardList, Palette, 
  Rocket, GraduationCap, Home, Landmark, HardHat, 
  HeartHandshake, Sparkles, Plus, Search, Zap, Settings
} from 'lucide-react';
import type { BoardType } from './types';

export const TEMPLATE_CATEGORIES = [
  { id: 'feedback', label: 'Feedback', icon: HeartHandshake },
  { id: 'work-management', label: 'Work Management', icon: LayoutGrid },
  { id: 'all', label: 'All templates', icon: ClipboardList },
  { id: 'recommended', label: 'Recommended for you', icon: Sparkles },
  { id: 'isynera', label: 'Created by iSynera', icon: Building2 },
  { id: 'me', label: 'Created by me', icon: Users },
  { id: 'general', label: 'General templates', icon: FileText },
  { id: 'vibe', label: 'Customizable Vibe apps', icon: Zap },
  { id: 'new', label: 'New', icon: Rocket },
  { id: 'ai', label: 'AI-powered', icon: Bot },
  { id: 'scratch', label: 'Start from scratch', icon: Plus },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'production', label: 'Content Production', icon: Palette },
  { id: 'project', label: 'Project Management', icon: ClipboardList },
  { id: 'docs', label: 'Docs', icon: FileText },
  { id: 'forms', label: 'Forms', icon: ClipboardList },
  { id: 'sales', label: 'Sales & CRM', icon: Users },
  { id: 'freelance', label: 'Freelancers', icon: Users },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'software', label: 'Software Development', icon: Code2 },
  { id: 'product', label: 'Product Management', icon: ClipboardList },
  { id: 'hr', label: 'HR', icon: Users },
  { id: 'manufacturing', label: 'Manufacturing', icon: HardHat },
  { id: 'operations', label: 'Operations', icon: Settings },
  { id: 'startup', label: 'Startup', icon: Rocket },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'real-estate', label: 'Real Estate', icon: Home },
  { id: 'vc', label: 'Venture Capital', icon: Landmark },
  { id: 'construction', label: 'Construction', icon: HardHat },
  { id: 'nonprofit', label: 'Nonprofits', icon: HeartHandshake },
  { id: 'experts', label: 'From our experts', icon: Users },
];

export interface Template {
  id: string;
  name: string;
  description: string;
  creator: string;
  category: string;
  image?: string;
  isAI?: boolean;
  type: BoardType;
}

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Single Project Management',
    description: 'Track your tasks, schedule, and team progress in one visual board.',
    creator: 'iSynera',
    category: 'project',
    isAI: true,
    image: '/templates/t1.png',
    type: 'work'
  },
  {
    id: 't2',
    name: 'Sales Pipeline',
    description: 'Manage your leads and deals from initial contact to close.',
    creator: 'iSynera',
    category: 'sales',
    image: '/templates/t2.png',
    type: 'crm'
  },
  {
    id: 't3',
    name: 'Sprint Planning',
    description: 'Agile development planning with backlog and sprint tracking.',
    creator: 'iSynera',
    category: 'software',
    isAI: true,
    image: '/templates/t3.png',
    type: 'dev'
  },
  {
    id: 't4',
    name: 'Content Calendar',
    description: 'Plan and schedule your social media and blog content.',
    creator: 'iSynera',
    category: 'marketing',
    type: 'marketing'
  },
  {
    id: 't5',
    name: 'CRM Enterprise',
    description: 'Advanced customer relationship management for large teams.',
    creator: 'iSynera',
    category: 'sales',
    type: 'crm'
  },
  {
    id: 't6',
    name: 'Creative Agency Workflow',
    description: 'End-to-end management for design and creative projects.',
    creator: 'iSynera',
    category: 'design',
    type: 'work'
  },
  {
    id: 't7',
    name: 'HR Onboarding',
    description: 'A comprehensive checklist and workflow for new employee onboarding.',
    creator: 'iSynera',
    category: 'hr',
    type: 'work'
  },
  {
    id: 't8',
    name: 'Real Estate Listings',
    description: 'Track properties, clients, and closing statuses in one place.',
    creator: 'iSynera',
    category: 'real-estate',
    type: 'crm'
  },
  {
    id: 't9',
    name: 'Education Lesson Planner',
    description: 'Organize lessons, resources, and student progress for teachers.',
    creator: 'iSynera',
    category: 'education',
    type: 'work'
  },
  {
    id: 't10',
    name: 'Nonprofit Volunteer Tracker',
    description: 'Manage volunteer sign-ups, schedules, and impact reporting.',
    creator: 'iSynera',
    category: 'nonprofit',
    type: 'work'
  },
  {
    id: 't11',
    name: 'Construction Project Tracker',
    description: 'Monitor site progress, materials, and contractor schedules.',
    creator: 'iSynera',
    category: 'construction',
    type: 'work'
  },
  {
    id: 't12',
    name: 'Venture Capital Pipeline',
    description: 'Track startups, due diligence, and investment rounds.',
    creator: 'iSynera',
    category: 'vc',
    type: 'crm'
  }
];
