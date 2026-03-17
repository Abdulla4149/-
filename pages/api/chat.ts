import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: 'Ты — эксперт по архитектуре ЭВМ. Отвечай кратко и по делу.',
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}