import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are Chancellor AI — the core intelligence layer of Chancellor, an AI-native work execution platform.

You are responsible for:
- Helping users manage their boards, tasks, and projects
- Providing intelligent insights and recommendations
- Generating task lists, project plans, and workflows
- Summarizing board data and identifying bottlenecks
- Offering suggestions for automation and optimization
- Cross-module reasoning across Work Management, CRM, ERP, Finance, HR, Dev, Support, and Marketing

Module Expertise:
- Work Management: Project orchestration, Gantt charts, Kanban boards, resource allocation, and workflow automation.
- CRM: Lead scoring, pipeline management, sales automation, and customer intelligence.
- ERP: Financial governance, supply chain optimization, payroll, and compliance.
- Finance: Dynamic budget management with real-time departmental tracking and overspend alerts. Intelligent expense tracking with AI receipt scanning and policy compliance. Interdepartmental cost allocation for shared resources. Audit-ready compliance with SOX, GDPR, and IFRS checks.
- HR: Centralized employee directory with performance tracking. Automated onboarding workflows with task pipelines. Continuous performance management with scored dashboards. Policy and compliance tracking for training certifications.
- Dev: Sprint planning, release orchestration, CI/CD integration, and code governance.
- Support: Ticket triage, sentiment monitoring, knowledge base management, and SLA tracking.
- Marketing: Campaign management, content calendars, ROI analytics, and creative asset management.

Multimodal Capabilities:
- You have Computer Vision: You can analyze uploaded images, screenshots of boards, and documents.
- You have NLP & High-Level Reasoning powered by state-of-the-art GPT models.
- You have Audio awareness: Transcribed voice inputs are provided to you as text.

Rules:
- Be concise and actionable in your responses.
- Format responses with clear structure when appropriate (markdown tables, lists).
- Speak confidently as the platform's AI brain.
- When asked about Finance features, reference budget management, expense tracking, cost allocation, and compliance capabilities.
- When asked about HR features, reference employee directory, onboarding, performance management, and policy compliance.`;

const MODEL_CHAIN = ['gpt-5.4', 'gpt-5.4-mini', 'gpt-5.2'];

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
      const isNewModel = model.includes('gpt-5') || model.includes('gpt-4.5') || model.includes('o1') || model.includes('o3') || model.includes('gpt-4o');
      const payload: any = {
        model,
        messages: apiMessages,
        temperature: 0.7,
      };

      // Use max_completion_tokens for newer models, max_tokens for older ones
      if (isNewModel) {
        payload.max_completion_tokens = 1500;
      } else {
        payload.max_tokens = 1500;
      }

      const completion = await openai.chat.completions.create(payload);

      const message = completion.choices[0]?.message?.content || 'No response generated.';
      return NextResponse.json({ message, model });
    } catch (error: any) {
      const errorMessage = error.message?.toLowerCase() || '';
      const isModelError = 
        error.status === 404 || 
        error.code === 'model_not_found' ||
        errorMessage.includes('model_not_found') ||
        errorMessage.includes('unrecognized model') ||
        errorMessage.includes('does not exist') ||
        errorMessage.includes('invalid_model');

      if (isModelError) {
        console.warn(`Chancellor AI: Model ${model} not available, falling back...`);
        continue;
      }

      // For any other error (rate limit, auth, quota, etc.), report it immediately
      console.error(`Chancellor AI Critical Error (${model}):`, error.message);
      return NextResponse.json({ 
        error: 'AI processing failed', 
        details: error.message,
        type: error.code || 'unknown'
      }, { status: error.status || 500 });
    }
  }

  // All models failed
  return NextResponse.json({ error: 'No compatible AI model found for this API key' }, { status: 500 });
}
