import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'OpenAI API key missing' }, { status: 500 });

  const openai = new OpenAI({ apiKey });

  try {
    const { text, voice = 'onyx' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: voice as any,
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('OpenAI TTS Error:', error);
    return NextResponse.json({ error: 'Text-to-speech failed', details: error.message }, { status: 500 });
  }
}
