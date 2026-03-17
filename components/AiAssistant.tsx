import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  const doSend = () => {
    if (!input.trim() || isLoading) return;
    handleSubmit({ preventDefault: () => {} } as any);
  };

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-indigo-600 text-white p-4 rounded-full shadow-2xl z-[9999] font-bold cursor-pointer hover:scale-105 transition-all"
      >
        Чат с ИИ
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-[350px] h-[500px] bg-white border border-slate-200 shadow-2xl rounded-3xl flex flex-col z-[9999] overflow-hidden text-black animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
        <span className="font-bold">KomekArch AI</span>
        <div onClick={() => setIsOpen(false)} className="cursor-pointer p-1 hover:bg-white/10 rounded">✕</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10 text-sm">Задай вопрос об архитектуре ЭВМ!</div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span className={`inline-block max-w-[85%] p-3 rounded-2xl text-sm ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-800'
            }`}>
              {m.content}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-[10px] text-indigo-500 font-bold animate-pulse text-center">Генерирую ответ...</div>}
        {error && <div className="text-[10px] text-red-500 bg-red-50 p-2 rounded">Ошибка: {error.message}</div>}
      </div>

      <div className="p-4 border-t bg-white flex gap-2">
        <input
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={handleInputChange}
          placeholder="Напиши сообщение..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              doSend();
            }
          }}
        />
        <div 
          onClick={doSend}
          className={`px-4 py-2 rounded-xl text-white text-sm font-bold cursor-pointer transition-all ${
            isLoading || !input.trim() ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          →
        </div>
      </div>
    </div>
  );
}