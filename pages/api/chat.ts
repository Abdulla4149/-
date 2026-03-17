export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const { messages } = await req.json();

    // Берем ключ из Vercel. Убедись, что в Vercel он назван OPENROUTER_API_KEY
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Ключ OpenRouter не найден в настройках Vercel' }), { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Эти заголовки желательны для OpenRouter
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "KomekArch AI",
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1",
        "messages": messages,
        "temperature": 0.8,
        "max_tokens": 6000,
        "stream": false // Как ты и просил — без стриминга
      })
    });

    const result = await response.json();

    // OpenRouter возвращает ответ в формате result.choices[0].message.content
    if (result.choices && result.choices[0]) {
      const aiText = result.choices[0].message.content;
      return new Response(JSON.stringify({ text: aiText }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.error('OpenRouter Error:', result);
      return new Response(JSON.stringify({ error: 'Ошибка OpenRouter', details: result }), { status: 500 });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Server Error', details: error.message }), { status: 500 });
  }
}