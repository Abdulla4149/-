import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    
    // const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const apiKey = "AIzaSyCOI9XyViRVQ5Y-XBeSl77qDroSKkXFgn0";

    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key missing in Vercel settings' }), { status: 500 });
    }

    const { messages } = await req.json();

    const { text } = await generateText({
      // Использование 'gemini-1.5-flash-latest' часто решает проблему v1beta
      model: google('gemini-1.5-flash-latest'), 
      system: 'Ты — эксперт по архитектуре ЭВМ. Отвечай на русском языке.',
      messages,
    });

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Gemini Error:', error);
    
    // Если flash всё равно не найден, попробуй вручную в коде заменить на 'gemini-1.5-pro'
    return new Response(JSON.stringify({ 
      error: 'Ошибка модели', 
      details: error.message 
    }), { status: 500 });
  }
}