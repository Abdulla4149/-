import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Привет! Я твой ИИ-помощник по архитектуре ЭВМ. Чем помочь?' }
    ],
  });

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
      >
        {isOpen ? 'Закрыть ИИ' : 'Чат с ИИ'}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-900 p-3 text-white text-sm font-bold">KomekArch AI</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-800 text-sm">
            {messages.map(m => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                  {m.content}
                </span>
              </div>
            ))}
            {isLoading && <div className="text-xs text-slate-400">ИИ думает...</div>}
            {error && <div className="text-xs text-red-500">Ошибка: {error.message}</div>}
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Спроси что-нибудь..."
              className="flex-1 text-sm border rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
            <button type="submit" disabled={isLoading} className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm">
              Отправить
            </button>
          </form>
        </div>
      )}
    </div>
  );
}