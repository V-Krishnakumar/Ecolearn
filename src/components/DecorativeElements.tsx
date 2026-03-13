import React from 'react';

interface DecorativeDividerProps {
  type?: 'hills' | 'waves' | 'plants' | 'clouds';
  className?: string;
}

export function DecorativeDivider({ type = 'hills', className = '' }: DecorativeDividerProps) {
  const dividers = {
    hills: (
      <svg viewBox="0 0 1200 120" className={`w-full h-16 ${className}`} preserveAspectRatio="none">
        <path
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill="url(#hillsGradient)"
        />
        <defs>
          <linearGradient id="hillsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
    ),
    waves: (
      <svg viewBox="0 0 1200 120" className={`w-full h-16 ${className}`} preserveAspectRatio="none">
        <path
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,128C1248,128,1344,96,1392,80L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill="url(#wavesGradient)"
        />
        <defs>
          <linearGradient id="wavesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    ),
    plants: (
      <svg viewBox="0 0 1200 120" className={`w-full h-16 ${className}`} preserveAspectRatio="none">
        <path
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill="url(#plantsGradient)"
        />
        <defs>
          <linearGradient id="plantsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="25%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="75%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
        </defs>
      </svg>
    ),
    clouds: (
      <svg viewBox="0 0 1200 120" className={`w-full h-16 ${className}`} preserveAspectRatio="none">
        <path
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,128C1248,128,1344,96,1392,80L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill="url(#cloudsGradient)"
        />
        <defs>
          <linearGradient id="cloudsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>
      </svg>
    )
  };

  return dividers[type];
}

interface FloatingIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  className?: string;
}

export function FloatingIcon({ icon, size = 'md', delay = 0, className = '' }: FloatingIconProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  return (
    <span
      className={`${sizeClasses[size]} animate-bounce-playful ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {icon}
    </span>
  );
}

interface EcoBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function EcoBackground({ children, className = '' }: EcoBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 opacity-20 animate-float-cloud">
        <span className="text-6xl">🌿</span>
      </div>
      <div className="absolute top-20 right-20 opacity-20 animate-float-cloud" style={{ animationDelay: '2s' }}>
        <span className="text-4xl">🦋</span>
      </div>
      <div className="absolute bottom-20 left-20 opacity-20 animate-float-cloud" style={{ animationDelay: '4s' }}>
        <span className="text-5xl">🌻</span>
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 animate-float-cloud" style={{ animationDelay: '6s' }}>
        <span className="text-3xl">🌱</span>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface ProgressCelebrationProps {
  progress: number;
  className?: string;
}

export function ProgressCelebration({ progress, className = '' }: ProgressCelebrationProps) {
  if (progress < 100) return null;

  return (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${className}`}>
      <div className="text-center">
        <div className="text-8xl animate-bounce-playful mb-4">🎉</div>
        <div className="text-4xl font-black text-emerald-600 mb-2">Congratulations!</div>
        <div className="text-xl text-gray-600">You completed this lesson!</div>
      </div>
    </div>
  );
}
