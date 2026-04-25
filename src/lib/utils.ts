import { v4 as uuidv4 } from 'uuid';
import type { Board, Group, Item, Column, Workspace, StatusLabel, DEFAULT_STATUS_LABELS, DEFAULT_PRIORITY_LABELS, BoardType } from './types';

export function generateId(): string {
  return uuidv4();
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(timestamp);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function createDefaultBoard(workspaceId: string, name: string, type: BoardType = 'work'): Board {
  const boardId = generateId();
  const defaultColumns = getDefaultColumnsForType(type, name);
  const defaultGroups = getDefaultGroupsForType(type, name, boardId);

  return {
    id: boardId,
    workspaceId,
    name,
    description: '',
    type,
    icon: getIconForType(type),
    color: '#579BFC',
    columns: defaultColumns,
    groups: defaultGroups,
    views: ['table', 'kanban'],
    activeView: 'table',
    settings: {
      defaultGroupColor: '#579BFC',
      showSubitems: true,
      allowDuplicates: true,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function getIconForType(type: string): string {
  const icons: Record<string, string> = {
    work: '📋',
    crm: '🤝',
    dev: '💻',
    support: '🎧',
    marketing: '📣',
    erp: '🏢',
  };
  return icons[type] || '📋';
}

function getDefaultColumnsForType(type: string, name: string): Column[] {
  const lowerName = name.toLowerCase();
  
  // -- CRM TEMPLATES --
  if (type === 'crm') {
    if (lowerName.includes('contact')) {
      return [
        { id: 'status', type: 'status', title: 'Status', width: 140, position: 0, settings: { labels: [{id:'active',text:'Active',color:'#00C875'},{id:'inactive',text:'Inactive',color:'#e2445c'}] } },
        { id: 'person', type: 'person', title: 'Account Manager', width: 120, position: 1, settings: {} },
        { id: 'email', type: 'text', title: 'Email', width: 180, position: 2, settings: {} },
        { id: 'phone', type: 'text', title: 'Phone', width: 140, position: 3, settings: {} },
        { id: 'company', type: 'text', title: 'Company', width: 140, position: 4, settings: {} },
        { id: 'date', type: 'date', title: 'Last Contacted', width: 130, position: 5, settings: {} },
      ];
    }
    if (lowerName.includes('campaign') || lowerName.includes('outreach')) {
      return [
        { id: 'status', type: 'status', title: 'Campaign Status', width: 140, position: 0, settings: { labels: [{id:'draft',text:'Draft',color:'#c4c4c4'},{id:'sent',text:'Sent',color:'#579BFC'},{id:'responded',text:'Responded',color:'#00C875'}] } },
        { id: 'person', type: 'person', title: 'Owner', width: 120, position: 1, settings: {} },
        { id: 'audience', type: 'number', title: 'Audience Size', width: 130, position: 2, settings: { format: 'number' } },
        { id: 'date', type: 'date', title: 'Send Date', width: 130, position: 3, settings: {} },
      ];
    }
    // Default Sales Pipeline / Deal Tracker
    return [
      { id: 'status', type: 'status', title: 'Stage', width: 140, position: 0, settings: { labels: [{id:'lead',text:'Lead',color:'#579BFC'},{id:'qualified',text:'Qualified',color:'#A25DDC'},{id:'proposal',text:'Proposal',color:'#FDAB3D'},{id:'won',text:'Won',color:'#00C875'},{id:'lost',text:'Lost',color:'#E2445C'}] } },
      { id: 'person', type: 'person', title: 'Sales Rep', width: 120, position: 1, settings: {} },
      { id: 'dealvalue', type: 'number', title: 'Deal Value', width: 130, position: 2, settings: { format: 'currency', unit: '$' } },
      { id: 'contact', type: 'text', title: 'Contact Name', width: 140, position: 3, settings: {} },
      { id: 'date', type: 'date', title: 'Expected Close', width: 130, position: 4, settings: {} },
    ];
  }

  // -- ERP TEMPLATES --
  if (type === 'erp') {
    if (lowerName.includes('ledger') || lowerName.includes('finance') || lowerName.includes('cash') || lowerName.includes('forecast')) {
      return [
        { id: 'status', type: 'status', title: 'Recon Status', width: 140, position: 0, settings: { labels: [{id:'reconciled',text:'Reconciled',color:'#00C875'},{id:'pending',text:'Pending',color:'#FDAB3D'},{id:'discrepancy',text:'Discrepancy',color:'#E2445C'}] } },
        { id: 'account', type: 'text', title: 'Account Code', width: 140, position: 1, settings: {} },
        { id: 'amount', type: 'number', title: 'Amount', width: 140, position: 2, settings: { format: 'currency', unit: '$' } },
        { id: 'type', type: 'status', title: 'Type', width: 130, position: 3, settings: { labels: [{id:'debit',text:'Debit',color:'#579BFC'},{id:'credit',text:'Credit',color:'#A25DDC'}] } },
        { id: 'date', type: 'date', title: 'Transaction Date', width: 130, position: 4, settings: {} },
        { id: 'person', type: 'person', title: 'Approved By', width: 120, position: 5, settings: {} },
      ];
    }
    if (lowerName.includes('inventory') || lowerName.includes('warehouse') || lowerName.includes('supply') || lowerName.includes('production')) {
      return [
        { id: 'status', type: 'status', title: 'Stock Status', width: 140, position: 0, settings: { labels: [{id:'instock',text:'In Stock',color:'#00C875'},{id:'low',text:'Low Stock',color:'#FDAB3D'},{id:'out',text:'Out of Stock',color:'#E2445C'}] } },
        { id: 'sku', type: 'text', title: 'SKU', width: 140, position: 1, settings: {} },
        { id: 'quantity', type: 'number', title: 'Quantity', width: 120, position: 2, settings: { format: 'number' } },
        { id: 'location', type: 'text', title: 'Location / Bin', width: 140, position: 3, settings: {} },
        { id: 'supplier', type: 'text', title: 'Supplier', width: 150, position: 4, settings: {} },
        { id: 'date', type: 'date', title: 'Last Restock', width: 130, position: 5, settings: {} },
      ];
    }
    if (lowerName.includes('employee') || lowerName.includes('hr') || lowerName.includes('compensation') || lowerName.includes('skill')) {
      return [
        { id: 'status', type: 'status', title: 'Status', width: 140, position: 0, settings: { labels: [{id:'active',text:'Active',color:'#00C875'},{id:'onboarding',text:'Onboarding',color:'#FDAB3D'},{id:'leave',text:'On Leave',color:'#A25DDC'}] } },
        { id: 'person', type: 'person', title: 'Employee', width: 140, position: 1, settings: {} },
        { id: 'role', type: 'text', title: 'Role/Title', width: 160, position: 2, settings: {} },
        { id: 'department', type: 'text', title: 'Department', width: 140, position: 3, settings: {} },
        { id: 'salary', type: 'number', title: 'Compensation', width: 140, position: 4, settings: { format: 'currency', unit: '$' } },
        { id: 'date', type: 'date', title: 'Start Date', width: 130, position: 5, settings: {} },
      ];
    }
    // Default ERP Template
    return [
      { id: 'status', type: 'status', title: 'Status', width: 140, position: 0, settings: { labels: [{id:'active',text:'Active',color:'#00C875'},{id:'pending',text:'Pending',color:'#FDAB3D'},{id:'blocked',text:'Blocked',color:'#E2445C'}] } },
      { id: 'person', type: 'person', title: 'Owner', width: 120, position: 1, settings: {} },
      { id: 'department', type: 'text', title: 'Department', width: 140, position: 2, settings: {} },
      { id: 'budget', type: 'number', title: 'Budget', width: 140, position: 3, settings: { format: 'currency', unit: '$' } },
      { id: 'date', type: 'date', title: 'Deadline', width: 130, position: 4, settings: {} },
    ];
  }

  // -- DEV TEMPLATES --
  if (type === 'dev') {
    if (lowerName.includes('bug')) {
      return [
        { id: 'status', type: 'status', title: 'Status', width: 140, position: 0, settings: { labels: [{id:'new',text:'New',color:'#579BFC'},{id:'investigating',text:'Investigating',color:'#FDAB3D'},{id:'fixed',text:'Fixed',color:'#00C875'},{id:'wontfix',text:'Wont Fix',color:'#333333'}] } },
        { id: 'person', type: 'person', title: 'Assignee', width: 120, position: 1, settings: {} },
        { id: 'severity', type: 'priority', title: 'Severity', width: 130, position: 2, settings: { labels: [{id:'critical',text:'Critical ⚡',color:'#333333'},{id:'high',text:'High',color:'#E2445C'},{id:'medium',text:'Medium',color:'#FDAB3D'},{id:'low',text:'Low',color:'#579BFC'}] } },
        { id: 'environment', type: 'status', title: 'Environment', width: 130, position: 3, settings: { labels: [{id:'prod',text:'Production',color:'#E2445C'},{id:'staging',text:'Staging',color:'#FDAB3D'},{id:'dev',text:'Development',color:'#00C875'}] } },
        { id: 'date', type: 'date', title: 'Reported Date', width: 130, position: 4, settings: {} },
      ];
    }
    if (lowerName.includes('release')) {
      return [
        { id: 'status', type: 'status', title: 'Release Status', width: 140, position: 0, settings: { labels: [{id:'building',text:'Building',color:'#FDAB3D'},{id:'testing',text:'Testing',color:'#A25DDC'},{id:'deployed',text:'Deployed',color:'#00C875'},{id:'failed',text:'Failed',color:'#E2445C'}] } },
        { id: 'person', type: 'person', title: 'Release Manager', width: 140, position: 1, settings: {} },
        { id: 'version', type: 'text', title: 'Version', width: 120, position: 2, settings: {} },
        { id: 'date', type: 'date', title: 'Deploy Date', width: 130, position: 3, settings: {} },
        { id: 'url', type: 'text', title: 'Deploy URL', width: 180, position: 4, settings: {} },
      ];
    }
    // Default Sprint / Feature Board
    return [
      { id: 'status', type: 'status', title: 'Status', width: 140, position: 0, settings: { labels: [{id:'todo',text:'To Do',color:'#c4c4c4'},{id:'doing',text:'Doing',color:'#FDAB3D'},{id:'review',text:'Code Review',color:'#A25DDC'},{id:'done',text:'Done',color:'#00C875'}] } },
      { id: 'person', type: 'person', title: 'Developer', width: 120, position: 1, settings: {} },
      { id: 'storypoints', type: 'number', title: 'Story Points', width: 120, position: 2, settings: { format: 'number' } },
      { id: 'priority', type: 'priority', title: 'Priority', width: 120, position: 3, settings: { labels: [{id:'high',text:'High',color:'#E2445C'},{id:'medium',text:'Medium',color:'#FDAB3D'},{id:'low',text:'Low',color:'#579BFC'}] } },
      { id: 'date', type: 'date', title: 'Sprint End', width: 130, position: 4, settings: {} },
    ];
  }

  // -- SUPPORT TEMPLATES --
  if (type === 'support') {
    if (lowerName.includes('escalation')) {
      return [
        { id: 'status', type: 'status', title: 'Status', width: 140, position: 0, settings: { labels: [{id:'open',text:'Open',color:'#E2445C'},{id:'investigating',text:'Investigating',color:'#FDAB3D'},{id:'resolved',text:'Resolved',color:'#00C875'}] } },
        { id: 'person', type: 'person', title: 'Assigned Engineer', width: 150, position: 1, settings: {} },
        { id: 'level', type: 'status', title: 'Escalation Level', width: 140, position: 2, settings: { labels: [{id:'l1',text:'Tier 1',color:'#579BFC'},{id:'l2',text:'Tier 2',color:'#FDAB3D'},{id:'l3',text:'Tier 3',color:'#E2445C'}] } },
        { id: 'rootcause', type: 'text', title: 'Root Cause', width: 200, position: 3, settings: {} },
      ];
    }
    // Default Ticket Queue
    return [
      { id: 'status', type: 'status', title: 'Ticket Status', width: 140, position: 0, settings: { labels: [{id:'new',text:'New',color:'#579BFC'},{id:'open',text:'Open',color:'#FDAB3D'},{id:'pending',text:'Pending Customer',color:'#A25DDC'},{id:'resolved',text:'Resolved',color:'#00C875'}] } },
      { id: 'person', type: 'person', title: 'Agent', width: 120, position: 1, settings: {} },
      { id: 'priority', type: 'priority', title: 'Priority', width: 120, position: 2, settings: { labels: [{id:'urgent',text:'Urgent ⚡',color:'#333333'},{id:'high',text:'High',color:'#E2445C'},{id:'normal',text:'Normal',color:'#579BFC'}] } },
      { id: 'customer', type: 'text', title: 'Customer', width: 150, position: 3, settings: {} },
      { id: 'slastatus', type: 'status', title: 'SLA Status', width: 130, position: 4, settings: { labels: [{id:'ok',text:'On Track',color:'#00C875'},{id:'risk',text:'At Risk',color:'#FDAB3D'},{id:'breached',text:'Breached',color:'#E2445C'}] } },
      { id: 'date', type: 'date', title: 'Created', width: 130, position: 5, settings: {} },
    ];
  }

  // -- MARKETING TEMPLATES --
  if (type === 'marketing') {
    if (lowerName.includes('content') || lowerName.includes('asset')) {
      return [
        { id: 'status', type: 'status', title: 'Status', width: 140, position: 0, settings: { labels: [{id:'ideation',text:'Ideation',color:'#c4c4c4'},{id:'drafting',text:'Drafting',color:'#579BFC'},{id:'review',text:'Review',color:'#FDAB3D'},{id:'published',text:'Published',color:'#00C875'}] } },
        { id: 'person', type: 'person', title: 'Creator', width: 120, position: 1, settings: {} },
        { id: 'channel', type: 'status', title: 'Channel', width: 130, position: 2, settings: { labels: [{id:'blog',text:'Blog',color:'#579BFC'},{id:'social',text:'Social',color:'#A25DDC'},{id:'email',text:'Email',color:'#FDAB3D'}] } },
        { id: 'date', type: 'date', title: 'Publish Date', width: 130, position: 3, settings: {} },
        { id: 'link', type: 'text', title: 'Asset Link', width: 180, position: 4, settings: {} },
      ];
    }
    // Default Campaign
    return [
      { id: 'status', type: 'status', title: 'Campaign Status', width: 140, position: 0, settings: { labels: [{id:'planning',text:'Planning',color:'#c4c4c4'},{id:'active',text:'Active',color:'#00C875'},{id:'paused',text:'Paused',color:'#FDAB3D'},{id:'completed',text:'Completed',color:'#333333'}] } },
      { id: 'person', type: 'person', title: 'Manager', width: 120, position: 1, settings: {} },
      { id: 'platform', type: 'status', title: 'Platform', width: 130, position: 2, settings: { labels: [{id:'google',text:'Google Ads',color:'#579BFC'},{id:'meta',text:'Meta',color:'#A25DDC'},{id:'linkedin',text:'LinkedIn',color:'#0086C0'}] } },
      { id: 'budget', type: 'number', title: 'Budget', width: 120, position: 3, settings: { format: 'currency', unit: '$' } },
      { id: 'spend', type: 'number', title: 'Spend', width: 120, position: 4, settings: { format: 'currency', unit: '$' } },
      { id: 'roas', type: 'number', title: 'ROAS', width: 100, position: 5, settings: { format: 'number' } },
    ];
  }

  // -- DEFAULT WORK TEMPLATE --
  return [
    { id: 'status', type: 'status', title: 'Status', width: 140, position: 0, settings: { labels: [{id:'working',text:'Working on it',color:'#FDAB3D'},{id:'done',text:'Done',color:'#00C875'},{id:'stuck',text:'Stuck',color:'#E2445C'}] } },
    { id: 'person', type: 'person', title: 'Owner', width: 120, position: 1, settings: {} },
    { id: 'date', type: 'date', title: 'Due Date', width: 130, position: 2, settings: {} },
    { id: 'priority', type: 'priority', title: 'Priority', width: 130, position: 3, settings: { labels: [{id:'critical',text:'Critical ⚡',color:'#333333'},{id:'high',text:'High',color:'#E2445C'},{id:'medium',text:'Medium',color:'#FDAB3D'},{id:'low',text:'Low',color:'#579BFC'}] } },
    { id: 'text', type: 'text', title: 'Notes', width: 200, position: 4, settings: {} },
  ];
}

function getDefaultGroupsForType(type: string, name: string, boardId: string): Group[] {
  const lowerName = name.toLowerCase();
  let groupTitles = ['To Do', 'In Progress', 'Completed'];

  if (type === 'crm') {
    if (lowerName.includes('contact')) groupTitles = ['Active Clients', 'Past Clients', 'Cold Leads'];
    else if (lowerName.includes('campaign')) groupTitles = ['Q1 Campaigns', 'Q2 Campaigns', 'Archived'];
    else groupTitles = ['New Leads', 'Qualified', 'Proposal Sent', 'Closed Won'];
  } else if (type === 'erp') {
    if (lowerName.includes('ledger') || lowerName.includes('finance') || lowerName.includes('cash') || lowerName.includes('forecast')) groupTitles = ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'];
    else if (lowerName.includes('inventory') || lowerName.includes('warehouse') || lowerName.includes('supply') || lowerName.includes('production')) groupTitles = ['Raw Materials', 'Work In Progress', 'Finished Goods'];
    else if (lowerName.includes('employee') || lowerName.includes('hr') || lowerName.includes('compensation') || lowerName.includes('skill')) groupTitles = ['Full-Time', 'Part-Time', 'Contractors'];
    else groupTitles = ['Planning', 'Execution', 'Review'];
  } else if (type === 'dev') {
    if (lowerName.includes('bug')) groupTitles = ['Critical Bugs', 'High Priority', 'Backlog'];
    else if (lowerName.includes('release')) groupTitles = ['Upcoming Release', 'In QA', 'Deployed'];
    else groupTitles = ['Current Sprint', 'Next Sprint', 'Backlog'];
  } else if (type === 'support') {
    if (lowerName.includes('escalation')) groupTitles = ['Immediate Attention', 'Under Investigation', 'Resolved'];
    else groupTitles = ['New Tickets', 'In Progress', 'Waiting on Customer', 'Resolved'];
  } else if (type === 'marketing') {
    if (lowerName.includes('content') || lowerName.includes('asset')) groupTitles = ['This Week', 'Next Week', 'Later'];
    else groupTitles = ['Active Campaigns', 'Planning', 'Completed'];
  }

  const colors = ['#579BFC', '#00C875', '#FDAB3D', '#E2445C', '#A25DDC'];
  return groupTitles.map((title, i) => ({
    id: generateId(),
    boardId,
    title,
    color: colors[i % colors.length],
    position: i,
    collapsed: false,
  }));
}

export function createDefaultWorkspace(ownerId: string, ownerEmail: string, ownerName: string): Workspace {
  return {
    id: generateId(),
    name: 'My Workspace',
    description: 'Your main workspace',
    icon: '🏠',
    color: '#6C5CE7',
    ownerId,
    members: [
      {
        uid: ownerId,
        email: ownerEmail,
        displayName: ownerName,
        photoURL: null,
        role: 'owner',
        joinedAt: Date.now(),
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
