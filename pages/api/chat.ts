export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const { messages } = await req.json();
    
    // ПРОВЕРКА: Если ты в Vercel назвал переменную по-другому, 
    // поменяй название тут. Например, на DEEPSEEK_AI_API_KEY
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_AI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ text: "DEBUG: API Key не найден в Vercel!" }), { status: 200 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "Привет";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`,
        // OpenRouter ТРЕБУЕТ эти заголовки, чтобы не выдавать 401 "User not found"
        "HTTP-Referer": "https://komek-arch.vercel.app", 
        "X-Title": "KomekArch",
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1",
        "messages": [
          { "role": "user", "content": lastUserMessage }
        ],
        "temperature": 0.8,
        "max_tokens": 6000,
        "frequency_penalty": 0,
        "stream": false
      })
    });

    const result = await response.json();

    // Если всё ок — отдаем текст. Если нет — детальный лог ошибки.
    if (result.choices && result.choices[0]) {
      return new Response(JSON.stringify({ text: result.choices[0].message.content }), { status: 200 });
    } else {
      // Если опять будет "User not found", мы увидим это здесь
      return new Response(JSON.stringify({ text: `OPENROUTER_ERROR: ${JSON.stringify(result)}` }), { status: 200 });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ text: `FATAL_ERROR: ${error.message}` }), { status: 200 });
  }
}