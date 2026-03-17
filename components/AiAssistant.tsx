import React from 'react';
import { useChat } from '@ai-sdk/react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-xl z-50 font-bold"
      >
        Чат с ИИ
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-80 h-[450px] bg-white border-2 border-slate-200 shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden">
      <div className="bg-slate-900 p-3 text-white flex justify-between items-center">
        <span className="font-bold">KomekArch AI</span>
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50 text-slate-800">
        {messages.map(m => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block p-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200'}`}>
              {m.content}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-xs text-blue-500 animate-pulse">ИИ думает...</div>}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2 bg-white">
        <input
          className="flex-1 border p-2 rounded text-sm text-black outline-none"
          value={input}
          onChange={handleInputChange}
          placeholder="Спроси что-нибудь..."
        />
        <button type="submit" className="bg-blue-600 text-white px-3 rounded">→</button>
      </form>
    </div>
  );
}