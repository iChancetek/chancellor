'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, ArrowRight, Mail, Loader2, RefreshCw, AlertCircle, ShieldAlert, Terminal, ExternalLink, CheckCircle2 } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { isSuperAdmin } from '@/lib/admin';
import { sendEmailVerification } from 'firebase/auth';

export default function VerifyPage() {
  const { user, loading, updateUserEmail } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showDevLog, setShowDevLog] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const initVerification = async (forceNew = false) => {
    if (!user) return;
    
    try {
      const { isSuperAdmin } = await import('@/lib/admin');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      // 1. Admin Bypass - Always allow
      if (isSuperAdmin(user.email)) {
        await setDoc(doc(db, 'users', user.uid), { emailVerified: true }, { merge: true });
        router.push('/dashboard');
        return;
      }

      // 2. Check both Firestore and Native Auth state
      if (!forceNew && (user.emailVerified || (userDoc.exists() && userDoc.data().emailVerified))) {
        // Sync Firestore if native is verified
        if (user.emailVerified && userDoc.exists() && !userDoc.data().emailVerified) {
          await updateDoc(doc(db, 'users', user.uid), { emailVerified: true });
        }
        router.push('/dashboard');
        return;
      }

      // Generate a internal code (backup/audit)
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(newCode);
      
      const isCurrentlyVerified = user.emailVerified || (userDoc.exists() && userDoc.data().emailVerified);
      
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        verificationCode: isCurrentlyVerified ? null : newCode,
        emailVerified: isCurrentlyVerified,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
    } catch (err) {
      console.error("Initialization error:", err);
      setError("Security layer initialization failed. Please refresh.");
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      initVerification();
      setNewEmail(user.email || '');
    }
  }, [user, loading, router]);

  // Polling for native verification status
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        await updateDoc(doc(db, 'users', user.uid), { emailVerified: true });
        router.push('/dashboard');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, router]);

  const handleSendLink = async () => {
    if (!auth.currentUser) return;
    setSubmitting(true);
    setError('');
    try {
      await sendEmailVerification(auth.currentUser, {
        url: window.location.origin + '/verify',
      });
      setVerificationSent(true);
    } catch (err: any) {
      if (err?.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError(`Verification email failed: ${err?.message || 'Unknown error'}. Try again shortly.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-send verification email on page load
  useEffect(() => {
    if (!user || user.emailVerified || verificationSent || initializing) return;
    const autoSend = async () => {
      try {
        await sendEmailVerification(auth.currentUser!, {
          url: window.location.origin + '/verify',
        });
        setVerificationSent(true);
      } catch (err) {
        // Silently fail — user can manually resend
        console.warn('Auto-send verification failed:', err);
      }
    };
    autoSend();
  }, [user, initializing]);

  const handleChangeEmail = async () => {
    if (!newEmail || newEmail === user?.email) {
      setIsEditingEmail(false);
      return;
    }
    setSubmitting(true);
    try {
      await updateUserEmail(newEmail);
      await initVerification(true); 
      setIsEditingEmail(false);
      setError('');
    } catch (err) {
      console.error("Update email error:", err);
      setError('Failed to update email. Security policy may require re-authentication.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminBypass = async () => {
    if (!user || !isSuperAdmin(user.email)) return;
    setSubmitting(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        emailVerified: true,
        verificationCode: null
      });
      router.push('/dashboard');
    } catch (err) {
      setError('Administrative bypass failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) return;

    setSubmitting(true);
    setError('');

    try {
      const userDoc = await getDoc(doc(db, 'users', user!.uid));
      if (userDoc.exists() && userDoc.data().verificationCode === fullCode) {
        await updateDoc(doc(db, 'users', user!.uid), {
          emailVerified: true,
          verificationCode: null
        });
        router.push('/dashboard');
      } else {
        setError('Verification failed. The code entered does not match our records.');
      }
    } catch (err) {
      setError('An encrypted session error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || initializing) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f6f8' }}>
        <Loader2 className="animate-spin" size={32} color="#6161FF" />
        <p style={{ marginTop: '16px', color: '#676879', fontWeight: 600 }}>Securing Account Session...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
        
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#6161FF15', color: '#6161FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <Mail size={40} />
        </div>
        
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#323338', marginBottom: '16px' }}>Verify your identity</h1>
        
        {isEditingEmail ? (
          <div style={{ marginBottom: '40px' }}>
            <p style={{ color: '#676879', fontSize: '15px', marginBottom: '16px' }}>Update your registered email address:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d4e4', outline: 'none', fontSize: '15px' }}
              />
              <button 
                onClick={handleChangeEmail}
                disabled={submitting}
                className="btn-monday-primary"
                style={{ padding: '0 20px', borderRadius: '8px' }}
              >
                Save
              </button>
            </div>
            <button 
              onClick={() => setIsEditingEmail(false)} 
              style={{ background: 'none', border: 'none', color: '#676879', marginTop: '12px', cursor: 'pointer', fontSize: '13px' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: '40px' }}>
            <p style={{ color: '#676879', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
              A secure verification link has been dispatched to <br />
              <strong style={{ color: '#323338' }}>{user!.email}</strong>. 
              <button 
                onClick={() => setIsEditingEmail(true)}
                style={{ background: 'none', border: 'none', color: '#6161FF', fontWeight: 700, marginLeft: '8px', cursor: 'pointer', fontSize: '14px' }}
              >
                (Change)
              </button>
            </p>
            
            <div style={{ background: '#f5f6f8', borderRadius: '16px', padding: '24px', border: '1px solid #e1e4e8' }}>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: '#323338' }}>Action Required</h4>
              <p style={{ fontSize: '13px', color: '#676879', marginBottom: '20px' }}>Click the link in your email to activate your enterprise workspace. We'll automatically detect your activation.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={handleSendLink}
                  disabled={submitting || verificationSent}
                  style={{ 
                    width: '100%', padding: '12px', background: verificationSent ? '#00c87515' : '#6161FF', 
                    color: verificationSent ? '#00c875' : '#fff', borderRadius: '8px', 
                    fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  {verificationSent ? <><CheckCircle2 size={16} /> Link Sent Successfully</> : <><ExternalLink size={16} /> Resend Verification Link</>}
                </button>

                <div style={{ padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee', textAlign: 'left' }}>
                   <p style={{ fontSize: '12px', color: '#323338', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={14} color="#FDAB3D" /> Didn't get the email?
                   </p>
                   <ul style={{ paddingLeft: '20px', fontSize: '12px', color: '#676879', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>Check your spam or junk folder.</li>
                      <li>Verify your email address above is correct.</li>
                      <li>Wait 5 minutes for delivery or use the manual code below.</li>
                   </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ margin: '32px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#9699a6' }}>OR ENTER CODE MANUALLY</span>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
            {code.map((digit, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{ 
                  width: '56px', height: '64px', borderRadius: '12px', border: '2px solid #d0d4e4', 
                  fontSize: '24px', fontWeight: 700, textAlign: 'center', outline: 'none',
                  transition: 'all 0.2s',
                  background: digit ? '#f5f6f8' : '#fff',
                  borderColor: digit ? '#6161FF' : '#d0d4e4',
                  boxShadow: digit ? '0 0 0 4px #6161FF10' : 'none'
                }}
              />
            ))}
          </div>

          {error && (
            <div style={{ background: '#df2f4a10', color: '#df2f4a', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={submitting || code.join('').length < 6}
            className="btn-monday-primary" 
            style={{ width: '100%', padding: '18px', fontSize: '16px', borderRadius: '12px', marginBottom: '24px' }}
          >
            {submitting ? 'Verifying...' : 'Activate Workspace'}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isSuperAdmin(user?.email) && (
            <div style={{ marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={handleAdminBypass}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', background: '#00c87510', color: '#00c875', border: '1px solid #00c87530',
                    borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px'
                  }}
                >
                  <ShieldAlert size={18} /> Administrative Bypass
                </button>
                <button 
                  onClick={() => setShowDevLog(!showDevLog)}
                  style={{ 
                    padding: '12px', background: '#f5f6f8', color: '#676879', border: '1px solid #d0d4e4',
                    borderRadius: '12px', cursor: 'pointer'
                  }}
                  title="View Delivery Logs"
                >
                  <Terminal size={18} />
                </button>
              </div>

              {showDevLog && (
                <div style={{ 
                  textAlign: 'left', background: '#1a1c2c', color: '#00ff00', padding: '16px', 
                  borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px', overflowX: 'auto',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ opacity: 0.5, marginBottom: '8px' }}>// SYSTEM_DELIVERY_TELEMETRY</div>
                  <div>NATIVE_VERIFIED: {user?.emailVerified ? 'TRUE' : 'FALSE'}</div>
                  <div>INTERNAL_CODE: {generatedCode}</div>
                  <div>TARGET_DESTINATION: {user?.email}</div>
                  <div style={{ marginTop: '8px', color: '#fff', fontSize: '10px', opacity: 0.7 }}>
                    Note: Production email delivery uses Firebase Auth Native Links.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
