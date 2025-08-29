import React, { useState, useEffect, useRef } from 'react';

const BreathingExercise = ({ rate, duration, onComplete, onClose }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const phaseTimerRef = useRef(null);

  // Start the exercise when component mounts
  useEffect(() => {
    setIsActive(true);
    startBreathingCycle();
    startMainTimer();
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    };
  }, []);

  const startMainTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startBreathingCycle = () => {
    const cycleDuration = rate.inhale + rate.exhale;
    let cycleTime = 0;

    const animate = () => {
      cycleTime += 16; // 60fps
      
      if (cycleTime >= cycleDuration * 1000) {
        cycleTime = 0;
      }

      const phaseProgress = (cycleTime % (rate.inhale * 1000)) / (rate.inhale * 1000);
      
      if (cycleTime < rate.inhale * 1000) {
        // Inhale phase
        if (currentPhase !== 'inhale') {
          setCurrentPhase('inhale');
          setPhaseTime(0);
        }
        setProgress(0.3 + (phaseProgress * 0.7)); // Scale from 30% to 100%
      } else {
        // Exhale phase
        if (currentPhase !== 'exhale') {
          setCurrentPhase('exhale');
          setPhaseTime(0);
        }
        setProgress(1 - (phaseProgress * 0.7)); // Scale from 100% to 30%
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const startPhaseTimer = () => {
    phaseTimerRef.current = setInterval(() => {
      setPhaseTime((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    if (isActive) {
      startPhaseTimer();
    }
    
    return () => {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    };
  }, [isActive, currentPhase]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleColor = () => {
    if (currentPhase === 'inhale') {
      return 'from-orange-400 to-red-500';
    } else {
      return 'from-blue-400 to-cyan-500';
    }
  };

  const getInstruction = () => {
    if (currentPhase === 'inhale') {
      return 'Inhale through the nose';
    } else {
      return 'Exhale slowly through the mouth and empty your lungs';
    }
  };

  const getPhaseTime = () => {
    const maxTime = currentPhase === 'inhale' ? rate.inhale : rate.exhale;
    return Math.min(phaseTime, maxTime);
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-white hover:text-slate-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
          <h1 className="text-white font-bold text-lg">INCREASE RELAXATION</h1>
          <div className="text-white text-2xl font-mono">{formatTime(timeRemaining)}</div>
        </div>
        
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Breathing Circle */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Outer Dotted Circle */}
        <div className="absolute w-80 h-80 border-2 border-dashed border-white/30 rounded-full" />
        
        {/* Middle Dotted Circle */}
        <div className="absolute w-64 h-64 border-2 border-dashed border-white/20 rounded-full" />
        
        {/* Animated Breathing Circle */}
        <div 
          className={`w-20 h-20 bg-gradient-to-br ${getCircleColor()} rounded-full transition-all duration-300 ease-in-out shadow-2xl`}
          style={{
            transform: `scale(${progress})`,
            boxShadow: `0 0 ${progress * 50}px ${progress * 20}px ${currentPhase === 'inhale' ? 'rgba(251, 146, 60, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`
          }}
        />
      </div>

      {/* Instructions */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${
            currentPhase === 'inhale' ? 'bg-orange-400' : 'bg-blue-400'
          }`} />
          <span className="text-white text-lg">{getInstruction()}</span>
        </div>
        
        {/* Phase Timer */}
        <div className="text-slate-400 text-sm">
          {getPhaseTime()}/{currentPhase === 'inhale' ? rate.inhale : rate.exhale}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="w-full bg-slate-700/30 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((duration * 60 - timeRemaining) / (duration * 60)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
