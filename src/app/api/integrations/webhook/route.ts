import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';

/**
 * Chancellor Universal Webhook Receiver
 * Handles incoming data from Slack, GitHub, Zapier, etc.
 * and converts them into Chancellor Board Items.
 */
export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const boardId = searchParams.get('boardId');
    const groupId = searchParams.get('groupId');
    const source = searchParams.get('source') || 'webhook';

    if (!boardId || !groupId) {
      return NextResponse.json({ error: 'Missing boardId or groupId' }, { status: 400 });
    }

    const payload = await req.json();
    let itemName = 'New Integration Item';
    let itemValues: Record<string, any> = {};

    // ── Source-Specific Parsing ──────────────────────────
    
    if (source === 'github') {
      // Handle GitHub Issue/PR
      itemName = payload.issue?.title || payload.pull_request?.title || 'GitHub Update';
      itemValues.status = 'working';
      itemValues.link = payload.issue?.html_url || payload.pull_request?.html_url;
    } else if (source === 'slack') {
      // Handle Slack Message
      itemName = payload.text?.substring(0, 50) || 'Slack Notification';
      itemValues.notes = payload.text;
    } else if (source === 'zapier' || source === 'make') {
      // Direct mapping
      itemName = payload.name || payload.title || 'Zapier Task';
      itemValues = payload.values || {};
    } else {
      // Generic fallback
      itemName = payload.name || payload.title || payload.text || 'Incoming Sync';
    }

    // In a real app, we would write to Firestore here using Admin SDK
    // For now, we return the structured item for the frontend to handle or log
    console.log(`[Integration] Received ${source} sync for board ${boardId}:`, itemName);

    return NextResponse.json({ 
      success: true, 
      item: {
        id: generateId(),
        boardId,
        groupId,
        name: itemName,
        values: itemValues,
        createdAt: Date.now(),
      }
    });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
