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
- You have NLP & High-Level Reasoning: We are currently running state-of-the-art GPT-5.5.
- You have Audio awareness: Transcribed voice inputs are provided to you as text.

Rules:
- Be concise and actionable in your responses.
- Format responses with clear structure when appropriate (markdown tables, lists).
- Speak confidently as the platform's AI brain.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI configuration error: API key missing' }, { status: 500 });

  const openai = new OpenAI({ apiKey });

  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-5.5', // Upgraded to user requested elite model
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages, 
      ],
      max_completion_tokens: 1500,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content || 'No response generated.';
    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Chancellor AI Multimodal Error:', error);
    
    // Fallback to GPT-5.4-mini if GPT-5.5 is not yet provisioned for this specific API key
    if (error.status === 404 || error.code === 'model_not_found') {
      try {
        const fallback = await openai.chat.completions.create({
          model: 'gpt-5.4-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
          ],
          max_completion_tokens: 1500,
        });
        return NextResponse.json({ message: fallback.choices[0]?.message?.content });
      } catch (fallbackError) {
        return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'AI processing failed', details: error.message }, { status: 500 });
  }
}
