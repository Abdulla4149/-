import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [
      { 
        id: '1', 
        role: 'assistant', 
        content: 'Привет! Я KomekArch AI. Спроси меня про процессоры, память или конвейеры — объясню простыми словами.' 
      }
    ],
  });

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {/* Кнопка открытия/закрытия */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95"
      >
        {isOpen ? (
          <span className="font-bold">Закрыть</span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-bold">Чат с ИИ</span>
          </div>
        )}
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-slate-950 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
          {/* Шапка */}
          <div className="bg-slate-900 p-4 border-b border-white/10 text-white font-bold flex justify-between items-center">
            <span>KomekArch AI</span>
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>

          {/* Область сообщений */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 to-slate-900">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-white/5 text-slate-100 ring-1 ring-white/10'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2">
                <span>ИИ печатает...</span>
              </div>
            )}
            
            {error && (
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400">
                Ошибка: {error.message}
              </div>
            )}
          </div>

          {/* Форма отправки */}
          <form 
            onSubmit={(e) => {
              e.preventDefault(); // Останавливает перезагрузку страницы
              handleSubmit(e);
            }} 
            className="p-4 bg-slate-900 border-t border-white/10 flex gap-2"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Напиши вопрос..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              Отправить
            </button>
          </form>
        </div>
      )}
    </div>
  );
}