'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { isSuperAdmin } from '@/lib/admin';
import { useRouter } from 'next/navigation';
import { 
  Users, Shield, Activity, Search, Filter, 
  MoreHorizontal, UserPlus, Download, CheckCircle2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Mock Data
const USER_GROWTH_DATA = [
  { name: 'Jan', users: 450 },
  { name: 'Feb', users: 520 },
  { name: 'Mar', users: 610 },
  { name: 'Apr', users: 840 },
  { name: 'May', users: 950 },
  { name: 'Jun', users: 1200 },
];

const USER_DISTRIBUTION = [
  { name: 'Active', value: 850, color: '#00c875' },
  { name: 'Inactive', value: 120, color: '#ff3d57' },
  { name: 'Pending', value: 230, color: '#ffcb00' },
];

const AUDIT_LOGS = [
  { id: 1, user: 'chancellor@ichancetek.com', action: 'Login Success', target: 'System', time: '2 mins ago', status: 'Success' },
  { id: 2, user: 'user_42@enterprise.com', action: 'Export Data', target: 'CRM Board', time: '15 mins ago', status: 'Success' },
  { id: 3, user: 'admin_test@isynera.com', action: 'Update Role', target: 'User #901', time: '1 hour ago', status: 'Success' },
  { id: 4, user: 'Chanceminus@gmail.com', action: 'Create Workspace', target: 'Dev Ops', time: '3 hours ago', status: 'Success' },
  { id: 5, user: 'bot_agent_alpha', action: 'Auto-Triage', target: 'Support Ticket #55', time: '5 hours ago', status: 'Success' },
];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && (!user || !isSuperAdmin(user.email))) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || !isSuperAdmin(user.email)) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Verifying Administrator Access...</div>;
  }

  return (
    <div style={{ padding: 'clamp(16px, 5vw, 40px)', background: '#f5f6f8', minHeight: '100%', overflowX: 'hidden' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: '1', minWidth: '280px' }}>
          <h1 className="heading-section" style={{ color: '#323338', marginBottom: '8px' }}>Administration Dashboard</h1>
          <p style={{ color: '#676879' }}>Manage users, monitor audit logs, and oversee enterprise infrastructure.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn-monday-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff' }}>
            <Download size={18} /> <span className="mobile-hide">Export Report</span>
          </button>
          <button className="btn-monday-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: 'Total Users', value: '1,432', change: '+12%', icon: Users, color: '#0073ea' },
          { label: 'Active Sessions', value: '284', change: '+5%', icon: Activity, color: '#00c875' },
          { label: 'Admin Users', value: '12', change: '0%', icon: Shield, color: '#ffcb00' },
          { label: 'System Health', value: '99.9%', change: 'Stable', icon: CheckCircle2, color: '#6161FF' }
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e1e4e8', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '10px', background: `${stat.color}15`, color: stat.color, borderRadius: '12px' }}>
                <stat.icon size={24} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: stat.color }}>{stat.change}</span>
            </div>
            <h4 style={{ fontSize: '14px', color: '#676879', fontWeight: 500 }}>{stat.label}</h4>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#323338', marginTop: '4px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e1e4e8' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '32px' }}>User Growth (6 Months)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={USER_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#676879', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#676879', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f5f6f8' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="users" fill="#6161FF" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e1e4e8' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '32px' }}>User Status</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={USER_DISTRIBUTION}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {USER_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e1e4e8', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700 }}>System Audit Log</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
             <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#676879' }} />
                <input type="text" placeholder="Filter logs..." style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #d0d4e4', fontSize: '13px' }} />
             </div>
             <button style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d0d4e4', background: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <Filter size={16} /> Filter
             </button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#fcfcfd' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '16px 32px', fontSize: '13px', fontWeight: 600, color: '#676879' }}>User Account</th>
              <th style={{ textAlign: 'left', padding: '16px 32px', fontSize: '13px', fontWeight: 600, color: '#676879' }}>Action</th>
              <th style={{ textAlign: 'left', padding: '16px 32px', fontSize: '13px', fontWeight: 600, color: '#676879' }}>Target</th>
              <th style={{ textAlign: 'left', padding: '16px 32px', fontSize: '13px', fontWeight: 600, color: '#676879' }}>Timestamp</th>
              <th style={{ textAlign: 'left', padding: '16px 32px', fontSize: '13px', fontWeight: 600, color: '#676879' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '16px 32px' }}></th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOGS.map((log) => (
              <tr key={log.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '20px 32px', fontSize: '14px', fontWeight: 600 }}>{log.user}</td>
                <td style={{ padding: '20px 32px', fontSize: '14px' }}>{log.action}</td>
                <td style={{ padding: '20px 32px', fontSize: '14px', color: '#676879' }}>{log.target}</td>
                <td style={{ padding: '20px 32px', fontSize: '14px', color: '#676879' }}>{log.time}</td>
                <td style={{ padding: '20px 32px' }}>
                  <span style={{ padding: '4px 12px', background: '#00c87515', color: '#00c875', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>{log.status}</span>
                </td>
                <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                  <MoreHorizontal size={18} color="#676879" style={{ cursor: 'pointer' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '24px 32px', textAlign: 'center', borderTop: '1px solid #eee' }}>
          <button style={{ background: 'none', border: 'none', color: '#0073ea', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>View Full Audit History</button>
        </div>
      </div>
    </div>
  );
}
