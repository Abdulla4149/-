export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API ключ не найден в Vercel' }), { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`, // Убираем возможные пробелы
        "Content-Type": "application/json",
        "HTTP-Referer": "https://komekarch.vercel.app", 
        "X-Title": "KomekArch AI",
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 4000
      })
    });

    const result = await response.json();

    // Если OpenRouter вернул ошибку в своем JSON
    if (result.error) {
      return new Response(JSON.stringify({ 
        error: `OpenRouter: ${result.error.message || 'Неизвестная ошибка'}` 
      }), { status: 500 });
    }

    if (result.choices && result.choices[0]) {
      return new Response(JSON.stringify({ text: result.choices[0].message.content }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Пустой ответ от модели' }), { status: 500 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Server Error', details: error.message }), { status: 500 });
  }
}