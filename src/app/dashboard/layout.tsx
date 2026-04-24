'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import AIChat from '@/components/ai/AIChat';

function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">⚡</div>
        <div className="loading-spinner"></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Loading workspace...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="main-scroll">
          {children}
        </div>
      </div>
      <AIChat />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell>{children}</DashboardShell>
  );
}
