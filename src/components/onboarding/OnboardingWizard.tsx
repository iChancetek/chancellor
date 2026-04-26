'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Sparkles, 
  LayoutGrid, Inbox, Shield, Bot, Zap, Volume2, VolumeX, Loader2
} from 'lucide-react';

interface WizardStep {
  title: string;
  description: string;
  icon: any;
  color: string;
  highlight?: string;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    title: 'Welcome to ChancellorOS',
    description: 'The neural platform designed to power your teams to run everything. Let\'s show you where the essentials are located.',
    icon: Bot,
    color: '#6161FF'
  },
  {
    title: 'Your Command Center',
    description: 'The sidebar is your main navigation hub. Here you\'ll find your Inbox, Calendar, and the Template Center to jumpstart any project.',
    icon: Inbox,
    color: '#0073ea',
    highlight: 'Sidebar'
  },
  {
    title: 'Enterprise Intelligence',
    description: 'Access Chancellor AI for autonomous reasoning, document analysis, and cross-module insights. It\'s your strategic advantage.',
    icon: Sparkles,
    color: '#a25ddc',
    highlight: 'Intelligence'
  },
  {
    title: 'Unified ERP & CRM',
    description: 'Manage your entire organizational flow from financials to customer relationships in one interconnected ecosystem.',
    icon: LayoutGrid,
    color: '#00c875',
    highlight: 'Modules'
  },
  {
    title: 'Administrator Controls',
    description: 'Super admins have access to the Admin Dashboard for user management, audit logs, and technical performance analytics.',
    icon: Shield,
    color: '#ffcb00',
    highlight: 'Admin Dashboard'
  },
  {
    title: 'You\'re All Set!',
    description: 'Ready to transform your work? Dive into your workspace and start building the future of your enterprise.',
    icon: Zap,
    color: '#ff3d57'
  }
];

export default function OnboardingWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const isCompleted = localStorage.getItem('chancellor_onboarding_completed');
    const mutePref = localStorage.getItem('chancellor_onboarding_muted');
    if (mutePref === 'true') setIsMuted(true);
    
    if (!isCompleted) {
      setIsOpen(true);
    }
  }, []);

  // Speak when step changes
  useEffect(() => {
    if (isOpen && !isMuted) {
      speakStep(currentStep);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentStep, isOpen, isMuted]);

  const speakStep = async (index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const step = WIZARD_STEPS[index];
    const text = `${step.title}. ${step.description}`;

    try {
      setIsSpeaking(true);
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
      
      audio.onended = () => setIsSpeaking(false);
      await audio.play();
    } catch (err) {
      console.error('TTS Playback failed:', err);
      setIsSpeaking(false);
    }
  };

  const handleToggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    localStorage.setItem('chancellor_onboarding_muted', String(newMute));
    if (newMute && audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleClose = () => {
    localStorage.setItem('chancellor_onboarding_completed', 'true');
    setIsOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const step = WIZARD_STEPS[currentStep];

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 9999, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ 
        width: '520px', 
        background: '#fff', 
        borderRadius: '32px', 
        boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Progress Bar */}
        <div style={{ 
          height: '6px', 
          width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%`, 
          background: step.color,
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />

        <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleToggleMute}
            style={{ 
              width: '40px', height: '40px', borderRadius: '12px', background: '#f5f6f8', 
              border: 'none', color: isMuted ? '#ff3d57' : '#6161FF', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className={isSpeaking ? 'animate-pulse' : ''} />}
          </button>
          <button 
            onClick={handleClose}
            style={{ 
              width: '40px', height: '40px', borderRadius: '12px', background: '#f5f6f8', 
              border: 'none', color: '#676879', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '60px 48px 48px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            background: `${step.color}15`, 
            color: step.color, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '40px',
            boxShadow: `0 10px 20px ${step.color}10`
          }}>
            <step.icon size={40} />
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#323338', marginBottom: '20px' }}>{step.title}</h2>
          <p style={{ fontSize: '18px', color: '#676879', lineHeight: '1.6', marginBottom: '48px' }}>
            {step.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {WIZARD_STEPS.map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: i === currentStep ? '24px' : '10px', 
                    height: '10px', 
                    borderRadius: '10px', 
                    background: i === currentStep ? step.color : '#eee',
                    transition: 'all 0.4s'
                  }} 
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={handleClose}
                style={{ background: 'none', border: 'none', color: '#676879', fontSize: '15px', fontWeight: 600, cursor: 'pointer', padding: '10px 16px' }}
              >
                Skip
              </button>
              
              {currentStep > 0 && (
                <button 
                  onClick={handlePrev}
                  style={{ background: '#f5f6f8', border: 'none', color: '#323338', borderRadius: '12px', padding: '12px', cursor: 'pointer' }}
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <button 
                onClick={handleNext}
                style={{ 
                  background: step.color, 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '14px 32px', 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: `0 10px 20px ${step.color}30`,
                  minWidth: '140px',
                  justifyContent: 'center'
                }}
              >
                {currentStep === WIZARD_STEPS.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < WIZARD_STEPS.length - 1 && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
