// export const config = { runtime: 'edge' };

// export default async function handler(req: Request) {
//   try {
//     const { messages } = await req.json();
//     const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

//     if (!apiKey) {
//       return new Response(JSON.stringify({ error: 'API ключ не найден в Vercel' }), { status: 500 });
//     }

//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${apiKey.trim()}`, // Убираем возможные пробелы
//         "Content-Type": "application/json",
//         "HTTP-Referer": "https://komekarch.vercel.app", 
//         "X-Title": "KomekArch AI",
//       },
//       body: JSON.stringify({
//         "model": "deepseek/deepseek-r1",
//         "messages": messages,
//         "temperature": 0.7,
//         "max_tokens": 4000
//       })
//     });

//     const result = await response.json();

//     // Если OpenRouter вернул ошибку в своем JSON
//     if (result.error) {
//       return new Response(JSON.stringify({ 
//         error: `OpenRouter: ${result.error.message || 'Неизвестная ошибка'}` 
//       }), { status: 500 });
//     }

//     if (result.choices && result.choices[0]) {
//       return new Response(JSON.stringify({ text: result.choices[0].message.content }), {
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     return new Response(JSON.stringify({ error: 'Пустой ответ от модели' }), { status: 500 });

//   } catch (error: any) {
//     return new Response(JSON.stringify({ error: 'Server Error', details: error.message }), { status: 500 });
//   }
// }



export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ text: "ОШИБКА: Переменная OPENROUTER_API_KEY пуста в Vercel!" }), { status: 200 });
    }

    // Находим последнее сообщение в массиве, который пришел с фронтенда
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1",
        "messages": [
          {
            "role": "user",
            "content": lastUserMessage // Это аналог твоего $prompt в PHP
          }
        ],
        "temperature": 0.8,
        "max_tokens": 6000
      })
    });

    const result = await response.json();

    // Если всё ок — выводим текст. Если нет — выводим ВЕСЬ JSON ошибки в чат.
    if (result.choices && result.choices[0]) {
      return new Response(JSON.stringify({ text: result.choices[0].message.content }), { status: 200 });
    } else {
      // Это выведет сырой JSON ошибки прямо в интерфейс чата
      return new Response(JSON.stringify({ text: `DEBUG LOG: ${JSON.stringify(result)}` }), { status: 200 });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ text: `CATCH ERROR: ${error.message}` }), { status: 200 });
  }
}