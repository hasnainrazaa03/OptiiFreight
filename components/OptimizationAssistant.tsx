import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

const OptimizationAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hello! I am OptiiBot. How can I help you optimize your freight today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const response = await chatWithAssistant(userMsg);
    
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand-orange hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
        >
          <Bot className="w-8 h-8" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-brand-dark p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-heading font-semibold">OptiiBot Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 bg-brand-light flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-dark text-white self-end rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 self-start rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-gray-100 text-gray-500 p-2 rounded-lg text-xs animate-pulse">
                OptiiBot is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about rates, routes..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-brand-green hover:bg-green-600 text-white p-2 rounded-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationAssistant;