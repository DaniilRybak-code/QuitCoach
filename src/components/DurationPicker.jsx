import React, { useState, useRef, useEffect } from 'react';

const DurationPicker = ({ selectedDuration, onSelect, onBack }) => {
  const [currentDuration, setCurrentDuration] = useState(selectedDuration);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScroll, setStartScroll] = useState(0);
  const pickerRef = useRef(null);

  const durations = Array.from({ length: 9 }, (_, i) => i + 2); // 2 to 10 minutes

  useEffect(() => {
    setCurrentDuration(selectedDuration);
  }, [selectedDuration]);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartScroll(pickerRef.current.scrollTop);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const deltaY = startY - e.touches[0].clientY;
    const newScrollTop = startScroll + deltaY;
    
    if (pickerRef.current) {
      pickerRef.current.scrollTop = newScrollTop;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Snap to nearest duration
    if (pickerRef.current) {
      const itemHeight = 80; // Height of each duration item
      const scrollTop = pickerRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const snappedDuration = durations[Math.max(0, Math.min(index, durations.length - 1))];
      
      setCurrentDuration(snappedDuration);
      
      // Smooth scroll to snapped position
      pickerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleDurationClick = (duration) => {
    setCurrentDuration(duration);
    
    // Scroll to position
    if (pickerRef.current) {
      const index = durations.indexOf(duration);
      const itemHeight = 80;
      pickerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSave = () => {
    onSelect(currentDuration);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">DURATION</h2>
        <p className="text-slate-400">Choose your session length</p>
      </div>

      {/* Duration Picker */}
      <div className="relative mb-8">
        {/* Selection Indicator */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-20 bg-slate-700/30 rounded-xl border-2 border-slate-500/50 pointer-events-none z-10" />
        
        {/* Picker Container */}
        <div 
          ref={pickerRef}
          className="h-60 overflow-hidden relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Spacer for centering */}
          <div className="h-20" />
          
          {/* Duration Options */}
          <div className="space-y-0">
            {durations.map((duration) => (
              <div
                key={duration}
                onClick={() => handleDurationClick(duration)}
                className={`h-20 flex items-center justify-center text-4xl font-bold cursor-pointer transition-all duration-200 ${
                  currentDuration === duration 
                    ? 'text-white scale-110' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {duration}
              </div>
            ))}
          </div>
          
          {/* Bottom Spacer for centering */}
          <div className="h-20" />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
      >
        SAVE
      </button>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full mt-4 bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 border border-slate-600/30"
      >
        Back to Setup
      </button>
    </div>
  );
};

export default DurationPicker;
