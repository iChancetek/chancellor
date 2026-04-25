'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Bot, Mic, Image as ImageIcon, Volume2, StopCircle, Loader2 } from 'lucide-react';
import type { AIMessage } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { PRODUCT_DATA } from '@/lib/products';

export default function LandingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = "Hello! I'm Chancellor AI, your platform guide. I can tell you all about our ChancellorOS ERP, CRM, and Work Management solutions. How can I help you today?";
      setMessages([{
        id: generateId(),
        role: 'assistant',
        content: greeting,
        timestamp: Date.now()
      }]);
      playTTS(greeting);
    }
  }, [isOpen]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input.trim();
    if (!textToSend && !selectedImage) return;

    const userMessage: AIMessage = {
      id: generateId(),
      role: 'user',
      content: textToSend,
      image: selectedImage || undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Construct context from PRODUCT_DATA
      const productContext = Object.values(PRODUCT_DATA).map(p => 
        `${p.title}: ${p.subtitle}. Features: ${p.features.join(', ')}`
      ).join('\n');

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `You are the ChancellorOS Sales Assistant. Here is the product information: ${productContext}` },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: textToSend }
          ],
        }),
      });

      const data = await response.json();
      const assistantMessage: AIMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message || 'I encountered an issue.',
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      playTTS(assistantMessage.content);
      
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = async (text: string) => {
    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (e) {
      console.error('TTS Failed', e);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'rec.webm');

        const res = await fetch('/api/ai/stt', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.text) setInput(data.text);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error('STT Failed', e);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <>
      <button className="chancellor-ai-button" onClick={() => setIsOpen(!isOpen)}>
        <Sparkles size={28} />
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '30px', 
          width: '420px', height: '600px', background: 'white', 
          borderRadius: '20px', boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 3000,
          border: '1px solid #d0d4e4'
        }}>
          {/* Header */}
          <div style={{ background: '#6161FF', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bot size={24} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Chancellor Assistant</h3>
              <p style={{ fontSize: '11px', opacity: 0.8 }}>Online ✦ ChancellorOS Expert</p>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: 'white' }}><X size={20} /></button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#fcfcfd' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? '#6161FF' : '#fff',
                color: msg.role === 'user' ? 'white' : 'inherit',
                padding: '12px 16px', borderRadius: '16px',
                fontSize: '14px', maxWidth: '85%', border: msg.role === 'assistant' ? '1px solid #eee' : 'none',
                boxShadow: msg.role === 'assistant' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center', color: '#676879' }}>
                <Loader2 className="animate-spin" size={14} /> 
                <span style={{ fontSize: '12px' }}>Assistant is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div style={{ padding: '20px', borderTop: '1px solid #eee', background: 'white' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#f5f6f8', borderRadius: '12px', padding: '8px 12px' }}>
              <button 
                onMouseDown={startRecording} 
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                style={{ color: isRecording ? '#df2f4a' : '#676879' }}
              >
                {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
              </button>
              <input 
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }}
                placeholder="Ask about ChancellorOS..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={() => handleSend()} style={{ color: '#6161FF' }}><Send size={20} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
