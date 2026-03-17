import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    // Обязательно добавляем проверку на ошибки в консоль
    onError: (err) => console.error("Chat Error:", err),
  });

  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl hover:scale-105 transition-all active:scale-95 font-bold"
      >
        {isOpen ? 'Закрыть чат' : 'Чат с ИИ'}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-slate-950 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/20">
          <div className="bg-slate-900 p-4 border-b border-white/10 text-white font-bold flex justify-between items-center">
            <span>KomekArch AI</span>
            <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
            {messages.length === 0 && (
              <div className="text-slate-500 text-center text-sm mt-10">
                Спроси меня что-нибудь об архитектуре ЭВМ!
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-100'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {error && (
              <div className="text-[10px] text-red-400 bg-red-400/10 p-2 rounded-lg">
                Ошибка: {error.message}
              </div>
            )}
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault(); // КРИТИЧЕСКИ ВАЖНО: останавливает краш страницы
              handleSubmit(e);
            }} 
            className="p-4 bg-slate-900 border-t border-white/10 flex gap-2"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Введите сообщение..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}