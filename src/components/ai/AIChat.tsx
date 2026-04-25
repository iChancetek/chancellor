'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useUIStore } from '@/lib/store';
import { Send, X, Sparkles, Bot, Mic, Image as ImageIcon, Volume2, StopCircle, Loader2 } from 'lucide-react';
import type { AIMessage } from '@/lib/types';
import { generateId } from '@/lib/utils';

export default function AIChat() {
  const { aiChatOpen, toggleAIChat, aiMessages, addAIMessage } = useUIStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  // Initial greeting audio
  useEffect(() => {
    if (aiChatOpen && aiMessages.length === 0) {
      playTTS("Welcome back. I'm Chancellor AI, your multimodal advisor. I can see, hear, and speak. How can we optimize your workflow today?");
    }
  }, [aiChatOpen, aiMessages.length]);

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

    addAIMessage(userMessage);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...aiMessages, userMessage].map(m => ({
            role: m.role,
            content: m.image 
              ? [{ type: 'text', text: m.content }, { type: 'image_url', image_url: { url: m.image } }]
              : m.content
          })),
        }),
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      const assistantMessage: AIMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message || 'I encountered an issue.',
        timestamp: Date.now(),
      };
      
      addAIMessage(assistantMessage);
      
      // Auto TTS for assistant response
      playTTS(assistantMessage.content);
      
    } catch (error: any) {
      console.error('AI Error:', error);
      addAIMessage({
        id: generateId(),
        role: 'assistant',
        content: "I encountered a connection issue. Please check your OpenAI API key configuration and try again. I'm here to help once the connection is restored.",
        timestamp: Date.now(),
      });
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
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
          width: '420px', height: '650px', background: 'white', 
          borderRadius: '20px', boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000,
          border: '1px solid #d0d4e4'
        }}>
          {/* Header */}
          <div style={{ background: '#0073ea', padding: '24px', color: 'white', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Chancellor AI</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00c875' }}></span>
                <p style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Multimodal GPT-5.4 Active</p>
              </div>
            </div>
            <button onClick={toggleAIChat} style={{ color: 'white', opacity: 0.7, padding: '4px' }}><X size={20} /></button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', background: '#fcfcfd' }}>
            <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '16px', borderRadius: '16px', borderBottomLeftRadius: '2px', fontSize: '14px', lineHeight: '1.6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              Welcome back. I&apos;m Chancellor AI, your multimodal advisor. I can see, hear, and speak. How can we optimize your workflow today?
            </div>
            {aiMessages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? '#0073ea' : '#fff',
                color: msg.role === 'user' ? 'white' : 'inherit',
                padding: '16px', borderRadius: '16px',
                borderBottomRightRadius: msg.role === 'user' ? '2px' : '16px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '16px',
                fontSize: '14px', maxWidth: '85%', lineHeight: '1.6',
                boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                border: msg.role === 'assistant' ? '1px solid #eee' : 'none',
                position: 'relative'
              }}>
                {msg.image && <img src={msg.image} alt="Upload" style={{ width: '100%', borderRadius: '8px', marginBottom: '12px' }} />}
                {msg.content}
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => playTTS(msg.content)}
                    style={{ position: 'absolute', top: '4px', right: '-32px', color: '#676879' }}
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center', color: '#676879' }}>
                <Loader2 className="animate-spin" size={16} /> 
                <span style={{ fontSize: '12px', fontWeight: 500 }}>GPT-5.4 reasoning...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div style={{ padding: '24px', borderTop: '1px solid #eee', background: 'white' }}>
            {selectedImage && (
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                <img src={selectedImage} alt="Preview" style={{ height: '80px', borderRadius: '8px' }} />
                <button onClick={() => setSelectedImage(null)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#333', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f5f6f8', borderRadius: '12px', padding: '8px 12px', border: '1px solid #eee' }}>
              <label style={{ cursor: 'pointer', color: '#676879' }}>
                <ImageIcon size={20} />
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </label>
              <button 
                onMouseDown={startRecording} 
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                style={{ color: isRecording ? '#df2f4a' : '#676879', transition: 'all 0.2s' }}
              >
                {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
              </button>
              <div style={{ width: '1px', height: '24px', background: '#d0d4e4' }} />
              <input 
                style={{ flex: 1, background: 'transparent', border: 'none', padding: '8px 0', fontSize: '14px', outline: 'none' }}
                placeholder={isRecording ? "Listening..." : "Message Chancellor AI (GPT-5.4)"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                style={{ color: '#0073ea', opacity: (!input.trim() && !selectedImage) ? 0.3 : 1 }}
              >
                <Send size={20} />
              </button>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
              <p style={{ fontSize: '10px', color: '#9699a6' }}>Chancellor Multimodal Engine v5.4 ✦ Experimental Multimodal Architecture</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
