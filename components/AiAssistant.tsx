import React, { useEffect, useMemo, useRef, useState } from 'react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

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
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: 'assistant',
      text:
        'Привет! Я AI‑помощник KomekArch. Спроси меня про CPU, память, кэш или конвейеризацию — объясню простыми словами и дам мини‑задачи.',
      createdAt: Date.now(),
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const suggestions = useMemo(
    () => [
      'Что такое конвейер (pipeline) простыми словами?',
      'Почему кэш ускоряет программу?',
      'В чём разница SRAM и DRAM?',
      'Объясни ISA и микроархитектуру',
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
  }, [isOpen, messages.length, isTyping]);

  function addUserMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: 'user', text, createdAt: Date.now() },
    ]);
  }

  function addAssistantMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: 'assistant', text, createdAt: Date.now() },
    ]);
  }

  function generateDemoAnswer(question: string) {
    const q = question.toLowerCase();
    if (q.includes('кэш') || q.includes('cache')) {
      return (
        'Кэш — это быстрая память рядом с ядром CPU. Он хранит копии “горячих” данных из RAM, чтобы не ждать медленный доступ.\n\n' +
        'Мини‑проверка: локальность бывает двух типов — временная и пространственная. Можешь привести по одному примеру?'
      );
    }
    if (q.includes('конвей') || q.includes('pipeline')) {
      return (
        'Конвейеризация — это разделение выполнения инструкции на стадии (например: fetch → decode → execute → mem → writeback), чтобы разные инструкции обрабатывались параллельно на разных стадиях.\n\n' +
        'Частая проблема — hazards (data/control). Хочешь разберём forwarding vs stall на примере?'
      );
    }
    if (q.includes('dram') || q.includes('sram') || q.includes('памят')) {
      return (
        'SRAM быстрее и дороже (обычно кэши), DRAM медленнее и дешевле (обычно оперативная память).\n\n' +
        'Вопрос: почему DRAM “нужно обновлять” (refresh), а SRAM — нет?'
      );
    }
    if (q.includes('isa') || q.includes('микроарх')) {
      return (
        'ISA — “контракт” между программой и процессором: какие есть инструкции, регистры, режимы адресации.\n' +
        'Микроархитектура — как именно конкретный CPU реализует эту ISA (конвейер, кэш, предсказание переходов и т.д.).\n\n' +
        'Если хочешь — назови ISA (x86-64, ARM, RISC‑V), и я дам короткий маршрут изучения.'
      );
    }
    return (
      'Понял вопрос. Сейчас у нас демо‑режим без подключения к настоящему ИИ API, но я могу объяснять темы и давать упражнения.\n\n' +
      'Подсказка: спроси “объясни на примере” или “дай задачу на 5 минут” — так обучение быстрее.'
    );
  }

  function send(textRaw: string) {
    const text = textRaw.trim();
    if (!text) return;
    addUserMessage(text);
    setInput('');
    setIsTyping(true);

    window.setTimeout(() => {
      addAssistantMessage(generateDemoAnswer(text));
      setIsTyping(false);
    }, 600);
  }

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
                onClick={() => setMessages((prev) => prev.slice(0, 1))}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition"
              >
                Очистить
              </button>
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
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
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
                    onClick={() => send(s)}
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
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={2}
                placeholder="Напиши вопрос… (Enter — отправить, Shift+Enter — новая строка)"
                className="flex-1 resize-none rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400/40 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => send(input)}
                className="h-11 px-4 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 ring-1 ring-indigo-400/30 text-indigo-100 font-semibold text-sm transition"
              >
                Отправить
              </button>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Демо‑режим: ответы генерируются локально. Позже подключим настоящий AI API.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

