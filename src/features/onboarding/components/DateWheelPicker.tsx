import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface DateWheelPickerModalProps {
  isOpen: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
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
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
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
    <div className="relative h-[200px] overflow-hidden">
      {/* Selection indicator */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        style={{ height: `${itemHeight}px` }}
      >
        <div className="h-full border-y-2 border-blue-500 bg-blue-500/5"></div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-800 to-transparent pointer-events-none z-20"></div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none z-20"></div>

      {/* Scrollable items */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
        style={{
          paddingTop: `${80}px`,
          paddingBottom: `${80}px`,
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

export function DateWheelPickerModal({
  isOpen,
  value,
  onChange,
  onClose,
  minDate = new Date(new Date().getFullYear() - 50, 0, 1),
  maxDate = new Date(),
  title = 'Select Date',
}: DateWheelPickerModalProps) {
  const [tempDate, setTempDate] = useState(value);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (isOpen) {
      setTempDate(value);
    }
  }, [isOpen, value]);

  if (!isOpen) return null;

  const currentMonth = tempDate.getMonth();
  const currentYear = tempDate.getFullYear();
  const currentDay = tempDate.getDate();

  // Generate years
  const years = Array.from(
    { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
    (_, i) => ({
      value: minDate.getFullYear() + i,
      label: String(minDate.getFullYear() + i),
    })
  );

  // Generate months
  const monthItems = months.map((month, index) => ({
    value: index,
    label: month,
  }));

  // Generate days based on current month and year
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  const handleMonthChange = (index: number) => {
    const newDate = new Date(currentYear, index, Math.min(currentDay, new Date(currentYear, index + 1, 0).getDate()));
    setTempDate(newDate);
  };

  const handleDayChange = (index: number) => {
    const newDate = new Date(currentYear, currentMonth, index + 1);
    setTempDate(newDate);
  };

  const handleYearChange = (index: number) => {
    const newYear = years[index].value;
    const newDate = new Date(newYear, currentMonth, Math.min(currentDay, new Date(newYear, currentMonth + 1, 0).getDate()));
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    onChange(tempDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg mx-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Date Display */}
        <div className="px-6 pt-4">
          <div className="text-center p-4 bg-slate-700/50 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Selected Date</p>
            <p className="text-2xl font-bold text-white">
              {tempDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Wheel Pickers */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-xs font-medium text-gray-400 text-center mb-2">
                Month
              </div>
              <WheelPicker
                items={monthItems}
                selectedIndex={currentMonth}
                onChange={handleMonthChange}
              />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-400 text-center mb-2">
                Day
              </div>
              <WheelPicker
                items={days}
                selectedIndex={currentDay - 1}
                onChange={handleDayChange}
              />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-400 text-center mb-2">
                Year
              </div>
              <WheelPicker
                items={years}
                selectedIndex={years.findIndex(y => y.value === currentYear)}
                onChange={handleYearChange}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-slate-600 text-gray-300 rounded-xl font-medium hover:bg-slate-700 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all shadow-lg"
          >
            Confirm
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
