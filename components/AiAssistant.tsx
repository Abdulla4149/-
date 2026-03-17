import React, { useState, useRef, useEffect } from 'react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Реф для автоматического скролла вниз
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    // Проверка: не пустой ли ввод и не идет ли уже загрузка
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    
    // Сначала сохраняем старые сообщения + новое сообщение пользователя
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      // Проверяем, не упал ли сервер (ошибка 500 и т.д.)
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Ошибка: ${data.error}` }]);
      } else {
        // На случай странных ответов
        setMessages(prev => [...prev, { role: 'assistant', content: "ИИ не смог сформулировать ответ. Попробуйте еще раз." }]);
      }
    } catch (err: any) {
      console.error("Frontend Error:", err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Произошла ошибка соединения. Проверьте интернет или настройки сервера." 
      }]);
    } finally {
      // Это сработает ВСЕГДА, разблокируя кнопку
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-5 right-5 bg-indigo-600 text-white p-4 rounded-full shadow-2xl z-[9999] font-bold cursor-pointer hover:scale-110 transition-all active:scale-95"
      >
        Чат с ИИ
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-[350px] h-[500px] bg-white border border-slate-200 shadow-2xl rounded-3xl flex flex-col z-[9999] overflow-hidden text-black animate-in fade-in slide-in-from-bottom-4">
      {/* Шапка чата */}
      <div className="bg-slate-900 p-4 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-bold">KomekArch AI</span>
        </div>
        <div 
          onClick={() => setIsOpen(false)} 
          className="cursor-pointer p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          ✕
        </div>
      </div>
      
      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-thin">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            <p className="text-sm font-medium italic">Привет! Я помогу тебе разобраться в архитектуре ЭВМ.</p>
          </div>
        )}
        
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`inline-block max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl rounded-tl-none text-xs text-indigo-600 font-bold animate-pulse shadow-sm">
              ИИ подготавливает полный ответ...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="p-4 border-t bg-white flex gap-2 shrink-0">
        <input
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 transition-all"
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Ожидаем ответа..." : "Напиши сообщение..."}
          onKeyDown={(e) => { 
            if (e.key === 'Enter' && !e.shiftKey) { 
              e.preventDefault(); 
              sendMessage(); 
            } 
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className={`px-4 py-2 rounded-xl text-white text-sm font-bold transition-all flex items-center justify-center ${
            isLoading || !input.trim() 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
          }`}
        >
          {isLoading ? "..." : "→"}
        </button>
      </div>
    </div>
  );
}