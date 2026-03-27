import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
 
export const runtime = "nodejs";

type ChatMessage = {
  role: string;
  content: string;
};

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];

    const lastUserMessage = messages[messages.length - 1];
    const prompt = typeof lastUserMessage?.content === "string" ? lastUserMessage.content : "";

    if (!prompt) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // 1) Сохраняем сообщение пользователя
    await prisma.message.create({
      data: {
        userId,
        role: "user",
        content: prompt,
      },
    });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not set" },
        { status: 500 }
      );
    }

    // 2) Запрашиваем ответ у ИИ
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
        "HTTP-Referer": "https://komek-arch.vercel.app",
        "X-Title": "KomekArch",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 6000,
      }),
    });

    const result = await response.json();
    const text =
      result?.choices?.[0]?.message?.content ??
      null;

    if (!text) {
      return NextResponse.json(
        { error: "AI returned empty response", raw: result },
        { status: 500 }
      );
    }

    // 3) Сохраняем ответ ассистента
    await prisma.message.create({
      data: {
        userId,
        role: "assistant",
        content: text,
      },
    });

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json(
      { error: `FATAL_ERROR: ${err?.message ?? "Unknown error"}` },
      { status: 500 }
    );
  }
}

