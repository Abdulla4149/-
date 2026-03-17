import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  // Создаем функцию, которая имитирует отправку формы
  const sendMessage = () => {
    if (!input.trim() || isLoading) return;
    
    // Создаем фиктивное событие для handleSubmit
    const fakeEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
    } as React.FormEvent;
    
    handleSubmit(fakeEvent);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl z-[9999] font-bold active:scale-95 transition-all"
      >
        Чат с ИИ
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-[350px] h-[500px] bg-white border border-slate-200 shadow-2xl rounded-3xl flex flex-col z-[9999] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
        <span className="font-bold text-lg">KomekArch AI</span>
        <button 
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/10 p-1 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-slate-800">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10 text-sm">
            Задай вопрос об архитектуре ЭВМ!
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span className={`inline-block max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'bg-white border border-slate-200 text-slate-700'
            }`}>
              {m.content}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-[10px] text-indigo-500 font-bold animate-pulse uppercase tracking-wider text-center">
            Генерирую ответ...
          </div>
        )}
      </div>

      {/* ЗАМЕНА ТЕГА FORM НА DIV — это гарантирует отсутствие перезагрузки */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          value={input}
          onChange={handleInputChange}
          placeholder="Напиши что-нибудь..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button 
          type="button"
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all"
        >
          →
        </button>
      </div>
    </div>
  );
}