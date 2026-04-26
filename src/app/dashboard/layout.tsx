'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import AIChat from '@/components/ai/AIChat';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

import { useState } from 'react';

function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkVerification = async () => {
      if (loading) return;

      if (!user) {
        router.push('/');
        return;
      }

      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists() && !userDoc.data().emailVerified) {
          router.push('/verify');
        } else {
          setIsVerifying(false);
        }
      } catch (err) {
        console.error("Verification check failed:", err);
        setIsVerifying(false);
      }
    };

    checkVerification();
  }, [user, loading, router]);

  if (loading || isVerifying) {
    return (
      <div className="loading-screen" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <img src="/icon.svg" alt="Chancellor" style={{ width: '48px', height: '48px', marginBottom: '16px' }} />
        <div className="loading-spinner"></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          {loading ? 'Loading workspace...' : 'Verifying account...'}
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content" style={{ overflowX: 'hidden' }}>
        <TopBar />
        <div className="main-scroll">
          {children}
        </div>
      </div>
      <AIChat />
      <OnboardingWizard />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell>{children}</DashboardShell>
  );
}
