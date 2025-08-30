import React, { useState, useEffect } from 'react';
import BreathingSetup from './BreathingSetup';
import BreathingRateSelector from './BreathingRateSelector';
import DurationPicker from './DurationPicker';
import BreathingExercise from './BreathingExercise';

const BreathingModal = ({ isOpen, onClose, onNavigateToCravingSupport }) => {
  const [modalStep, setModalStep] = useState('setup');
  const [selectedRate, setSelectedRate] = useState({
    name: 'INTERMEDIATE',
    inhale: 10,
    exhale: 20
  });
  const [duration, setDuration] = useState(4); // minutes
  const [isExerciseActive, setIsExerciseActive] = useState(false);

  // Reset modal state when opening
  useEffect(() => {
    if (isOpen) {
      setModalStep('setup');
      setIsExerciseActive(false);
    }
  }, [isOpen]);

  const handleRateSelect = (rate) => {
    setSelectedRate(rate);
    setModalStep('setup');
  };

  const handleDurationSelect = (selectedDuration) => {
    setDuration(selectedDuration);
    setModalStep('setup');
  };

  const handleStartExercise = () => {
    setIsExerciseActive(true);
    setModalStep('exercise');
  };

  const handleExerciseComplete = () => {
    setIsExerciseActive(false);
    setModalStep('setup');
    onClose();
  };

  const handleClose = () => {
    if (modalStep === 'exercise' && isExerciseActive) {
      // Don't allow closing during active exercise
      return;
    }
    onClose();
  };

  const handleExerciseLeave = () => {
    console.log(`🚪 User leaving breathing exercise via close button`);
    // Close the modal and navigate to craving support tab
    onClose();
    if (onNavigateToCravingSupport) {
      onNavigateToCravingSupport();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md mx-4 bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
        {/* Close Button - Only show when NOT in active exercise */}
        {!(modalStep === 'exercise' && isExerciseActive) && (
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center text-white hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Modal Steps */}
        {modalStep === 'setup' && (
          <BreathingSetup
            selectedRate={selectedRate}
            duration={duration}
            onRateSelect={() => setModalStep('rate')}
            onDurationSelect={() => setModalStep('duration')}
            onStartExercise={handleStartExercise}
          />
        )}

        {modalStep === 'rate' && (
          <BreathingRateSelector
            selectedRate={selectedRate}
            onSelect={handleRateSelect}
            onBack={() => setModalStep('setup')}
          />
        )}

        {modalStep === 'duration' && (
          <DurationPicker
            selectedDuration={duration}
            onSelect={handleDurationSelect}
            onBack={() => setModalStep('setup')}
          />
        )}

        {modalStep === 'exercise' && (
          <BreathingExercise
            rate={selectedRate}
            duration={duration}
            onComplete={handleExerciseComplete}
            onClose={handleClose}
            onLeave={handleExerciseLeave}
          />
        )}
      </div>
    </div>
  );
};

export default BreathingModal;
