import React, { useState, useEffect, useRef } from 'react';

const BreathingExercise = ({ rate, duration, onComplete, onClose, onLeave }) => {
  // Circle size constants for precise scaling - must be defined before useState
  const INNER_CIRCLE_SIZE = 80; // w-20 h-20 = 80px
  const OUTER_CIRCLE_SIZE = 320; // w-80 h-80 = 320px
  
  // Calculate scale ratios - now from center (0.1) to outer boundary (4.0)
  const MIN_SCALE = 0.1; // Start from center (small size)
  const MAX_SCALE = OUTER_CIRCLE_SIZE / INNER_CIRCLE_SIZE; // 320/80 = 4.0 (full outer circle size)
  const SCALE_RANGE = MAX_SCALE - MIN_SCALE; // 3.9 (expansion range)

  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(MIN_SCALE); // Start from center
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  // phaseTimerRef is no longer needed

  // Remove the useEffect from here - will add it after function definitions

  const startMainTimer = () => {
    console.log(`⏰ Starting main timer for ${duration} minutes`);
    
    // Prevent multiple timers
    if (timerRef.current) {
      console.log(`⚠️ Timer already exists, clearing previous timer`);
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          console.log(`⏰ Main exercise timer completed! Total duration: ${duration} minutes`);
          clearInterval(timerRef.current);
          timerRef.current = null;
          onComplete();
          return 0;
        }
        const newTime = prev - 1;
        if (newTime % 10 === 0) { // Log every 10 seconds to avoid spam
          console.log(`⏰ Main timer: ${newTime}s remaining`);
        }
        return newTime;
      });
    }, 1000);
    
    console.log(`✅ Main timer started successfully`);
  };

  const startBreathingCycle = () => {
    console.log(`🚀 Starting breathing cycle with rate: inhale=${rate.inhale}s, exhale=${rate.exhale}s`);
    
    // Prevent multiple animation loops
    if (animationRef.current) {
      console.log(`⚠️ Animation already running, clearing previous animation`);
      cancelAnimationFrame(animationRef.current);
    }
    
    const cycleDuration = rate.inhale + rate.exhale;
    let cycleTime = 0;
    let lastPhaseTime = 0;
    let currentPhaseLocal = 'inhale'; // Local phase tracking
    
    console.log(`📊 Cycle duration: ${cycleDuration}s, starting animation loop...`);

    const animate = () => {
      cycleTime += 16; // 60fps
      
      if (cycleTime >= cycleDuration * 1000) {
        console.log(`🔄 Breathing cycle completed, resetting to 0ms. Current phase: ${currentPhaseLocal}, phaseTime: ${phaseTime}`);
        cycleTime = 0;
        lastPhaseTime = 0;
        currentPhaseLocal = 'inhale';
        // Force phase reset to ensure clean transition
        setCurrentPhase('inhale');
        setPhaseTime(0);
      }

      if (cycleTime < rate.inhale * 1000) {
        // Inhale phase - expand from smallest to largest
        if (currentPhaseLocal !== 'inhale') {
          console.log(`🔄 Switching to INHALE phase at ${cycleTime}ms`);
          currentPhaseLocal = 'inhale';
          setCurrentPhase('inhale');
          setPhaseTime(0);
          lastPhaseTime = 0;
        }
        
        // Calculate inhale progress (0 to 1)
        const inhaleProgress = cycleTime / (rate.inhale * 1000);
        
        // Use ease-in-out function for natural breathing rhythm
        const easedProgress = easeInOut(inhaleProgress);
        
        // Scale from MIN_SCALE to MAX_SCALE
        const newScale = MIN_SCALE + (easedProgress * SCALE_RANGE);
        setProgress(newScale);
        
        // Update phase time based on animation progress
        const currentPhaseTime = Math.floor(inhaleProgress * rate.inhale);
        if (currentPhaseTime !== lastPhaseTime) {
          setPhaseTime(currentPhaseTime);
          lastPhaseTime = currentPhaseTime;
          console.log(`⏱️ INHALE: ${currentPhaseTime}/${rate.inhale}s (phase: ${currentPhaseLocal}, scale: ${newScale.toFixed(3)})`);
        }
      } else {
        // Exhale phase - contract from largest to smallest
        if (currentPhaseLocal !== 'exhale') {
          console.log(`🔄 Switching to EXHALE phase at ${cycleTime}ms`);
          currentPhaseLocal = 'exhale';
          setCurrentPhase('exhale');
          setPhaseTime(0);
          lastPhaseTime = 0;
        }
        
        // Calculate exhale progress (0 to 1)
        const exhaleProgress = (cycleTime - (rate.inhale * 1000)) / (rate.exhale * 1000);
        
        // Use ease-in-out function for natural breathing rhythm
        const easedProgress = easeInOut(exhaleProgress);
        
        // Scale from MAX_SCALE to MIN_SCALE
        const newScale = MAX_SCALE - (easedProgress * SCALE_RANGE);
        setProgress(newScale);
        
        // Update phase time based on animation progress
        const currentPhaseTime = Math.floor(exhaleProgress * rate.exhale);
        if (currentPhaseTime !== lastPhaseTime) {
          setPhaseTime(currentPhaseTime);
          lastPhaseTime = currentPhaseTime;
          console.log(`⏱️ EXHALE: ${currentPhaseTime}/${rate.exhale}s (phase: ${currentPhaseLocal}, scale: ${newScale.toFixed(3)})`);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    console.log(`✅ Breathing cycle animation started successfully`);
  };

  // Smooth easing function for natural breathing rhythm
  const easeInOut = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Remove the old phase timer - timing is now handled in the animation loop
  // const startPhaseTimer = () => { ... };

  useEffect(() => {
    if (isActive) {
      startMainTimer();
      startBreathingCycle();
    }
    
    return () => {
      // Only cleanup if component is unmounting, not when dependencies change
      if (isActive) {
        cleanupExercise();
      }
    };
  }, [isActive]); // Remove rate, duration, onComplete dependencies that were causing issues

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseTime = () => {
    // Use the current phaseTime state directly since it's now managed by the animation loop
    return phaseTime;
  };

  const getCircleColor = () => {
    // Always return the correct color based on current phase
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

  const handleComplete = () => {
    console.log(`✅ Breathing exercise completed successfully! Duration: ${duration} minutes`);
    if (onComplete) {
      onComplete();
    }
  };

  const handleCloseClick = () => {
    console.log(`🔄 User clicked close button, showing confirmation popup`);
    setShowConfirmPopup(true);
  };

  const handleConfirmLeave = () => {
    console.log(`🚪 User confirmed leaving exercise, cleaning up...`);
    
    // Use cleanup function for consistent resource management
    cleanupExercise();
    
    // Use onLeave to navigate to Craving Support tab
    if (onLeave) {
      onLeave();
    } else {
      // Fallback to onClose if onLeave is not provided
      onClose();
    }
  };

  const handleStay = () => {
    setShowConfirmPopup(false);
  };

  const startExercise = () => {
    // Prevent multiple starts
    if (isActive) {
      console.log(`⚠️ Exercise already active, ignoring start request`);
      return;
    }
    
    console.log(`🎬 Starting breathing exercise: ${duration} minutes, rate: ${rate.name}`);
    console.log(`📊 Initial state - isActive: ${isActive}, progress: ${progress}, currentPhase: ${currentPhase}`);
    
    // Reset state before starting
    setProgress(MIN_SCALE);
    setCurrentPhase('inhale');
    setPhaseTime(0);
    setTimeRemaining(duration * 60);
    
    // Set active first, then start timers
    setIsActive(true);
    console.log(`✅ isActive set to true, starting timers...`);
    
    // Use setTimeout to ensure state is updated before starting timers
    setTimeout(() => {
      console.log(`🚀 Starting main timer and breathing cycle...`);
      startMainTimer();
      startBreathingCycle();
    }, 0);
  };

  const cleanupExercise = () => {
    console.log(`🧹 Cleaning up breathing exercise resources`);
    
    // Cancel animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Clear main timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset state
    setIsActive(false);
    setTimeRemaining(0);
    setProgress(MIN_SCALE);
    setCurrentPhase('inhale');
    setPhaseTime(0);
  };

  // Start the exercise when component mounts
  useEffect(() => {
    if (!isActive) {
      console.log(`🎬 Component mounted, starting breathing exercise automatically`);
      startExercise();
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        {/* Close Button - Enhanced for better usability */}
        <button
          onClick={handleCloseClick}
          className="w-11 h-11 flex items-center justify-center text-white hover:text-slate-300 transition-colors bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-slate-500/50 z-50"
          title="End breathing exercise"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="text-white text-2xl font-mono">{formatTime(timeRemaining)}</div>
        </div>
        
        <div className="w-11" /> {/* Spacer for centering */}
      </div>

      {/* Breathing Circle */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Outer Dotted Circle - Target boundary */}
        <div className="absolute w-80 h-80 border-2 border-dashed border-white/30 rounded-full" />
        
        {/* Animated Breathing Circle - Scales to match outer boundary */}
        <div 
          className={`w-20 h-20 bg-gradient-to-br ${getCircleColor()} rounded-full shadow-2xl`}
          style={{
            transform: `scale(${progress})`,
            transition: 'none', // Remove CSS transition for precise animation control
            boxShadow: `0 0 ${Math.max(progress * 40, 10)}px ${Math.max(progress * 15, 5)}px ${currentPhase === 'inhale' ? 'rgba(251, 146, 60, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`
          }}
        />
      </div>

      {/* Instructions */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center mb-4">
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

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 mx-4 max-w-sm w-full border border-slate-600/50">
            <div className="text-center mb-6">
              <h3 className="text-white text-xl font-bold mb-2">Want to stop now?</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Stay strong - resist the craving? If you leave now, you will not get the bonus points
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmLeave}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Leave
              </button>
              <button
                onClick={handleStay}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingExercise;
