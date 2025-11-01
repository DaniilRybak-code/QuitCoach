import React from 'react';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export function OnboardingProgressBar({ currentStep, totalSteps = 10 }: OnboardingProgressBarProps) {
  return (
    <div className="flex justify-between items-center mb-8 overflow-x-auto">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNumber) => (
        <div key={stepNumber} className="flex items-center flex-shrink-0">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            stepNumber <= currentStep ? 'bg-blue-500 text-white' : 'bg-slate-600 text-gray-400'
          }`}>
            {stepNumber < currentStep ? '✓' : stepNumber}
          </div>
          {stepNumber < totalSteps && (
            <div className={`w-4 h-1 mx-1 ${
              stepNumber < currentStep ? 'bg-blue-500' : 'bg-slate-600'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

