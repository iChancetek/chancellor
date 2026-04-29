/* ───────────────────────────────────────────────────────────
 *  Zustand State Stores — Local-First with Optional Cloud Sync
 * ─────────────────────────────────────────────────────────── */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Workspace, Board, Item, Group, Column, Notification, AIMessage, ViewType } from './types';

// ── Auth Store ────────────────────────────────────────────

interface AuthState {
  user: { uid: string; email: string; displayName: string; photoURL: string | null } | null;
  loading: boolean;
  setUser: (user: AuthState['user']) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
}));

// ── Workspace Store ───────────────────────────────────────

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspaceLocal: (id: string, updates: Partial<Workspace>) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: [],
      activeWorkspace: null,
      setWorkspaces: (workspaces) => set({ workspaces }),
      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
      addWorkspace: (workspace) => set((state) => ({
        workspaces: [...state.workspaces, workspace],
      })),
      updateWorkspaceLocal: (id, updates) => set((state) => ({
        workspaces: state.workspaces.map(ws => ws.id === id ? { ...ws, ...updates, updatedAt: Date.now() } : ws),
        activeWorkspace: state.activeWorkspace?.id === id ? { ...state.activeWorkspace, ...updates, updatedAt: Date.now() } : state.activeWorkspace,
      })),
    }),
    {
      name: 'chancellor-workspaces',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ── Board Store ───────────────────────────────────────────

interface BoardState {
  boards: Board[];
  activeBoard: Board | null;
  activeView: ViewType;
  items: Item[];
  selectedItems: string[];
  setBoards: (boards: Board[]) => void;
  setActiveBoard: (board: Board | null) => void;
  setActiveView: (view: ViewType) => void;
  setItems: (items: Item[]) => void;
  syncBoardItems: (boardId: string, items: Item[]) => void;
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  removeItem: (id: string) => void;
  setSelectedItems: (ids: string[]) => void;
  toggleItemSelection: (id: string) => void;
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boards: [],
      activeBoard: null,
      activeView: 'table',
      items: [],
      selectedItems: [],
      setBoards: (boards) => set({ boards }),
      setActiveBoard: (board) => set({ activeBoard: board, activeView: board?.activeView || 'table' }),
      setActiveView: (view) => set({ activeView: view }),
      setItems: (items) => set({ items }),
      syncBoardItems: (boardId, newItems) => set((state) => {
        const otherBoardItems = state.items.filter(i => i.boardId !== boardId);
        const localItems = state.items.filter(i => i.boardId === boardId);
        
        // Merge strategy:
        // 1. Use all items from server (they are source of truth for existing data)
        // 2. Keep local items that are NOT on the server yet (prevents wipe on initial load)
        const serverIds = new Set(newItems.map(i => i.id));
        const mergedItems = [
          ...newItems,
          ...localItems.filter(li => !serverIds.has(li.id))
        ];

        return { items: [...otherBoardItems, ...mergedItems] };
      }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item)),
        })),
      reorderItems: (reorderedItems: any[]) => set((state) => {
        const reorderedIds = new Set(reorderedItems.map(i => i.id));
        const otherItems = state.items.filter(i => !reorderedIds.has(i.id));
        return { items: [...otherItems, ...reorderedItems] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      setSelectedItems: (ids) => set({ selectedItems: ids }),
      toggleItemSelection: (id) =>
        set((state) => ({
          selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems.filter((i) => i !== id)
            : [...state.selectedItems, id],
        })),
      addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
      updateBoard: (id, updates) => set((state) => ({
        boards: state.boards.map(b => b.id === id ? { ...b, ...updates, updatedAt: Date.now() } : b),
        activeBoard: state.activeBoard?.id === id ? { ...state.activeBoard, ...updates, updatedAt: Date.now() } : state.activeBoard,
      })),
      deleteBoard: (id) => set((state) => ({
        boards: state.boards.filter(b => b.id !== id),
        activeBoard: state.activeBoard?.id === id ? null : state.activeBoard,
        items: state.items.filter(i => i.boardId !== id),
      })),
    }),
    {
      name: 'chancellor-boards',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        boards: state.boards,
        items: state.items,
      }),
    }
  )
);

// ── Automation Store ──────────────────────────────────────

interface AutomationEntry {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  color: string;
  enabled: boolean;
}

