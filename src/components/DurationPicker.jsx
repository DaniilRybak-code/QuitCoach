import React, { useState, useEffect } from 'react';

const DurationPicker = ({ selectedDuration, onSelect, onBack }) => {
  const [currentDuration, setCurrentDuration] = useState(selectedDuration);
  
  const minDuration = 2;
  const maxDuration = 10;

  useEffect(() => {
    setCurrentDuration(selectedDuration);
  }, [selectedDuration]);

  const handleSliderChange = (e) => {
    const newDuration = parseInt(e.target.value);
    setCurrentDuration(newDuration);
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    console.log(`🎯 Duration picker: Selected ${newDuration} minutes`);
  };

  const handleSave = () => {
    onSelect(currentDuration);
  };

  const getDurationLabel = (duration) => {
    if (duration <= 3) return "Short Session";
    if (duration <= 6) return "Medium Session";
    if (duration <= 8) return "Long Session";
    return "Extended Session";
  };

  const getDurationColor = (duration) => {
    if (duration <= 3) return "text-green-400";
    if (duration <= 6) return "text-blue-400";
    if (duration <= 8) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">DURATION</h2>
        <p className="text-slate-400">Choose your session length</p>
      </div>

      {/* Large Duration Display */}
      <div className="text-center mb-8">
        <div className={`text-8xl font-bold ${getDurationColor(currentDuration)} mb-2`}>
          {currentDuration} mins
        </div>
        <div className={`text-xl font-medium ${getDurationColor(currentDuration)}`}>
          {getDurationLabel(currentDuration)}
        </div>
      </div>

      {/* Duration Slider */}
      <div className="mb-8">
        <input
          type="range"
          min={minDuration}
          max={maxDuration}
          step={1}
          value={currentDuration}
          onChange={handleSliderChange}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((currentDuration - minDuration) / (maxDuration - minDuration)) * 100}%, #475569 ${((currentDuration - minDuration) / (maxDuration - minDuration)) * 100}%, #475569 100%)`
          }}
          className="w-full h-4 rounded-lg appearance-none cursor-pointer slider mb-4"
          autoComplete="off"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg transform active:scale-95"
      >
        SAVE
      </button>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full mt-4 bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
      >
        Back to Setup
      </button>
    </div>
  );
};

export default DurationPicker;
