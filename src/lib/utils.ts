import { v4 as uuidv4 } from 'uuid';
import type { Board, Group, Item, Column, Workspace, StatusLabel, DEFAULT_STATUS_LABELS, DEFAULT_PRIORITY_LABELS } from './types';

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

export function createDefaultBoard(workspaceId: string, name: string, type: 'work' | 'crm' | 'dev' | 'support' | 'marketing' = 'work'): Board {
  const boardId = generateId();
  const defaultColumns = getDefaultColumnsForType(type);
  const defaultGroups = getDefaultGroupsForType(type, boardId);

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
  };
  return icons[type] || '📋';
}

function getDefaultColumnsForType(type: string): Column[] {
  const baseColumns: Column[] = [
    {
      id: 'status',
      type: 'status',
      title: 'Status',
      width: 140,
      position: 0,
      settings: {
        labels: [
          { id: 'working', text: 'Working on it', color: '#FDAB3D' },
          { id: 'done', text: 'Done', color: '#00C875' },
          { id: 'stuck', text: 'Stuck', color: '#E2445C' },
          { id: 'pending', text: 'Pending', color: '#A25DDC' },
          { id: 'review', text: 'In Review', color: '#0086C0' },
        ],
      },
    },
    {
      id: 'person',
      type: 'person',
      title: 'Owner',
      width: 120,
      position: 1,
      settings: {},
    },
    {
      id: 'date',
      type: 'date',
      title: 'Due Date',
      width: 130,
      position: 2,
      settings: {},
    },
    {
      id: 'priority',
      type: 'priority',
      title: 'Priority',
      width: 130,
      position: 3,
      settings: {
        labels: [
          { id: 'critical', text: 'Critical ⚡', color: '#333333' },
          { id: 'high', text: 'High', color: '#E2445C' },
          { id: 'medium', text: 'Medium', color: '#FDAB3D' },
          { id: 'low', text: 'Low', color: '#579BFC' },
        ],
      },
    },
  ];

  if (type === 'dev') {
    baseColumns.push({
      id: 'storypoints',
      type: 'number',
      title: 'Story Points',
      width: 110,
      position: 4,
      settings: { format: 'number' },
    });
  }

  if (type === 'crm') {
    baseColumns.push({
      id: 'dealvalue',
      type: 'number',
      title: 'Deal Value',
      width: 120,
      position: 4,
      settings: { format: 'currency', unit: '$' },
    });
  }

  baseColumns.push({
    id: 'text',
    type: 'text',
    title: 'Notes',
    width: 200,
    position: baseColumns.length,
    settings: {},
  });

  return baseColumns;
}

function getDefaultGroupsForType(type: string, boardId: string): Group[] {
  const groupSets: Record<string, string[]> = {
    work: ['To Do', 'In Progress', 'Completed'],
    crm: ['New Leads', 'Qualified', 'Proposal Sent', 'Closed Won'],
    dev: ['Backlog', 'Sprint', 'In Development', 'QA', 'Done'],
    support: ['New Tickets', 'In Progress', 'Waiting on Customer', 'Resolved'],
    marketing: ['Planning', 'Active Campaigns', 'Completed', 'Archived'],
  };

  const colors = ['#579BFC', '#00C875', '#FDAB3D', '#E2445C', '#A25DDC'];
  const groups = groupSets[type] || groupSets['work'];

  return groups.map((title, i) => ({
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
