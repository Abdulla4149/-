import { google } from '@ai-sdk/google';
import { generateText } from 'ai'; // Меняем импорт!

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing API Key' }), { status: 500 });
    }

    const { messages } = await req.json();

    // Ждем полной генерации ответа
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      system: 'Ты — эксперт по архитектуре ЭВМ. Отвечай кратко и понятно.',
      messages,
    });

    // Возвращаем обычный JSON объект, который легко прочитать фронтенду
    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}