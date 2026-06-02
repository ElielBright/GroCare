interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chat(
  messages: OllamaMessage[],
  model: string = 'qwen3-coder:480b-cloud'
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.message.content;
}

export async function generateText(
  prompt: string,
  system?: string,
  model: string = 'qwen3-coder:480b-cloud'
): Promise<string> {
  const messages: OllamaMessage[] = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });
  return chat(messages, model);
}
