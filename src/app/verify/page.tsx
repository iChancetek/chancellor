'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, ArrowRight, Mail, Loader2, RefreshCw } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export default function VerifyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      // Generate a code if it doesn't exist for this user in Firestore
      const initVerification = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().emailVerified) {
          router.push('/dashboard');
          return;
        }

        // For this demo, we'll generate it here and "send" it (log it)
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(newCode);
        console.log(`[VERIFICATION CODE FOR ${user.email}]: ${newCode}`);
        
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          verificationCode: newCode,
          emailVerified: false,
          createdAt: new Date().toISOString()
        }, { merge: true });
      };

      initVerification();
    }
  }, [user, loading, router]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
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
          verificationCode: null // Clear code after success
        });
        router.push('/dashboard');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6f8' }}>
        <Loader2 className="animate-spin" size={32} color="#6161FF" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#6161FF15', color: '#6161FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <Mail size={40} />
        </div>
        
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#323338', marginBottom: '16px' }}>Verify your email</h1>
        <p style={{ color: '#676879', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>
          We&apos;ve sent a 6-digit verification code to <br />
          <strong style={{ color: '#323338' }}>{user.email}</strong>. <br />
          Please enter it below to activate your account.
        </p>

        {generatedCode && (
          <div style={{ marginBottom: '32px', padding: '16px', background: '#f5f6f8', borderRadius: '12px', border: '1px solid #e1e4e8', fontSize: '14px', color: '#676879' }}>
            <p><strong>Demo Mode:</strong> Your verification code is <strong>{generatedCode}</strong></p>
          </div>
        )}

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
                  borderColor: digit ? '#6161FF' : '#d0d4e4'
                }}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && <p style={{ color: '#df2f4a', fontSize: '14px', marginBottom: '24px' }}>{error}</p>}

          <button 
            type="submit" 
            disabled={submitting || code.join('').length < 6}
            className="btn-monday-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '12px', marginBottom: '24px' }}
          >
            {submitting ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <p style={{ fontSize: '14px', color: '#676879' }}>
          Didn&apos;t receive the code? 
          <button style={{ background: 'none', border: 'none', color: '#6161FF', fontWeight: 700, marginLeft: '8px', cursor: 'pointer' }}>
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );
}
