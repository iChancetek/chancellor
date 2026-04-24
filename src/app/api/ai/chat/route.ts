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

Multimodal Capabilities:
- You have Computer Vision: You can analyze uploaded images, screenshots of boards, and documents.
- You have NLP & High-Level Reasoning powered by state-of-the-art GPT models.
- You have Audio awareness: Transcribed voice inputs are provided to you as text.

Rules:
- Be concise and actionable in your responses.
- Format responses with clear structure when appropriate (markdown tables, lists).
- Speak confidently as the platform's AI brain.`;

// Model fallback chain — tries the best available model for this API key
const MODEL_CHAIN = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'];

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI configuration error: API key missing' }, { status: 500 });

  const openai = new OpenAI({ apiKey });

  let messages: any[] = [];

  try {
    const json = await req.json();
    messages = json.messages || [];
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const apiMessages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...messages,
  ];

  // Try each model in the chain until one works
  for (const model of MODEL_CHAIN) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: apiMessages,
        max_completion_tokens: 1500,
        temperature: 0.7,
      });

      const message = completion.choices[0]?.message?.content || 'No response generated.';
      return NextResponse.json({ message, model });
    } catch (error: any) {
      // If the model doesn't exist, try the next one
      if (error.status === 404 || error.code === 'model_not_found') {
        continue;
      }
      // For any other error (rate limit, auth, etc.), report it
      console.error(`Chancellor AI Error (${model}):`, error.message);
      return NextResponse.json({ error: 'AI processing failed', details: error.message }, { status: 500 });
    }
  }

  // All models failed
  return NextResponse.json({ error: 'No compatible AI model found for this API key' }, { status: 500 });
}
