import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are the ChancellorOS Agentic Command Controller. 
Your goal is to translate natural language user commands into structured JSON actions for a Work OS platform (Chancellor).

Platform Capabilities:
- Create Boards (type: work, crm, erp, dev, marketing, support)
- Create Items on a board
- Update Item Status/Priority
- Generate Reports/Summaries
- Find Information (Search)

You must return a JSON object with the following structure:
{
  "reasoning": "Explain your thought process briefly",
  "actions": [
    {
      "type": "CREATE_BOARD",
      "params": { "name": "Project Alpha", "boardType": "work" }
    },
    {
      "type": "CREATE_ITEM",
      "params": { "boardId": "target_board_id", "name": "Task Name" }
    },
    {
      "type": "NAVIGATE",
      "params": { "path": "/dashboard/crm" }
    },
    {
      "type": "AI_RESPONSE",
      "params": { "message": "A textual response to the user" }
    }
  ],
  "confidence": 0.0 to 1.0
}

Context:
- If the user asks to "Build" or "Create" a project, use CREATE_BOARD.
- If they ask a general question, use AI_RESPONSE.
- If they want to see a specific module, use NAVIGATE.

Be elite. Be precise. No placeholders.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API key missing' }, { status: 500 });

  const openai = new OpenAI({ apiKey });
  const { command, context } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Command: ${command}\nContext: ${JSON.stringify(context)}` }
      ],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Command API Error:', error);
    return NextResponse.json({ error: 'Failed to process command' }, { status: 500 });
  }
}
