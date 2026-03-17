import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  // Создаем отдельную функцию для обработки отправки
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Останавливает перезагрузку СТРОГО здесь
    e.stopPropagation(); // Запрещает событию идти дальше
    if (!input.trim() || isLoading) return;
    
    handleSubmit(e);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-2xl font-bold"
      >
        {isOpen ? 'Закрыть' : 'Чат с ИИ'}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white border shadow-2xl flex flex-col rounded-2xl overflow-hidden border-slate-200">
          <div className="bg-slate-900 p-3 text-white text-center font-bold">KomekArch AI</div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-xl text-sm max-w-[80%] ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-slate-400">ИИ печатает...</div>}
          </div>

          <form onSubmit={handleFormSubmit} className="p-3 border-t bg-slate-50 flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={handleInputChange}
              placeholder="Введите вопрос..."
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}