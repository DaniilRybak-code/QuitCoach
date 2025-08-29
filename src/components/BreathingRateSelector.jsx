import React from 'react';

const BreathingRateSelector = ({ selectedRate, onSelect, onBack }) => {
  const breathingRates = [
    { name: 'INTRO', inhale: 3, exhale: 6 },
    { name: 'BASIC', inhale: 5, exhale: 10 },
    { name: 'INTERMEDIATE', inhale: 10, exhale: 20 },
    { name: 'ADVANCED', inhale: 20, exhale: 40 },
    { name: 'ELITE', inhale: 30, exhale: 60 }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">BREATHING RATE</h2>
        <p className="text-slate-400">Choose your breathing pattern</p>
      </div>

      {/* Breathing Rate Options */}
      <div className="space-y-4 mb-8">
        {breathingRates.map((rate) => (
          <div
            key={rate.name}
            onClick={() => onSelect(rate)}
            className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
              selectedRate.name === rate.name
                ? 'bg-white text-slate-900 border-white shadow-lg'
                : 'bg-slate-800/50 text-white border-slate-600/30 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className={`font-bold text-lg ${
                  selectedRate.name === rate.name ? 'text-slate-900' : 'text-white'
                }`}>
                  {rate.name}
                </div>
                <div className={`text-sm ${
                  selectedRate.name === rate.name ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {rate.inhale}s inhale | {rate.exhale}s exhale
                </div>
              </div>
              {selectedRate.name === rate.name && (
                <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 border border-slate-600/30"
      >
        Back to Setup
      </button>
    </div>
  );
};

export default BreathingRateSelector;
