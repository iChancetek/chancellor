/* ───────────────────────────────────────────────────────────
 *  Zustand State Stores
 * ─────────────────────────────────────────────────────────── */
import { create } from 'zustand';
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
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  activeWorkspace: null,
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  addWorkspace: (workspace) => set((state) => ({ workspaces: [...state.workspaces, workspace] })),
}));

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
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  removeItem: (id: string) => void;
  setSelectedItems: (ids: string[]) => void;
  toggleItemSelection: (id: string) => void;
  addBoard: (board: Board) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  activeBoard: null,
  activeView: 'table',
  items: [],
  selectedItems: [],
  setBoards: (boards) => set({ boards }),
  setActiveBoard: (board) => set({ activeBoard: board, activeView: board?.activeView || 'table' }),
  setActiveView: (view) => set({ activeView: view }),
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  setSelectedItems: (ids) => set({ selectedItems: ids }),
  toggleItemSelection: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.includes(id)
        ? state.selectedItems.filter((i) => i !== id)
        : [...state.selectedItems, id],
    })),
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
}));

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
