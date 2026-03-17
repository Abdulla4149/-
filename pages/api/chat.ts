import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const { messages, system } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: system || 'You are a helpful assistant',
      messages,
    });

    // Используем этот метод, так как у тебя теперь стоят последние версии SDK
    return result.toDataStreamResponse(); 
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}