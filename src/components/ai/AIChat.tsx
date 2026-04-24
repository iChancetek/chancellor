'use client';

import { useState, useRef } from 'react';
import { useUIStore } from '@/lib/store';
import { Send, X, Sparkles, Bot } from 'lucide-react';
import type { AIMessage } from '@/lib/types';
import { generateId } from '@/lib/utils';

export default function AIChat() {
  const { aiChatOpen, toggleAIChat, aiMessages, addAIMessage } = useUIStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    addAIMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...aiMessages, userMessage].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      addAIMessage({
        id: generateId(),
        role: 'assistant',
        content: data.message || 'I encountered an issue.',
        timestamp: Date.now(),
      });
    } catch {
      addAIMessage({
        id: generateId(),
        role: 'assistant',
        content: "I'm your Chancellor AI Assistant. I can help you automate workflows, summarize boards, or answer any questions about your workspace.",
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="chancellor-ai-button" onClick={toggleAIChat}>
        <Sparkles size={28} />
      </button>

      {aiChatOpen && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '30px', 
          width: '380px', height: '600px', background: 'white', 
          borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000,
          border: '1px solid #d0d4e4'
        }}>
          <div style={{ background: '#0073ea', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Chancellor AI</h3>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>Powered by GPT-5.2</p>
            </div>
            <button onClick={toggleAIChat} style={{ marginLeft: 'auto', color: 'white' }}><X size={20} /></button>
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ background: '#f5f6f8', padding: '15px', borderRadius: '12px', borderBottomLeftRadius: '2px', fontSize: '14px', lineHeight: '1.6' }}>
              Hi! I&apos;m your AI Assistant. How can I help you optimize your Chancellor workspace today?
            </div>
            {aiMessages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? '#0073ea' : '#f5f6f8',
                color: msg.role === 'user' ? 'white' : 'inherit',
                padding: '12px 16px', borderRadius: '12px',
                borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                fontSize: '14px', maxWidth: '85%', lineHeight: '1.6'
              }}>
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '20px', borderTop: '1px solid #d0d4e4', display: 'flex', gap: '10px' }}>
            <input 
              style={{ flex: 1, background: '#f5f6f8', border: '1px solid #d0d4e4', borderRadius: '8px', padding: '10px 15px', outline: 'none' }}
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{ width: '40px', height: '40px', background: '#0073ea', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
