'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { 
  Users, UserPlus, Shield, Loader2, MoreVertical, Search, CheckCircle2, AlertTriangle, Key, Ban, CheckCircle
} from 'lucide-react';
import { canManageUser, canCreateUser, canAccessAdminDashboard, getRoleLabel, getRoleBadgeColor } from '@/lib/rbac';
import type { User, SystemRole } from '@/lib/types';

export default function UserManagementPage() {
  const { user: authUser, loading } = useAuth();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  // Create User State
  const [createData, setCreateData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'member' as SystemRole,
    department: '',
    team: ''
  });

  useEffect(() => {
    if (loading) return;
    if (!authUser) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      setFetching(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        const userData = userDoc.data() as User;
        setCurrentUser(userData);

        if (!canAccessAdminDashboard(userData.role)) {
          router.push('/dashboard');
          return;
        }

        const usersSnap = await getDocs(collection(db, 'users'));
        let allUsers = usersSnap.docs.map(d => d.data() as User);

        // Filter based on scope
        if (userData.role === 'manager') {
          allUsers = allUsers.filter(u => u.department === userData.department);
        } else if (userData.role === 'team_lead') {
          allUsers = allUsers.filter(u => u.team === userData.team && u.department === userData.department);
        }

        setUsers(allUsers);
      } catch (err) {
        console.error("Failed to load user management data", err);
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [authUser, loading, router]);

  const handleAction = async (targetUser: User, action: string, payload?: any) => {
    if (!currentUser) return;
    if (!canManageUser(currentUser, targetUser, action as any)) {
      alert("You do not have permission to perform this action on this user.");
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: targetUser.uid, action, payload })
      });
      const data = await res.json();
      
      if (data.success) {
        // Optimistic UI update
        setUsers(users.map(u => {
          if (u.uid === targetUser.uid) {
            if (action === 'disable') return { ...u, isDisabled: true };
            if (action === 'enable') return { ...u, isDisabled: false };
            if (action === 'change_role') return { ...u, role: payload.role };
            if (action === 'update_details') return { ...u, ...payload };
          }
          return u;
        }));
        alert('Action successful');
        setIsPasswordModalOpen(false);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Network error while performing action.');
    }
  };

  const handleCreateUser = async () => {
    if (!currentUser || !canCreateUser(currentUser.role)) {
      alert("You do not have permission to create users.");
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      });
      const data = await res.json();
      
      if (data.success) {
        setUsers([...users, data.user]);
        setIsCreateModalOpen(false);
        setCreateData({ email: '', password: '', displayName: '', role: 'member', department: '', team: '' });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Network error while creating user.');
    }
  };

  if (loading || fetching || !currentUser) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f6f8' }}>
        <Loader2 className="animate-spin" size={32} color="#6161FF" />
        <p style={{ marginTop: '16px', color: '#676879', fontWeight: 600 }}>Loading User Directory...</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', background: '#f5f6f8', minHeight: '100%' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <h1 className="heading-section" style={{ color: '#323338', marginBottom: '8px' }}>User Management</h1>
          <p style={{ color: '#676879' }}>Manage access, roles, and departmental groups.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', border: '1px solid #d0d4e4', borderRadius: '4px', background: '#fff' }}>
            <Search size={16} color="#676879" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', padding: '8px 0', width: '200px', fontSize: '14px' }}
            />
          </div>
          {canCreateUser(currentUser.role) && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-monday-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <UserPlus size={16} /> Add User
            </button>
          )}
        </div>
      </header>

      {/* Users Table */}
      <div style={{ background: '#fff', border: '1px solid #d0d4e4', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9ff', borderBottom: '1px solid #d0d4e4', textAlign: 'left', fontSize: '13px', color: '#676879' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Name & Email</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Department / Team</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => {
              const roleColors = getRoleBadgeColor(u.role);
              const canManage = canManageUser(currentUser, u, 'disable'); // checking general manageability
              
              return (
                <tr key={u.uid} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: '#323338', fontSize: '14px' }}>{u.displayName}</div>
                    <div style={{ color: '#676879', fontSize: '13px' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      background: roleColors.bg, color: roleColors.color, 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 
                    }}>
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ color: '#323338', fontSize: '14px' }}>{u.department || '—'}</div>
                    <div style={{ color: '#676879', fontSize: '12px' }}>{u.team || '—'}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {u.isDisabled ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e2445c', fontSize: '13px', fontWeight: 600 }}>
                        <Ban size={14} /> Disabled
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00c875', fontSize: '13px', fontWeight: 600 }}>
                        <CheckCircle size={14} /> Active
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {canManage && (
                        <>
                          <button 
                            onClick={() => { setSelectedUser(u); setIsPasswordModalOpen(true); }}
                            style={{ background: '#f5f6f8', border: '1px solid #d0d4e4', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Key size={14} /> Password
                          </button>
                          
                          {canManageUser(currentUser, u, 'change_role') && (
                            <select 
                              value={u.role}
                              onChange={(e) => handleAction(u, 'change_role', { role: e.target.value })}
                              style={{ background: '#fff', border: '1px solid #d0d4e4', padding: '6px', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
                            >
                              <option value="super_admin">Super Admin</option>
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="team_lead">Team Lead</option>
                              <option value="member">Member</option>
                              <option value="viewer">Viewer</option>
                            </select>
                          )}

                          <button 
                            onClick={() => handleAction(u, u.isDisabled ? 'enable' : 'disable')}
                            style={{ 
                              background: u.isDisabled ? '#00c875' : '#e2445c', 
                              color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' 
                            }}
                          >
                            {u.isDisabled ? <><CheckCircle size={14}/> Enable</> : <><Ban size={14}/> Disable</>}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#676879' }}>No users found in your scope.</div>
        )}
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', width: '400px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Reset Password for {selectedUser.displayName}</h3>
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d0d4e4', borderRadius: '4px', marginBottom: '24px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setIsPasswordModalOpen(false)} className="btn-monday-secondary">Cancel</button>
              <button 
                onClick={() => handleAction(selectedUser, 'change_password', { password: newPassword })} 
                className="btn-monday-primary"
              >
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Create New User</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Full Name</label>
                <input type="text" value={createData.displayName} onChange={e => setCreateData({...createData, displayName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d0d4e4', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Email</label>
                <input type="email" value={createData.email} onChange={e => setCreateData({...createData, email: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d0d4e4', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Temporary Password</label>
                <input type="password" value={createData.password} onChange={e => setCreateData({...createData, password: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d0d4e4', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Role</label>
                  <select value={createData.role} onChange={e => setCreateData({...createData, role: e.target.value as SystemRole})} style={{ width: '100%', padding: '10px', border: '1px solid #d0d4e4', borderRadius: '4px' }}>
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="team_lead">Team Lead</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Department</label>
                  <select value={createData.department} onChange={e => setCreateData({...createData, department: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d0d4e4', borderRadius: '4px' }}>
                    <option value="">None</option>
                    <option value="HR">HR</option>
                    <option value="Dev">Dev</option>
                    <option value="Support">Support</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Team Name (Optional)</label>
                <input type="text" value={createData.team} onChange={e => setCreateData({...createData, team: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d0d4e4', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setIsCreateModalOpen(false)} className="btn-monday-secondary">Cancel</button>
              <button onClick={handleCreateUser} className="btn-monday-primary">Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
