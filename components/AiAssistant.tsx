import React, { useState, useEffect, useRef } from 'react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Автопрокрутка вниз при новом сообщении
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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
      
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: Ошибка: ${data.error} }]);
      }
    } catch (err: any) {
      console.error("Frontend Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Ошибка соединения. Попробуй еще раз." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.4)] z-[9999] font-bold cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center gap-2 border border-blue-400"
      >
        <span className="text-xl">🤖</span> Помощь ИИ
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white border border-blue-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] flex flex-col z-[9999] overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-300">
      
      {/* Шапка чата в стиле сайта */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md font-bold text-lg">🤖</div>
          <div>
            <h3 className="font-bold text-sm tracking-wide leading-none">KomekArch AI</h3>
            <p className="text-[10px] text-blue-100 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Онлайн | CS-201
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="hover:bg-white/20 p-2 rounded-full transition-colors text-xl leading-none"
        >
          ✕
        </button>
      </div>
      
      {/* Окно сообщений */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <div className="text-4xl">📚</div>
            <p className="text-sm font-medium px-8 text-slate-500 italic">
              "Привет! Я помогу тебе разобраться в архитектуре ЭВМ. Что хочешь узнать?"
            </p>
          </div>
        )}
        
        {messages.map((m, idx) => (
          <div key={idx} className={flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-blue-50 text-slate-700 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-200 h-8 w-24 rounded-full flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Поле ввода */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all shadow-inner">
          <input
            className="flex-1 bg-transparent border-none px-3 py-2 text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Спроси о процессорах или памяти..."
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-90 ${
              isLoading || !input.trim() 
                ? 'bg-slate-300 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'
            }`}
          >
            {isLoading ? "⏳" : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}
