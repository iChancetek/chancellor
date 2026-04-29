'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import AIChat from '@/components/ai/AIChat';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import AICreateBoardModal from '@/components/board/AICreateBoardModal';
import { useUIStore } from '@/lib/store';

import { useState } from 'react';

function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const { aiCreateModalOpen, setAiCreateModalOpen } = useUIStore();

  useEffect(() => {
    const checkVerification = async () => {
      if (loading) return;

      if (!user) {
        router.push('/');
        return;
      }

      try {
        const { doc, getDoc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const { isSuperAdmin } = await import('@/lib/admin');
        
        // 1. Check if Super Admin - Always bypass
        if (isSuperAdmin(user.email)) {
          await setDoc(doc(db, 'users', user.uid), { emailVerified: true }, { merge: true });
          setIsVerifying(false);
          return;
        }

        // 2. Check Native Firebase State
        if (user.emailVerified) {
          await setDoc(doc(db, 'users', user.uid), { emailVerified: true }, { merge: true });
          setIsVerifying(false);
          return;
        }

        // 3. Check Firestore state
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists() && userDoc.data().emailVerified) {
          setIsVerifying(false);
        } else {
          router.push('/verify');
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
      {aiCreateModalOpen && <AICreateBoardModal onClose={() => setAiCreateModalOpen(false)} />}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell>{children}</DashboardShell>
  );
}
