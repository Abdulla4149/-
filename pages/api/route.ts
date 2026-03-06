import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Конфигурация для работы в папке pages/api
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // Проверяем, что это POST запрос
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response('Error thinking...', { status: 500 });
  }
}