import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages, system } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages: await convertToModelMessages([
        ...(system ? [{ role: 'system', content: system }] : []),
        ...(messages ?? []),
      ]),
    });

    // Возвращаем UI-стрим, совместимый с useChat.
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}