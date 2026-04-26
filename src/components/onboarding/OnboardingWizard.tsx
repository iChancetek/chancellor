'use client';

import { useState, useEffect } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Sparkles, 
  LayoutGrid, Inbox, Shield, Bot, Zap 
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

  useEffect(() => {
    const isCompleted = localStorage.getItem('chancellor_onboarding_completed');
    if (!isCompleted) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('chancellor_onboarding_completed', 'true');
    setIsOpen(false);
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
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{ 
        width: '480px', 
        background: '#fff', 
        borderRadius: '24px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Progress Bar */}
        <div style={{ 
          height: '6px', 
          width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%`, 
          background: step.color,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />

        <button 
          onClick={handleClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#676879', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ padding: '48px 40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '20px', 
            background: `${step.color}15`, 
            color: step.color, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            <step.icon size={32} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#323338', marginBottom: '16px' }}>{step.title}</h2>
          <p style={{ fontSize: '16px', color: '#676879', lineHeight: '1.6', marginBottom: '32px' }}>
            {step.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {WIZARD_STEPS.map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: i === currentStep ? step.color : '#eee',
                    transition: 'all 0.3s'
                  }} 
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleClose}
                style={{ background: 'none', border: 'none', color: '#676879', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '10px 16px' }}
              >
                Skip
              </button>
              
              {currentStep > 0 && (
                <button 
                  onClick={handlePrev}
                  style={{ background: '#f5f6f8', border: 'none', color: '#323338', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer' }}
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
                  borderRadius: '8px', 
                  padding: '10px 24px', 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: `0 4px 12px ${step.color}30`
                }}
              >
                {currentStep === WIZARD_STEPS.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < WIZARD_STEPS.length - 1 && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
