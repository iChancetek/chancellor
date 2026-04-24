import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are Chancellor AI — the core intelligence layer of Chancellor, an AI-native work execution platform.

You are responsible for:
- Helping users manage their boards, tasks, and projects
- Providing intelligent insights and recommendations
- Generating task lists, project plans, and workflows
- Summarizing board data and identifying bottlenecks
- Offering suggestions for automation and optimization
- Cross-module reasoning across Work Management, CRM, Dev, Support, and Marketing

Rules:
- Be concise and actionable in your responses
- Format responses with clear structure when appropriate
- Always prioritize the user's workflow efficiency
- Speak confidently as the platform's AI brain
- Use emojis sparingly for visual clarity`;

export async function POST(req: NextRequest) {
  // Handle potential leading space in key name from Firebase Console
  const apiKey = process.env.OPENAI_API_KEY || (process.env as any)[' OPENAI_API_KEY'];
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI configuration error: API key missing' },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey });

  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-5.4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-20), // Keep last 20 messages for context
      ],
      max_completion_tokens: 1000,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ message });
  } catch (error: unknown) {
    console.error('Chancellor AI Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'AI processing failed', details: errorMessage },
      { status: 500 }
    );
  }
}
