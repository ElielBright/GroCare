import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_ENDPOINT = process.env.NEXT_PUBLIC_OLLAMA_ENDPOINT || 'https://ollama.com/api';
const OLLAMA_API_KEY = process.env.NEXT_PUBLIC_OLLAMA_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { model, messages } = await req.json();

    const res = await fetch(`${OLLAMA_ENDPOINT}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
      },
      body: JSON.stringify({ model, messages, stream: false }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Ollama API error (${res.status}): ${text}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
