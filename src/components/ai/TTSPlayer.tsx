'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Loader2, Volume2 } from 'lucide-react';

interface TTSPlayerProps {
  text: string;
  title?: string;
  color?: string;
}

export default function TTSPlayer({ text, title = "Read this page", color = "#6161FF" }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlay = async () => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    // Start fresh
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Playback failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '12px', 
      padding: '12px 24px', 
      background: '#fff', 
      borderRadius: '999px', 
      border: `1px solid ${color}30`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      marginBottom: '32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '12px', borderRight: '1px solid #eee', paddingRight: '12px' }}>
        <Volume2 size={20} color={color} />
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#323338' }}>{title}</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={handleTogglePlay}
          disabled={isLoading}
          style={{ 
            width: '36px', height: '36px', borderRadius: '50%', background: color, color: '#fff', 
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
          }}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button 
          onClick={handleStop}
          disabled={!isPlaying && !isPaused}
          style={{ 
            width: '36px', height: '36px', borderRadius: '50%', background: '#f5f6f8', color: '#676879', 
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
          }}
        >
          <Square size={16} />
        </button>
      </div>
    </div>
  );
}
