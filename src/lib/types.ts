/* ───────────────────────────────────────────────────────────
 *  Chancellor — Core Type Definitions
 *  The structural backbone for the entire platform.
 * ─────────────────────────────────────────────────────────── */

// ── Auth & Users ──────────────────────────────────────────

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: number;
  updatedAt: number;
}

// ── Workspace ─────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: number;
  updatedAt: number;
}

export interface WorkspaceMember {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: number;
}

// ── Board ─────────────────────────────────────────────────

export type BoardType = 'work' | 'crm' | 'dev' | 'support' | 'marketing';
export type ViewType = 'table' | 'kanban' | 'timeline' | 'calendar' | 'chart' | 'dashboard';

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  type: BoardType;
  icon: string;
  color: string;
  columns: Column[];
  groups: Group[];
  views: ViewType[];
  activeView: ViewType;
  settings: BoardSettings;
  createdAt: number;
  updatedAt: number;
}

export interface BoardSettings {
  defaultGroupColor: string;
  showSubitems: boolean;
  allowDuplicates: boolean;
}

// ── Group ─────────────────────────────────────────────────

export interface Group {
  id: string;
  boardId: string;
  title: string;
  color: string;
  position: number;
  collapsed: boolean;
}

// ── Column Types ──────────────────────────────────────────

export type ColumnType =
  | 'text'
  | 'number'
  | 'status'
  | 'date'
  | 'person'
  | 'timeline'
  | 'dropdown'
  | 'checkbox'
  | 'rating'
  | 'tags'
  | 'file'
  | 'link'
  | 'formula'
  | 'email'
  | 'phone'
  | 'priority'
  | 'progress';

export interface Column {
  id: string;
  type: ColumnType;
  title: string;
  width: number;
  settings: ColumnSettings;
  position: number;
}

export interface ColumnSettings {
  // Status column
  labels?: StatusLabel[];
  // Dropdown column
  options?: string[];
  // Number column
  unit?: string;
  format?: 'number' | 'currency' | 'percentage';
  // Formula column
  formula?: string;
  // Priority column
  priorityLabels?: StatusLabel[];
  // General
  defaultValue?: unknown;
}

export interface StatusLabel {
  id: string;
  text: string;
  color: string;
}

// ── Item ──────────────────────────────────────────────────

export interface Item {
  id: string;
  boardId: string;
  groupId: string;
  name: string;
  values: Record<string, unknown>;
  position: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  subscribers: string[];
}

export interface SubItem {
  id: string;
  parentItemId: string;
  boardId: string;
  name: string;
  values: Record<string, unknown>;
  position: number;
  createdAt: number;
  updatedAt: number;
}

// ── Activity & Comments ───────────────────────────────────

export interface Activity {
  id: string;
  itemId: string;
  boardId: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  type: 'comment' | 'update' | 'create' | 'mention' | 'attachment';
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
}

// ── Notifications ─────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'assignment' | 'update' | 'comment' | 'automation';
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: number;
}

// ── Automation ────────────────────────────────────────────

export interface Automation {
  id: string;
  boardId: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  createdAt: number;
}

export interface AutomationTrigger {
  type: 'status_change' | 'item_created' | 'date_arrived' | 'column_change' | 'item_moved';
  config: Record<string, unknown>;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: unknown;
}

export interface AutomationAction {
  type: 'notify' | 'assign' | 'move_item' | 'change_status' | 'create_item' | 'send_email';
  config: Record<string, unknown>;
}

// ── AI ────────────────────────────────────────────────────

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AIContext {
  boardId?: string;
  workspaceId?: string;
  itemId?: string;
  moduleContext?: BoardType;
}

// ── Default Column Presets ────────────────────────────────

export const DEFAULT_STATUS_LABELS: StatusLabel[] = [
  { id: 'working', text: 'Working on it', color: '#FDAB3D' },
  { id: 'done', text: 'Done', color: '#00C875' },
  { id: 'stuck', text: 'Stuck', color: '#E2445C' },
  { id: 'pending', text: 'Pending', color: '#A25DDC' },
  { id: 'review', text: 'In Review', color: '#0086C0' },
];

export const DEFAULT_PRIORITY_LABELS: StatusLabel[] = [
  { id: 'critical', text: 'Critical ⚡', color: '#333333' },
  { id: 'high', text: 'High', color: '#E2445C' },
  { id: 'medium', text: 'Medium', color: '#FDAB3D' },
  { id: 'low', text: 'Low', color: '#579BFC' },
  { id: 'none', text: '', color: '#C4C4C4' },
];

export const GROUP_COLORS = [
  '#579BFC', '#00C875', '#FDAB3D', '#E2445C', '#A25DDC',
  '#037F4C', '#FF158A', '#FF5AC4', '#784BD1', '#0086C0',
  '#9CD326', '#CAB641', '#FFCB00', '#BB3354', '#FF642E',
];
