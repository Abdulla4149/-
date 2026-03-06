import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Оставляем Edge, он у тебя работает
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // В Pages Router Edge Runtime метод проверяется так:
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}