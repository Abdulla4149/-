// import { google } from '@ai-sdk/google';
// import { generateText } from 'ai'; // Меняем импорт!

// export const config = { runtime: 'edge' };

// export default async function handler(req: Request) {
//   try {
//     if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
//       return new Response(JSON.stringify({ error: 'Missing API Key' }), { status: 500 });
//     }

//     const { messages } = await req.json();

//     // Ждем полной генерации ответа
//     const { text } = await generateText({
//       model: google('gemini-1.5-flash'),
//       system: 'Ты — эксперт по архитектуре ЭВМ. Отвечай кратко и понятно.',
//       messages,
//     });

//     // Возвращаем обычный JSON объект, который легко прочитать фронтенду
//     return new Response(JSON.stringify({ text }), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error: any) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }



import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Ключ API не найден в Vercel' }), { status: 500 });
    }

    const { messages } = await req.json();

    const { text } = await generateText({
      // Мы явно указываем модель. Если flash не находит, попробуем gemini-1.5-pro
      model: google('models/gemini-1.5-flash'), 
      system: 'Ты — эксперт по архитектуре ЭВМ. Отвечай кратко.',
      messages,
    });

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Ошибка Gemini:', error);
    return new Response(JSON.stringify({ 
      error: 'Ошибка модели. Попробуй позже.',
      details: error.message 
    }), { status: 500 });
  }
}