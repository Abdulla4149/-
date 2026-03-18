import React, { useState } from 'react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      
      // Если пришел текст (даже если это текст ошибки), выводим его
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: Ошибка: ${data.error} }]);
      }
    } catch (err: any) {
      console.error("Frontend Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Ошибка соединения. Попробуй еще раз." }]);
    } finally {
      // КРИТИЧНО: всегда выключаем режим загрузки, чтобы кнопка снова стала активной
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div onClick={() => setIsOpen(true)} className="fixed bottom-5 right-5 bg-indigo-600 text-white p-4 rounded-full shadow-2xl z-[9999] font-bold cursor-pointer transition-all">
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
        {messages.map((m, idx) => (
          <div key={idx} className={flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}}>
            <span className={`inline-block max-w-[85%] p-3 rounded-2xl text-sm ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-800 shadow-sm'
            }`}>
              {m.content}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-xs text-indigo-500 font-bold animate-pulse text-center">ИИ подготавливает полный ответ...</div>}
      </div>

      <div className="p-4 border-t bg-white flex gap-2">
        <input
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напиши сообщение..."
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
        />
        <div 
          onClick={sendMessage}
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
