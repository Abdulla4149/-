import type { NextApiRequest, NextApiResponse } from 'next';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return res.status(500).json({ error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY' });
  }

  try {
    const { messages } = req.body as {
      messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
    };

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
    });

    await result.toAIStreamResponse({
      headers: {
        'Cache-Control': 'no-store',
      },
    }).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating response' });
  }
}

