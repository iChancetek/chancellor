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
  await setDoc(doc(db, 'workspaces', workspace.id), workspace);
}

export async function getWorkspaces(userId: string): Promise<Workspace[]> {
  const q = query(collection(db, 'workspaces'), where('ownerId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Workspace);
}

export function subscribeToWorkspaces(userId: string, callback: (workspaces: Workspace[]) => void): Unsubscribe {
  const q = query(collection(db, 'workspaces'), where('ownerId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => d.data() as Workspace));
  });
}

export async function updateWorkspace(id: string, updates: Partial<Workspace>): Promise<void> {
  await updateDoc(doc(db, 'workspaces', id), { ...updates, updatedAt: Date.now() });
}

// ── Boards ────────────────────────────────────────────────

export async function createBoard(board: Board): Promise<void> {
  await setDoc(doc(db, 'boards', board.id), board);
}

export async function getBoards(workspaceId: string): Promise<Board[]> {
  const q = query(collection(db, 'boards'), where('workspaceId', '==', workspaceId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Board);
}

export function subscribeToBoards(workspaceId: string, callback: (boards: Board[]) => void): Unsubscribe {
  const q = query(collection(db, 'boards'), where('workspaceId', '==', workspaceId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => d.data() as Board));
  });
}

export async function updateBoard(id: string, updates: Partial<Board>): Promise<void> {
  await updateDoc(doc(db, 'boards', id), { ...updates, updatedAt: Date.now() });
}

export async function deleteBoard(id: string): Promise<void> {
  await deleteDoc(doc(db, 'boards', id));
}

// ── Items ─────────────────────────────────────────────────

export async function createItem(item: Item): Promise<void> {
  await setDoc(doc(db, 'items', item.id), item);
}

export function subscribeToItems(boardId: string, callback: (items: Item[]) => void): Unsubscribe {
  const q = query(collection(db, 'items'), where('boardId', '==', boardId), orderBy('position'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => d.data() as Item));
  });
}

export async function updateItem(id: string, updates: Partial<Item>): Promise<void> {
  await updateDoc(doc(db, 'items', id), { ...updates, updatedAt: Date.now() });
}

export async function deleteItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'items', id));
}

export async function batchUpdateItems(updates: Array<{ id: string; data: Partial<Item> }>): Promise<void> {
  const batch = writeBatch(db);
  updates.forEach(({ id, data }) => {
    batch.update(doc(db, 'items', id), { ...data, updatedAt: Date.now() });
  });
  await batch.commit();
}

// ── Activities ────────────────────────────────────────────

export async function createActivity(activity: Activity): Promise<void> {
  await setDoc(doc(db, 'activities', activity.id), activity);
}

export function subscribeToActivities(itemId: string, callback: (activities: Activity[]) => void): Unsubscribe {
  const q = query(collection(db, 'activities'), where('itemId', '==', itemId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => d.data() as Activity));
  });
}
