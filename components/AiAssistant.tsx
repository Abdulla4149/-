import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Достаем методы из хука. Добавим onError для отладки прямо в чате
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  // Улучшенная функция отправки
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Проверка: если input пустой или еще не загрузился, просто выходим
    if (!input || typeof input !== 'string' || !input.trim()) {
      return;
    }

    handleSubmit(e);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl hover:bg-indigo-700 transition-all font-bold"
      >
        {isOpen ? 'Закрыть' : 'Чат с ИИ'}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-900 p-4 text-white font-bold text-center">
            KomekArch AI
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-slate-400 text-center text-sm mt-10">
                Спроси что-нибудь об архитектуре ЭВМ
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-800'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-xs text-indigo-500 animate-pulse">ИИ готовит ответ...</div>
            )}

            {error && (
              <div className="text-[10px] text-red-500 bg-red-50 p-2 rounded-lg">
                Ошибка: {error.message}
              </div>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t flex gap-2">
            <input
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={input || ''} // Гарантируем, что значение никогда не будет undefined
              onChange={handleInputChange}
              placeholder="Введите сообщение..."
              autoComplete="off"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input?.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}