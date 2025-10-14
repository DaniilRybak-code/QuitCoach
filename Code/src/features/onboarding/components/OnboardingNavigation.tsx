import React from 'react';
import { ArrowRight } from 'lucide-react';

interface OnboardingNavigationProps {
  step: number;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  isLastStep?: boolean;
}

export function OnboardingNavigation({ 
  step, 
  canProceed, 
  onBack, 
  onNext, 
  isLastStep = false 
}: OnboardingNavigationProps) {
  return (
    <div className="flex justify-between">
      {step > 1 && (
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
        >
          Back
        </button>
      )}
      
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`ml-auto px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
          canProceed
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-slate-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLastStep ? 'Start Journey' : 'Next'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

