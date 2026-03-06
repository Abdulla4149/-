import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const config = {
  runtime: 'edge',
};

// Используем стандартные параметры для Pages Router
export default async function handler(req: any) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    messages,
  });

  return result.toDataStreamResponse();
}