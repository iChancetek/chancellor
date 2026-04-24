import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'OpenAI API key missing' }, { status: 500 });

  const openai = new OpenAI({ apiKey });

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error('Whisper STT Error:', error);
    return NextResponse.json({ error: 'Transcription failed', details: error.message }, { status: 500 });
  }
}
