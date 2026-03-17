import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { messages, system } = await req.json(); // Получаем сообщения И системную инструкцию

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: system, // Передаем инструкцию в Gemini
      messages,
    });

    // Это самый актуальный метод для новых библиотек в package.json
    return result.toDataStreamResponse(); 
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}