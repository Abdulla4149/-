import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="fixed bottom-5 right-5 z-[999]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        {isOpen ? 'Закрыть' : 'Чат с ИИ'}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white border shadow-xl flex flex-col rounded-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 text-black space-y-2">
            {messages.map(m => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <p className={`inline-block p-2 rounded ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {m.content}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-2 border-t flex">
            <input
              className="flex-1 border p-1 text-black"
              value={input}
              onChange={handleInputChange}
              placeholder="Спроси..."
            />
            <button type="submit" className="bg-blue-600 text-white px-2">-></button>
          </form>
        </div>
      )}
    </div>
  );
}