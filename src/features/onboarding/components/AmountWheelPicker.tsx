import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface AmountWheelPickerModalProps {
  isOpen: boolean;
  value: number;
  onChange: (amount: number) => void;
  onClose: () => void;
  title?: string;
}

interface WheelPickerProps {
  items: Array<{ value: number; label: string }>;
  selectedIndex: number;
  onChange: (index: number) => void;
  itemHeight?: number;
}

function WheelPicker({ items, selectedIndex, onChange, itemHeight = 40 }: WheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  useEffect(() => {
    setCurrentTranslate(-selectedIndex * itemHeight);
  }, [selectedIndex, itemHeight]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    setCurrentTranslate(-selectedIndex * itemHeight + diff);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const currentY = e.clientY;
    const diff = currentY - startY;
    setCurrentTranslate(-selectedIndex * itemHeight + diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Calculate nearest item
    const index = Math.round(-currentTranslate / itemHeight);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    onChange(clampedIndex);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleEnd);
      };
    }
  }, [isDragging, currentTranslate, items.length]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(items.length - 1, selectedIndex + delta));
    onChange(newIndex);
  };

  return (
    <div className="relative h-[160px] sm:h-[180px] overflow-hidden">
      {/* Selection indicator */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        style={{ height: `${itemHeight}px` }}
      >
        <div className="h-full border-y-2 border-blue-500 bg-blue-500/5"></div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-12 sm:h-16 bg-gradient-to-b from-slate-800 to-transparent pointer-events-none z-20"></div>
      <div className="absolute inset-x-0 bottom-0 h-12 sm:h-16 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none z-20"></div>

      {/* Scrollable items */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
        style={{
          paddingTop: `${60}px`,
          paddingBottom: `${60}px`,
          touchAction: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div
          className="transition-transform duration-200"
          style={{
            transform: `translateY(${currentTranslate}px)`,
            transitionProperty: isDragging ? 'none' : 'transform',
          }}
        >
          {items.map((item, index) => {
            const distance = Math.abs(index - selectedIndex);
            const opacity = Math.max(0.2, 1 - distance * 0.3);
            const scale = Math.max(0.7, 1 - distance * 0.15);

            return (
              <div
                key={item.value}
                className="flex items-center justify-center font-medium"
                style={{
                  height: `${itemHeight}px`,
                  opacity,
                  transform: `scale(${scale})`,
                  transition: isDragging ? 'none' : 'all 0.2s ease-out',
                  color: index === selectedIndex ? '#ffffff' : '#9ca3af',
                }}
                onClick={() => onChange(index)}
              >
                <span className="cursor-pointer">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AmountWheelPickerModal({
  isOpen,
  value,
  onChange,
  onClose,
  title = 'Select Amount',
}: AmountWheelPickerModalProps) {
  const [tempAmount, setTempAmount] = useState(value);

  useEffect(() => {
    if (isOpen) {
      setTempAmount(value);
      // Lock body scroll on mobile
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore body scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen, value]);

  if (!isOpen) return null;

  // Generate amounts from £0 to £500 in £5 increments
  const amounts = Array.from({ length: 101 }, (_, i) => ({
    value: i * 5,
    label: `£${i * 5}`,
  }));

  const selectedIndex = amounts.findIndex(item => item.value === tempAmount);

  const handleAmountChange = (index: number) => {
    setTempAmount(amounts[index].value);
  };

  const handleConfirm = () => {
    onChange(tempAmount);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-8"
      style={{ 
        touchAction: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '10vh',
        paddingBottom: '10vh'
      }}
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-slate-800 rounded-3xl w-full sm:max-w-lg shadow-2xl animate-fade-scale flex flex-col"
        style={{ 
          touchAction: 'none',
          maxHeight: '80vh',
          margin: 'auto',
          minHeight: 'auto'
        }}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="px-6 pt-4">
          <div className="text-center p-4 bg-slate-700/50 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Selected Amount</p>
            <p className="text-2xl font-bold text-white">
              £{tempAmount}
            </p>
            <p className="text-xs text-gray-500 mt-1">per week</p>
          </div>
        </div>

        {/* Wheel Picker */}
        <div className="p-4 sm:p-6 overflow-hidden flex-1" style={{ touchAction: 'none' }}>
          <div className="flex justify-center">
            <div className="w-48">
              <div className="text-xs font-medium text-gray-400 text-center mb-2">
                Weekly Spend
              </div>
              <WheelPicker
                items={amounts}
                selectedIndex={selectedIndex}
                onChange={handleAmountChange}
              />
            </div>
          </div>
        </div>

        {/* Common Ranges Info */}
        <div className="px-6 pb-4">
          <div className="p-3 bg-slate-700/40 rounded-lg">
            <p className="text-gray-300 text-xs font-medium mb-2">Common ranges:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>• Light user: £20-40/week</p>
              <p>• Moderate: £40-70/week</p>
              <p>• Heavy: £70-150/week</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 sm:p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 sm:px-6 py-3 border-2 border-slate-600 text-gray-300 rounded-xl font-medium hover:bg-slate-700 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all shadow-lg"
          >
            Confirm
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-scale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-scale {
          animation: fade-scale 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
