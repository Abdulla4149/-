import React, { useEffect, useMemo, useRef } from 'react';
import { useChat } from 'ai/react';
 
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
        d="M8 5h8a3 3 0 0 1 3 3v8a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8a3 3 0 0 1 3-3Z"
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
  const {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'system-1',
        role: 'system',
        content:
          'Ты — KomekArch AI, эксперт по архитектуре ЭВМ. Помогай студентам разбираться в темах процессоров, памяти и ввода-вывода. Отвечай кратко, понятно и на языке пользователя.',
      },
      {
        id: 'greeting-1',
        role: 'assistant',
        content:
          'Привет! Я KomekArch AI. Спроси меня про процессоры, память, кэш или ввод-вывод — объясню простыми словами.',
      },
    ],
  });

  const [isOpen, setIsOpen] = React.useState(false);
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
          <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900/90 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition">
            Спроси меня про CPU и память
          </span>
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition"
                aria-label="Закрыть чат"
              >
                Закрыть
              </button>
            </div>
          </div>

          <div ref={listRef} className="px-4 py-4 space-y-3 overflow-y-auto h-[calc(100%-164px)]">
            {messages
              .filter((m) => m.role !== 'system')
              .map((m) => (
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

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-white/5 ring-1 ring-white/10 text-slate-200">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300/80 animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300/60 animate-pulse [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300/40 animate-pulse [animation-delay:240ms]" />
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <div className="text-[11px] text-slate-400 mb-2">Быстрые вопросы:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setInput(s)}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex gap-2 items-end">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!input.trim()) return;
                  handleSubmit(e);
                }}
                className="flex gap-2 items-end w-full"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!input.trim()) return;
                      handleSubmit(e as any);
                    }
                  }}
                  rows={2}
                  placeholder="Напиши вопрос… (Enter — отправить, Shift+Enter — новая строка)"
                  className="flex-1 resize-none rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400/40 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 px-4 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed ring-1 ring-indigo-400/30 text-indigo-100 font-semibold text-sm transition"
                >
                  Отправить
                </button>
              </form>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Работает через Gemini API. Не отправляйте в чат пароли и персональные данные.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

