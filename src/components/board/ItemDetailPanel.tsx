'use client';

import { useState, useRef } from 'react';
import { 
  X, MessageSquare, Clock, User, Send, Bell, Home, Share2, MoreHorizontal,
  Mic, Image as ImageIcon, Video, Music, FileText, Play, Upload, Download, Loader2, Sparkles
} from 'lucide-react';
import { formatDate, formatRelativeTime, getInitials, generateId } from '@/lib/utils';
import type { Board, Item, Column, Attachment } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { useBoardStore } from '@/lib/store';
import { uploadFile } from '@/lib/firestore';

interface ItemDetailPanelProps {
  item: Item;
  board: Board;
  onClose: () => void;
  onUpdateValue: (itemId: string, columnId: string, value: unknown) => void;
  onUpdateName: (itemId: string, name: string) => void;
}

export default function ItemDetailPanel({ item, board, onClose, onUpdateValue, onUpdateName }: ItemDetailPanelProps) {
  const { user } = useAuth();
  const { updateItem } = useBoardStore();
  const [localName, setLocalName] = useState(item.name);
  const [activeTab, setActiveTab] = useState('Updates');
  const [updateText, setUpdateText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const tabs = ['Updates', 'AI Copilot', 'Files', 'Activity Log'];

  const handleAiSubmit = async () => {
    if (!aiInput.trim()) return;
    const userMsg = { role: 'user' as const, content: aiInput };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const itemContext = `Current context:\nBoard Type: ${board.type}\nBoard Name: ${board.name}\nItem Name: ${item.name}\nItem Details: ${JSON.stringify(item.values)}`;
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `You are assisting the user inside an item detail view. ${itemContext}. Provide highly specific, elite-level advice, drafts, or analysis based on this context. Do not use placeholders, be directly actionable.` },
            ...aiMessages,
            userMsg
          ]
        })
      });
      const data = await response.json();
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const startDictation = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          const response = await fetch('/api/ai/stt', { method: 'POST', body: formData });
          const data = await response.json();
          if (data.text) setUpdateText(prev => prev + (prev ? ' ' : '') + data.text);
        } catch (err) {
          console.error('STT failed:', err);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access denied:', err);
    }
  };

  const stopDictation = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const typeMap: Record<string, 'photo' | 'video' | 'audio' | 'slide'> = {
        'image/jpeg': 'photo', 'image/png': 'photo', 'image/webp': 'photo',
        'video/mp4': 'video', 'video/quicktime': 'video',
        'audio/mpeg': 'audio', 'audio/wav': 'audio',
        'application/pdf': 'slide'
      };
      
      const fileType = typeMap[file.type] || 'photo';
      const path = `boards/${board.id}/items/${item.id}/${generateId()}_${file.name}`;
      
      const downloadUrl = await uploadFile(path, file);
      
      const newAttachment: Attachment = {
        id: generateId(),
        name: file.name,
        type: fileType,
        url: downloadUrl,
        size: file.size,
        createdAt: Date.now()
      };

      const updatedAttachments = [...(item.attachments || []), newAttachment];
      updateItem(item.id, { attachments: updatedAttachments });
    } catch (err) {
      console.error('Real file upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="item-side-panel">
      <div className="side-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={onClose}><X size={20} color="#676879" /></button>
          <div style={{ height: '24px', width: '1px', background: 'var(--border-light)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#676879' }}>
            <Home size={16} /> Item details
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', color: '#676879' }}>
          <Bell size={18} />
          <Share2 size={18} />
          <MoreHorizontal size={18} />
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <input 
          style={{ fontSize: '28px', fontWeight: 700, border: 'none', width: '100%', outline: 'none', marginBottom: '10px' }}
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onBlur={() => onUpdateName(item.id, localName)}
        />
        
        <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #e6e9ef', marginTop: '20px' }}>
          {tabs.map(tab => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                padding: '10px 0', fontSize: '14px', cursor: 'pointer',
                color: activeTab === tab ? '#0073ea' : '#676879',
                borderBottom: activeTab === tab ? '2px solid #0073ea' : 'none',
                fontWeight: activeTab === tab ? 600 : 400
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 32px', overflowY: 'auto' }}>
        {activeTab === 'Updates' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ border: '1px solid #d0d4e4', borderRadius: '8px', padding: '16px', background: isRecording ? '#fff5f5' : '#fff' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#579bfc', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getInitials(user?.displayName || 'U')}
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <textarea 
                    placeholder="Write an update..." 
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    style={{ border: 'none', width: '100%', resize: 'none', outline: 'none', fontSize: '16px', minHeight: '80px', background: 'transparent' }}
                  />
                  <button 
                    onClick={isRecording ? stopDictation : startDictation}
                    style={{ position: 'absolute', right: '0', bottom: '0', background: isRecording ? '#e2445c' : '#f5f6f8', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Mic size={18} color={isRecording ? '#fff' : '#676879'} />
                    {isRecording && <span style={{ position: 'absolute', top: '-10px', right: '-5px', width: '10px', height: '10px', background: '#e2445c', borderRadius: '50%' }} className="animate-pulse" />}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button className="btn-primary-monday" style={{ padding: '8px 24px', fontSize: '14px' }}>Update</button>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9699a6' }}>
              <MessageSquare size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#323338' }}>No updates yet</p>
              <p style={{ fontSize: '14px' }}>Be the first to update your team on what&apos;s happening with this item!</p>
            </div>
          </div>
        )}

        {activeTab === 'Files' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ border: '2px dashed #d0d4e4', borderRadius: '12px', padding: '40px', textAlign: 'center', background: '#f8f9fb', position: 'relative' }}>
              <input type="file" onChange={handleFileUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
              {isUploading ? (
                <Loader2 size={32} color="#6161FF" className="animate-spin" style={{ margin: '0 auto' }} />
              ) : (
                <>
                  <Upload size={32} color="#676879" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontWeight: 600, color: '#323338' }}>Click or drag to upload multimedia</p>
                  <p style={{ fontSize: '13px', color: '#676879', marginTop: '4px' }}>Photos, Videos, Audio, or Slide Decks</p>
                </>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginTop: '24px' }}>
              {item.attachments?.map((file) => (
                <div key={file.id} style={{ border: '1px solid #e1e4e8', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                  <div style={{ height: '100px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {file.type === 'photo' && <ImageIcon size={32} color="#6161FF" />}
                    {file.type === 'video' && <Video size={32} color="#e2445c" />}
                    {file.type === 'audio' && <Music size={32} color="#00c875" />}
                    {file.type === 'slide' && <FileText size={32} color="#ffcb00" />}
                    <a href={file.url} target="_blank" style={{ position: 'absolute', top: '8px', right: '8px', color: '#676879' }}><Download size={14} /></a>
                  </div>
                  <div style={{ padding: '10px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#323338', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                    <p style={{ fontSize: '10px', color: '#676879', textTransform: 'capitalize' }}>{file.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Activity Log' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#676879" />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600 }}>Item created</p>
                <p style={{ fontSize: '12px', color: '#676879' }}>{formatDate(item.createdAt)}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'AI Copilot' && (
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              {aiMessages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: '#676879' }}>
                  <Sparkles size={48} color="#6161FF" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
                  <p style={{ fontSize: '18px', fontWeight: 600, color: '#323338' }}>AI Copilot</p>
                  <p style={{ fontSize: '14px', maxWidth: '300px', margin: '0 auto' }}>
                    I understand the context of this {board.type.toUpperCase()} record. Ask me to draft emails, analyze data, or generate summaries.
                  </p>
                </div>
              ) : (
                aiMessages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.role === 'user' ? '#0073ea' : '#6161FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                    </div>
                    <div style={{ background: msg.role === 'user' ? '#eef2fc' : '#f5f6f8', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', color: '#323338', maxWidth: '80%', whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isAiLoading && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6161FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: 'relative', borderTop: '1px solid #e6e9ef', paddingTop: '16px' }}>
              <input 
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAiSubmit()}
                placeholder="Ask Copilot..."
                style={{ width: '100%', padding: '12px 48px 12px 16px', borderRadius: '24px', border: '1px solid #d0d4e4', outline: 'none', fontSize: '14px' }}
              />
              <button 
                onClick={handleAiSubmit}
                disabled={isAiLoading || !aiInput.trim()}
                style={{ position: 'absolute', right: '8px', top: '22px', background: aiInput.trim() ? '#6161FF' : '#d0d4e4', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: aiInput.trim() ? 'pointer' : 'default' }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
