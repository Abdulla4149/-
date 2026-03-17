import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const { messages, system } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: system || 'You are a helpful assistant',
    messages,
  });

  // Если toDataStreamResponse не работает, используем старый добрый метод
  return result.toAIStreamResponse();
}