/* ───────────────────────────────────────────────────────────
 *  Firestore Data Operations
 * ─────────────────────────────────────────────────────────── */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Workspace, Board, Item, Group, Activity } from './types';

// ── Workspaces ────────────────────────────────────────────

export async function createWorkspace(workspace: Workspace): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'workspaces', workspace.id), workspace);
}

export async function getWorkspaces(userId: string): Promise<Workspace[]> {
  if (!db) return [];
  const q = query(collection(db, 'workspaces'), where('ownerId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Workspace);
}

export function subscribeToWorkspaces(userId: string, callback: (workspaces: Workspace[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, 'workspaces'), where('ownerId', '==', userId));
  return onSnapshot(q, 
    (snapshot) => {
      callback(snapshot.docs.map((d) => d.data() as Workspace));
    },
    (error) => {
      console.error('Firestore Subscribe Workspaces Error:', error);
      callback([]);
    }
  );
}

export async function updateWorkspace(id: string, updates: Partial<Workspace>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'workspaces', id), { ...updates, updatedAt: Date.now() });
}

// ── Boards ────────────────────────────────────────────────

export async function createBoard(board: Board): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'boards', board.id), board);
}

export async function getBoards(workspaceId: string): Promise<Board[]> {
  if (!db) return [];
  const q = query(collection(db, 'boards'), where('workspaceId', '==', workspaceId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Board);
}

export function subscribeToBoards(workspaceId: string, callback: (boards: Board[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, 'boards'), where('workspaceId', '==', workspaceId));
  return onSnapshot(q, 
    (snapshot) => {
      callback(snapshot.docs.map((d) => d.data() as Board));
    },
    (error) => {
      console.error('Firestore Subscribe Boards Error:', error);
      // DO NOT clear local state on error
    }
  );
}

export async function updateBoard(id: string, updates: Partial<Board>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'boards', id), { ...updates, updatedAt: Date.now() });
}

export async function deleteBoard(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'boards', id));
}

// ── Items ─────────────────────────────────────────────────

export async function createItem(item: Item): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'items', item.id), item);
}

export function subscribeToItems(boardId: string, callback: (items: Item[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, 'items'), where('boardId', '==', boardId));
  return onSnapshot(q, 
    (snapshot) => {
      // Sort client-side to avoid composite index requirements
      const items = snapshot.docs.map((d) => d.data() as Item);
      items.sort((a, b) => (a.position || 0) - (b.position || 0));
      callback(items);
    },
    (error) => {
      console.error('Firestore Subscribe Items Error:', error);
      // DO NOT clear local state on error
    }
  );
}

export async function updateItem(id: string, updates: Partial<Item>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'items', id), { ...updates, updatedAt: Date.now() });
}

export async function deleteItem(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'items', id));
}

export async function batchUpdateItems(updates: Array<{ id: string; data: Partial<Item> }>): Promise<void> {
  if (!db) return;
  const batch = writeBatch(db);
  updates.forEach(({ id, data }) => {
    batch.update(doc(db, 'items', id), { ...data, updatedAt: Date.now() });
  });
  await batch.commit();
}

// ── Activities ────────────────────────────────────────────

export async function createActivity(activity: Activity): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'activities', activity.id), activity);
}

export function subscribeToActivities(itemId: string, callback: (activities: Activity[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, 'activities'), where('itemId', '==', itemId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, 
    (snapshot) => {
      callback(snapshot.docs.map((d) => d.data() as Activity));
    },
    (error) => {
      console.error('Firestore Subscribe Activities Error:', error);
      callback([]);
    }
  );
}
