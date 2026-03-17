import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';

function RobotIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 4a2 2 0 0 1 4 0v1h2a3 3 0 0 1 3 3v8a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8a3 3 0 0 1 3-3h2V4Z"
        className="fill-white/10"
      />
      <path
        d="M10 5V4a2 2 0 0 1 4 0v1"
        className="stroke-white/70"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 5h8a3 3 0 0 1 3 3v8a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8a3 3 0 0 1 3-3h2V4Z"
        className="stroke-white/70"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 10.5h9"
        className="stroke-white/25"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 13.25a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
        className="fill-white/80"
      />
      <path
        d="M15 13.25a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
        className="fill-white/80"
      />
      <path
        d="M10 16.5h4"
        className="stroke-white/60"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AiAssistant() {
  const systemPrompt =
    'Ты — KomekArch AI, эксперт по архитектуре ЭВМ. Помогай студентам разбираться в темах процессоров, памяти, кэшей, ISA, конвейеров и параллельных вычислений. Отвечай кратко, понятно и на языке пользователя. Если уместно — давай маленький пример и проверочный вопрос.';

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'greeting-1',
        role: 'assistant',
        content:
          'Привет! Я KomekArch AI. Спроси меня про процессоры, память, кэш, ISA, конвейеры или параллельность — объясню простыми словами.',
      },
    ],
    body: { system: systemPrompt },
  });

  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const suggestions = useMemo(
    () => [
      'Что такое конвейер (pipeline) простыми словами?',
      'Почему кэш иерархия так ускоряет CPU?',
      'Объясни разницу между SRAM и DRAM.',
      'Как связаны ISA и микроархитектура?',
    ],
    [],
  );

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [isOpen, messages.length]);

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 shadow-xl ring-1 ring-white/10 hover:shadow-2xl transition"
          aria-label="Открыть AI‑помощника"
        >
          <RobotIcon className="h-9 w-9 mx-auto text-white" />
          <span className="absolute -top-2 -left-2 inline-flex h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
        </button>
      ) : (
        <div className="w-[min(92vw,420px)] h-[min(72vh,560px)] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
                <RobotIcon className="h-6 w-6" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold">AI‑помощник</div>
                <div className="text-xs text-slate-300">KomekArch • демо‑чат</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              Закрыть
            </button>
          </div>

          <div ref={listRef} className="px-4 py-4 space-y-3 overflow-y-auto h-[calc(100%-164px)]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ring-1 ${
                    m.role === 'user'
                      ? 'bg-indigo-500/20 ring-indigo-400/30 text-slate-50'
                      : 'bg-white/5 ring-white/10 text-slate-100'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex gap-2 items-end">
              <form onSubmit={handleSubmit} className="flex gap-2 items-end w-full">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!input.trim()) return;
                      // submit via form handler
                      (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit?.();
                    }
                  }}
                  rows={2}
                  placeholder="Напиши вопрос… (Enter — отправить, Shift+Enter — новая строка)"
                  className="flex-1 resize-none rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400/40 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-11 px-4 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed ring-1 ring-indigo-400/30 text-indigo-100 font-semibold text-sm transition"
                >
                  Отправить
                </button>
              </form>
            </div>
            {error && (
              <div className="mt-2 text-xs text-rose-300">
                Ошибка: {error.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}