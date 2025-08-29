import React from 'react';

const BreathingSetup = ({ selectedRate, duration, onRateSelect, onDurationSelect, onStartExercise }) => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Breathing Exercise</h2>
        <p className="text-slate-400">Configure your breathing session</p>
      </div>

      {/* Breathing Rate Card */}
      <div 
        onClick={onRateSelect}
        className="bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl p-6 mb-6 border border-slate-600/30 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
              <span className="text-2xl">🫁</span>
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-lg">BREATHING RATE</div>
              <div className="text-slate-400 text-sm">{selectedRate.inhale}s | {selectedRate.exhale}s</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-lg">{selectedRate.name}</div>
            <div className="text-slate-400 text-sm">{selectedRate.inhale}s | {selectedRate.exhale}s</div>
          </div>
        </div>
      </div>

      {/* Duration Card */}
      <div 
        onClick={onDurationSelect}
        className="bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl p-6 mb-8 border border-slate-600/30 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-lg">DURATION</div>
              <div className="text-slate-400 text-sm">Session length</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-lg">{duration}min.</div>
            <div className="text-slate-400 text-sm">Total time</div>
          </div>
        </div>
      </div>

      {/* Start Exercise Button */}
      <button
        onClick={onStartExercise}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
      >
        START EXERCISE
      </button>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-slate-400 text-sm">
          Find a comfortable position and prepare to relax
        </p>
      </div>
    </div>
  );
};

export default BreathingSetup;
