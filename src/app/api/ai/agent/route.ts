import { OpenAI } from 'openai';
import { Agent, run } from '@openai/agents';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Tools Definition ──────────────────────────────────────

const getWorkspaceData = {
  name: 'get_workspace_data',
  description: 'Get current workspace boards and status.',
  parameters: z.object({}),
  run: async () => {
    // In a real app, this would fetch from Firestore/DB
    return { 
      boardsCount: 12, 
      activeDeals: 5, 
      revenueForecast: '$120,000',
      stalledLeads: ['Acme Corp', 'Globex']
    };
  }
};

const updateItemStatus = {
  name: 'update_item_status',
  description: 'Update the status of a specific item or deal.',
  parameters: z.object({
    itemId: z.string(),
    newStatus: z.string(),
    reason: z.string()
  }),
  run: async ({ itemId, newStatus, reason }: { itemId: string, newStatus: string, reason: string }) => {
    return { success: true, message: `Updated item ${itemId} to ${newStatus}. Reason: ${reason}` };
  }
};

// ── Agents Definition ─────────────────────────────────────

const salesAgent = new Agent({
  name: 'Sales Intelligence',
  instructions: `
    You are the Sales Intelligence Agent for ChancellorOS. 
    Your goal is to optimize the sales pipeline. 
    You have access to workspace data and can update item statuses.
    If you identify a financial risk, hand off to the CFO Agent.
  `,
  tools: [getWorkspaceData, updateItemStatus],
});

const cfoAgent = new Agent({
  name: 'CFO Intelligence',
  instructions: `
    You are the CFO Agent for ChancellorOS.
    You handle high-level financial strategy and risk assessment.
    Only you can approve budgets over $5000.
  `,
  tools: [getWorkspaceData],
});

const financeAgent = new Agent({
  name: 'Finance Controller',
  instructions: `
    You are the Finance Controller.
    You handle ledger reconciliation and cash flow reporting.
  `,
  tools: [getWorkspaceData],
});

// ── Handoffs ─────────────────────────────────────────────

salesAgent.addHandoff(cfoAgent, {
  condition: 'The user asks about financial risks, budget approvals, or high-level fiscal strategy.'
});

// ── API Route Handler ────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { prompt, agentId, sessionId } = await req.json();

    // Select the starting agent
    let startingAgent = salesAgent;
    if (agentId === 'cfo-agent-1') startingAgent = cfoAgent;
    if (agentId === 'finance-agent-1') startingAgent = financeAgent;

    const result = await run(startingAgent, prompt, {
      // tracin: true, // Enable if using LangSmith or similar
    });

    return NextResponse.json({
      output: result.finalOutput,
      steps: result.steps.map(s => ({
        type: s.type,
        content: s.content,
        toolCalls: s.toolCalls,
        agentName: s.agentName,
        timestamp: Date.now()
      }))
    });
  } catch (error: any) {
    console.error('Agent Runtime Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
