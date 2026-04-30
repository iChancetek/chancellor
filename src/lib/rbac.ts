/* ───────────────────────────────────────────────────────────
 *  Chancellor — RBAC Permission Engine
 *  Central authority for all access control decisions.
 * ─────────────────────────────────────────────────────────── */
import type { SystemRole, ModuleScope, PermissionAction, PermissionRule, MemberPermissions, Board, User } from './types';

// ── Role Hierarchy (higher index = more power) ───────────

const ROLE_HIERARCHY: SystemRole[] = ['viewer', 'member', 'team_lead', 'manager', 'admin', 'super_admin'];

export function getRoleLevel(role: SystemRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

export function isRoleAtLeast(userRole: SystemRole, minRole: SystemRole): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(minRole);
}

// ── Default Permission Sets Per Role ─────────────────────

const ALL_MODULES: ModuleScope[] = ['crm', 'erp', 'finance', 'hr', 'dev', 'support', 'marketing', 'work'];
const ALL_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'approve', 'export', 'admin'];

function buildFullAccess(): PermissionRule[] {
  return ALL_MODULES.map(m => ({ module: m, actions: [...ALL_ACTIONS], sensitiveData: true }));
}

export const DEFAULT_ROLE_PERMISSIONS: Record<SystemRole, PermissionRule[]> = {
  super_admin: buildFullAccess(),
  admin: buildFullAccess(),
  manager: ALL_MODULES.map(m => ({
    module: m,
    actions: ['view', 'create', 'edit', 'approve', 'export'] as PermissionAction[],
    sensitiveData: m !== 'hr', // managers can't see HR PII by default
  })),
  team_lead: ALL_MODULES.map(m => ({
    module: m,
    actions: ['view', 'create', 'edit'] as PermissionAction[],
    sensitiveData: false,
  })),
  member: ALL_MODULES.map(m => ({
    module: m,
    actions: m === 'finance' || m === 'hr'
      ? ['view'] as PermissionAction[]
      : ['view', 'create', 'edit'] as PermissionAction[],
    sensitiveData: false,
  })),
  viewer: ALL_MODULES.map(m => ({
    module: m,
    actions: ['view'] as PermissionAction[],
    sensitiveData: false,
  })),
};

// ── Permission Checks ────────────────────────────────────

/** Check if a role can perform an action in a module */
export function canAccess(
  userRole: SystemRole,
  module: ModuleScope,
  action: PermissionAction,
  customPermissions?: PermissionRule[]
): boolean {
  // Super admin always has access
  if (userRole === 'super_admin') return true;

  const perms = customPermissions || DEFAULT_ROLE_PERMISSIONS[userRole];
  const rule = perms.find(r => r.module === module);
  if (!rule) return false;
  return rule.actions.includes(action);
}

/** Check if a user can access a specific board */
export function canAccessBoard(
  userRole: SystemRole,
  userId: string,
  board: Board,
  customPermissions?: PermissionRule[]
): boolean {
  if (userRole === 'super_admin' || userRole === 'admin') return true;

  const ac = board.accessControl;
  if (!ac) return canAccess(userRole, board.type as ModuleScope, 'view', customPermissions);

  // Check member restriction
  if (ac.restrictedTo && ac.restrictedTo.length > 0) {
    if (!ac.restrictedTo.includes(userId)) return false;
  }

  // Check minimum role
  if (ac.minRole && !isRoleAtLeast(userRole, ac.minRole)) return false;

  return canAccess(userRole, board.type as ModuleScope, 'view', customPermissions);
}

/** Check if user can see sensitive data in a module */
export function canSeeSensitiveData(
  userRole: SystemRole,
  module: ModuleScope,
  customPermissions?: PermissionRule[]
): boolean {
  if (userRole === 'super_admin' || userRole === 'admin') return true;

  const perms = customPermissions || DEFAULT_ROLE_PERMISSIONS[userRole];
  const rule = perms.find(r => r.module === module);
  return rule?.sensitiveData ?? false;
}

/** Check if user can edit items on a board */
export function canEditBoard(
  userRole: SystemRole,
  board: Board,
  customPermissions?: PermissionRule[]
): boolean {
  return canAccess(userRole, board.type as ModuleScope, 'edit', customPermissions);
}

// ── User Management Scoping ──────────────────────────────

export type UserManagementAction = 'disable' | 'enable' | 'change_password' | 'change_role' | 'grant_board';

export function canManageUser(actor: User, targetUser: User, action: UserManagementAction): boolean {
  // Super Admins and Admins can do anything to anyone (except demote another Super Admin)
  if (actor.role === 'super_admin') return true;
  if (actor.role === 'admin') {
    return targetUser.role !== 'super_admin';
  }

  // Managers
  if (actor.role === 'manager') {
    // Managers cannot change roles of users, only passwords, enable/disable, and grant boards
    if (action === 'change_role') return false;
    // Target must be in the same department
    if (!actor.department || actor.department !== targetUser.department) return false;
    // Target cannot be an admin or super admin
    if (targetUser.role === 'admin' || targetUser.role === 'super_admin') return false;
    return true;
  }

  // Team Leads
  if (actor.role === 'team_lead') {
    // Team Leads cannot change roles
    if (action === 'change_role') return false;
    // Target must be in the same team AND department
    if (!actor.team || actor.team !== targetUser.team) return false;
    if (!actor.department || actor.department !== targetUser.department) return false;
    // Target cannot be a manager, admin, or super admin
    if (targetUser.role === 'manager' || targetUser.role === 'admin' || targetUser.role === 'super_admin') return false;
    return true;
  }

  return false;
}

export function canCreateUser(actorRole: SystemRole): boolean {
  return actorRole === 'super_admin' || actorRole === 'admin';
}

export function canAccessAdminDashboard(actorRole: SystemRole): boolean {
  // All management roles can access the dashboard, but the UI will filter what they see
  return isRoleAtLeast(actorRole, 'team_lead');
}

// ── UI Helpers ───────────────────────────────────────────

export function getRoleLabel(role: SystemRole): string {
  const labels: Record<SystemRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    team_lead: 'Team Lead',
    member: 'Member',
    viewer: 'Viewer',
  };
  return labels[role] || role;
}

export function getRoleBadgeColor(role: SystemRole): { bg: string; color: string } {
  const colors: Record<SystemRole, { bg: string; color: string }> = {
    super_admin: { bg: 'rgba(97,97,255,0.15)', color: '#6161FF' },
    admin: { bg: 'rgba(226,68,92,0.15)', color: '#E2445C' },
    manager: { bg: 'rgba(253,171,61,0.15)', color: '#FDAB3D' },
    team_lead: { bg: 'rgba(87,155,252,0.15)', color: '#579BFC' },
    member: { bg: 'rgba(0,200,117,0.15)', color: '#00C875' },
    viewer: { bg: 'rgba(196,196,196,0.15)', color: '#9699a6' },
  };
  return colors[role] || colors.viewer;
}

export function getRoleIcon(role: SystemRole): string {
  const icons: Record<SystemRole, string> = {
    super_admin: '👑', admin: '🛡️', manager: '📊',
    team_lead: '⭐', member: '👤', viewer: '👁️',
  };
  return icons[role] || '👤';
}

export { ROLE_HIERARCHY, ALL_MODULES, ALL_ACTIONS };
