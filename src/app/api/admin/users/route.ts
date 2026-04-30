import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin not initialized.' }, { status: 500 });
  }

  try {
    const { email, password, displayName, role, department, team } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create in Firebase Auth
    let userRecord;
    try {
      if (adminAuth) {
        userRecord = await adminAuth.createUser({
          email,
          password,
          displayName,
        });
      } else {
        return NextResponse.json({ error: 'Firebase Admin not initialized. Cannot create auth user.' }, { status: 500 });
      }
    } catch (authErr: any) {
      return NextResponse.json({ error: `Auth Error: ${authErr.message}` }, { status: 400 });
    }

    // 2. Create in Firestore
    const newUser = {
      uid: userRecord.uid,
      email,
      displayName,
      photoURL: null,
      role: role || 'member',
      department: department || null,
      team: team || null,
      isDisabled: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await adminDb.collection('users').doc(userRecord.uid).set(newUser);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin not initialized.' }, { status: 500 });
  }

  try {
    const { uid, action, payload } = await req.json();

    if (!uid || !action) {
      return NextResponse.json({ error: 'Missing uid or action' }, { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(uid);

    switch (action) {
      case 'disable':
        if (adminAuth) await adminAuth.updateUser(uid, { disabled: true });
        await userRef.update({ isDisabled: true, updatedAt: Date.now() });
        break;

      case 'enable':
        if (adminAuth) await adminAuth.updateUser(uid, { disabled: false });
        await userRef.update({ isDisabled: false, updatedAt: Date.now() });
        break;

      case 'change_password':
        if (!payload?.password) {
          return NextResponse.json({ error: 'Missing password payload' }, { status: 400 });
        }
        if (adminAuth) {
          await adminAuth.updateUser(uid, { password: payload.password });
        } else {
          return NextResponse.json({ error: 'Firebase Admin not initialized. Cannot change password.' }, { status: 500 });
        }
        break;

      case 'change_role':
      case 'update_details':
        await userRef.update({ ...payload, updatedAt: Date.now() });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