interface AutomationState {
  automations: AutomationEntry[];
  setAutomations: (automations: AutomationEntry[]) => void;
  toggleAutomation: (id: string) => void;
  addAutomation: (automation: AutomationEntry) => void;
  removeAutomation: (id: string) => void;
}

export const useAutomationStore = create<AutomationState>()(
  persist(
    (set) => ({
      automations: [],
      setAutomations: (automations) => set({ automations }),
      toggleAutomation: (id) => set((state) => ({
        automations: state.automations.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a),
      })),
      addAutomation: (automation) => set((state) => ({
        automations: [...state.automations, automation],
      })),
      removeAutomation: (id) => set((state) => ({
        automations: state.automations.filter(a => a.id !== id),
      })),
    }),
    {
      name: 'chancellor-automations',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ── Settings Store ────────────────────────────────────────

interface SettingsState {
  workspaceName: string;
  timezone: string;
  theme: 'light' | 'dark';
  notifyOnMention: boolean;
  notifyOnAssignment: boolean;
  notifyOnStatusChange: boolean;
  notifyOnComment: boolean;
  setWorkspaceName: (name: string) => void;
  setTimezone: (tz: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleNotification: (key: 'notifyOnMention' | 'notifyOnAssignment' | 'notifyOnStatusChange' | 'notifyOnComment') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      workspaceName: 'My Workspace',
      timezone: 'America/New_York',
      theme: 'light',
      notifyOnMention: true,
      notifyOnAssignment: true,
      notifyOnStatusChange: true,
      notifyOnComment: false,
      setWorkspaceName: (name) => set({ workspaceName: name }),
      setTimezone: (tz) => set({ timezone: tz }),
      setTheme: (theme) => set({ theme }),
      toggleNotification: (key) => set((state) => ({ [key]: !state[key] })),
    }),
    {
      name: 'chancellor-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ── UI Store ──────────────────────────────────────────────

interface UIState {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  itemDetailOpen: boolean;
  selectedItemId: string | null;
  aiChatOpen: boolean;
  searchOpen: boolean;
  notifications: Notification[];
  aiMessages: AIMessage[];
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  openItemDetail: (itemId: string) => void;
  closeItemDetail: () => void;
  toggleAIChat: () => void;
  setSearchOpen: (open: boolean) => void;
  setNotifications: (notifications: Notification[]) => void;
  addAIMessage: (message: AIMessage) => void;
  setAIMessages: (messages: AIMessage[]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  sidebarWidth: 260,
  itemDetailOpen: false,
  selectedItemId: null,
  aiChatOpen: false,
  searchOpen: false,
  notifications: [],
  aiMessages: [],
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  openItemDetail: (itemId) => set({ itemDetailOpen: true, selectedItemId: itemId }),
  closeItemDetail: () => set({ itemDetailOpen: false, selectedItemId: null }),
  toggleAIChat: () => set((state) => ({ aiChatOpen: !state.aiChatOpen })),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setNotifications: (notifications) => set({ notifications }),
  addAIMessage: (message) => set((state) => ({ aiMessages: [...state.aiMessages, message] })),
  setAIMessages: (messages) => set({ aiMessages: messages }),
}));

// ── Agent Store ───────────────────────────────────────────

interface AgentState {
  agents: Agent[];
  activeAgentId: string | null;
  setAgents: (agents: Agent[]) => void;
  setActiveAgent: (id: string | null) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  addAgentAction: (agentId: string, action: AgentAction) => void;
  updateAgentAction: (agentId: string, actionId: string, updates: Partial<AgentAction>) => void;
}

import type { Agent, AgentAction } from './types';
import type { MemberPermissions, PermissionRule, SystemRole } from './types';

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      agents: [
        {
          id: 'cfo-agent-1',
          name: 'CFO Intelligence',
          role: 'cfo',
          avatar: '🏦',
          status: 'idle',
          description: 'High-level financial strategy, risk assessment, and fiscal governance.',
          actions: []
        },
        {
          id: 'sales-agent-1',
          name: 'Sales Intelligence',
          role: 'sales',
          avatar: '💼',
          status: 'idle',
          description: 'Autonomous sales pipeline optimization and lead engagement.',
          actions: []
        },
        {
          id: 'finance-agent-1',
          name: 'Finance Controller',
          role: 'finance',
          avatar: '📊',
          status: 'idle',
          description: 'Automated ledger reconciliation and cash flow forecasting.',
          actions: []
        },
        {
          id: 'procurement-agent-1',
          name: 'Procurement Agent',
          role: 'procurement',
          avatar: '🚚',
          status: 'idle',
          description: 'Supply chain optimization and automated vendor procurement.',
          actions: []
        },
        {
          id: 'ops-agent-1',
          name: 'Operations Agent',
          role: 'ops',
          avatar: '⚙️',
          status: 'idle',
          description: 'Business process automation and operational efficiency.',
          actions: []
        },
        {
          id: 'pm-agent-1',
          name: 'Project Orchestrator',
          role: 'pm',
          avatar: '📅',
          status: 'idle',
          description: 'Resource management and project timeline optimization.',
          actions: []
        },
        {
          id: 'dev-agent-1',
          name: 'Developer Agent',
          role: 'dev',
          avatar: '💻',
          status: 'idle',
          description: 'Autonomous code review, bug fixing, and CI/CD monitoring.',
          actions: []
        },
        {
          id: 'support-agent-1',
          name: 'Support Agent',
          role: 'support',
          avatar: '🎧',
          status: 'idle',
          description: 'Autonomous ticket resolution and customer success optimization.',
          actions: []
        },
        {
          id: 'staff-agent-1',
          name: 'Chief-of-Staff',
          role: 'staff',
          avatar: '🎩',
          status: 'idle',
          description: 'Executive coordination, KPI tracking, and strategic briefings.',
          actions: []
        },
        {
          id: 'crm-agent-1',
          name: 'CRM Intelligence',
          role: 'sales',
          avatar: '🧲',
          status: 'idle',
          description: 'Autonomous lead scoring, pipeline optimization, deal sentiment analysis, and NLP-driven outreach.',
          actions: []
        }
      ],
      activeAgentId: null,
      setAgents: (agents) => set({ agents }),
      setActiveAgent: (id) => set({ activeAgentId: id }),
      updateAgent: (id, updates) => set((state) => ({
        agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      addAgentAction: (agentId, action) => set((state) => ({
        agents: state.agents.map(a => a.id === agentId ? { ...a, actions: [action, ...a.actions].slice(0, 50) } : a)
      })),
      updateAgentAction: (agentId, actionId, updates) => set((state) => ({
        agents: state.agents.map(a => a.id === agentId ? { 
          ...a, 
          actions: a.actions.map(act => act.id === actionId ? { ...act, ...updates } : act) 
        } : a)
      })),
    }),
    {
      name: 'chancellor-agents',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ── RBAC Store ───────────────────────────────────────────

interface RBACState {
  memberPermissions: MemberPermissions[];
  currentUserRole: SystemRole;
  setMemberPermissions: (perms: MemberPermissions[]) => void;
  setCurrentUserRole: (role: SystemRole) => void;
  updateMemberRole: (uid: string, role: SystemRole, grantedBy: string) => void;
  updateMemberPermissions: (uid: string, permissions: PermissionRule[]) => void;
  removeMember: (uid: string) => void;
  getMemberPermissions: (uid: string) => MemberPermissions | undefined;
}

export const useRBACStore = create<RBACState>()(
  persist(
    (set, get) => ({
      memberPermissions: [],
      currentUserRole: 'member' as SystemRole,
      setMemberPermissions: (perms) => set({ memberPermissions: perms }),
      setCurrentUserRole: (role) => set({ currentUserRole: role }),
      updateMemberRole: (uid, role, grantedBy) => set((state) => {
        const existing = state.memberPermissions.find(m => m.uid === uid);
        if (existing) {
          return {
            memberPermissions: state.memberPermissions.map(m =>
              m.uid === uid ? { ...m, systemRole: role, grantedBy, updatedAt: Date.now() } : m
            ),
          };
        }
        return {
          memberPermissions: [...state.memberPermissions, {
            uid, email: '', displayName: '', systemRole: role,
            permissions: [], grantedBy, grantedAt: Date.now(), updatedAt: Date.now(),
          }],
        };
      }),
      updateMemberPermissions: (uid, permissions) => set((state) => ({
        memberPermissions: state.memberPermissions.map(m =>
          m.uid === uid ? { ...m, permissions, updatedAt: Date.now() } : m
        ),
      })),
      removeMember: (uid) => set((state) => ({
        memberPermissions: state.memberPermissions.filter(m => m.uid !== uid),
      })),
      getMemberPermissions: (uid) => get().memberPermissions.find(m => m.uid === uid),
    }),
    {
      name: 'chancellor-rbac',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
