export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const { messages } = await req.json();
    // Пробуем достать ключ. Тщательно проверь это имя в Vercel!
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ text: "DEBUG: Ключ не найден в Vercel. Проверь имя переменной!" }), { status: 200 });
    }

    const prompt = messages[messages.length - 1]?.content || "Привет";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`,
        "HTTP-Referer": "https://komek-arch.vercel.app", 
        "X-Title": "KomekArch",
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1",
        "messages": [{ "role": "user", "content": prompt }],
        "temperature": 0.8,
        "max_tokens": 6000
      })
    });

    const result = await response.json();

    if (result.choices && result.choices[0]) {
      return new Response(JSON.stringify({ text: result.choices[0].message.content }), { status: 200 });
    } else {
      // Это покажет реальную ошибку от OpenRouter
      return new Response(JSON.stringify({ text: `OPENROUTER_ERROR: ${JSON.stringify(result)}` }), { status: 200 });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ text: `FATAL_ERROR: ${error.message}` }), { status: 200 });
  }
}