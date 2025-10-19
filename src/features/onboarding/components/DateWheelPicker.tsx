import { useState, useRef, useEffect } from 'react';

interface DateWheelPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
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

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    setCurrentTranslate(-selectedIndex * itemHeight + diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Calculate nearest item
    const index = Math.round(-currentTranslate / itemHeight);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    onChange(clampedIndex);
  };

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
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent pointer-events-none z-20"></div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-20"></div>

      {/* Scrollable items */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-col items-center cursor-grab active:cursor-grabbing"
        style={{
          paddingTop: `${80}px`,
          paddingBottom: `${80}px`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
                className="flex items-center justify-center font-medium select-none"
                style={{
                  height: `${itemHeight}px`,
                  opacity,
                  transform: `scale(${scale})`,
                  transition: isDragging ? 'none' : 'all 0.2s ease-out',
                }}
                onClick={() => onChange(index)}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DateWheelPicker({
  value,
  onChange,
  minDate = new Date(new Date().getFullYear() - 50, 0, 1),
  maxDate = new Date(),
  label,
}: DateWheelPickerProps) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = value.getMonth();
  const currentYear = value.getFullYear();
  const currentDay = value.getDate();

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
    onChange(newDate);
  };

  const handleDayChange = (index: number) => {
    const newDate = new Date(currentYear, currentMonth, index + 1);
    onChange(newDate);
  };

  const handleYearChange = (index: number) => {
    const newYear = years[index].value;
    const newDate = new Date(newYear, currentMonth, Math.min(currentDay, new Date(newYear, currentMonth + 1, 0).getDate()));
    onChange(newDate);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-xs font-medium text-gray-500 text-center mb-2">
              Month
            </div>
            <WheelPicker
              items={monthItems}
              selectedIndex={currentMonth}
              onChange={handleMonthChange}
            />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 text-center mb-2">
              Day
            </div>
            <WheelPicker
              items={days}
              selectedIndex={currentDay - 1}
              onChange={handleDayChange}
            />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 text-center mb-2">
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
    </div>
  );
}

