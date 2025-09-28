import React from 'react';

const BreathingSetup = ({ selectedRate, duration, onRateSelect, onDurationSelect, onStartExercise }) => {
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Breathing Exercise</h2>
        <p className="text-slate-400 text-sm">Configure your breathing session</p>
      </div>

      {/* Rate and Duration Cards - Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Breathing Rate Card */}
        <div 
          onClick={onRateSelect}
          className="bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl p-4 border border-slate-600/30 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors flex-shrink-0">
              <span className="text-lg">🫁</span>
            </div>
            <div className="text-white font-semibold text-sm">BREATHING RATE</div>
          </div>
          <div className="text-white font-bold text-sm">{selectedRate.name}</div>
          <div className="text-slate-400 text-xs">{selectedRate.inhale}s | {selectedRate.exhale}s</div>
        </div>

        {/* Duration Card */}
        <div 
          onClick={onDurationSelect}
          className="bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl p-4 border border-slate-600/30 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors flex-shrink-0">
              <span className="text-lg">⏱️</span>
            </div>
            <div className="text-white font-semibold text-sm">DURATION</div>
          </div>
          <div className="text-white font-bold text-sm">{duration}min.</div>
          <div className="text-slate-400 text-xs">Total time</div>
        </div>
      </div>

      {/* Start Exercise Button */}
      <button
        onClick={onStartExercise}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-h-[44px]"
      >
        START EXERCISE
      </button>

      {/* Instructions */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-slate-400 text-xs sm:text-sm">
          Find a comfortable position and prepare to relax
        </p>
      </div>
    </div>
  );
};

export default BreathingSetup;
