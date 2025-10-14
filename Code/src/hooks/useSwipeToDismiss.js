import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for implementing swipe-to-dismiss functionality on modals
 * @param {Function} onDismiss - Callback function to execute when modal should be dismissed
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Minimum distance to trigger dismiss (default: 100)
 * @param {number} options.velocity - Minimum velocity to trigger dismiss (default: 0.5)
 * @param {boolean} options.enabled - Whether swipe-to-dismiss is enabled (default: true)
 * @returns {Object} - Object containing refs and classes for the modal
 */
export const useSwipeToDismiss = (onDismiss, options = {}) => {
  const {
    threshold = 100,
    velocity = 0.5,
    enabled = true
  } = options;

  const [isSwipping, setIsSwipping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  
  const modalRef = useRef(null);
  const startY = useRef(0);
  const startX = useRef(0);
  const startTime = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    if (!enabled || !modalRef.current) return;

    const modal = modalRef.current;
    let isDragging = false;

    const handleTouchStart = (e) => {
      if (!enabled) return;
      
      const touch = e.touches[0];
      startY.current = touch.clientY;
      startX.current = touch.clientX;
      startTime.current = Date.now();
      lastY.current = touch.clientY;
      lastTime.current = Date.now();
      isDragging = true;
      setIsSwipping(true);
      
      // Add swiping class to prevent transitions during drag
      modal.classList.add('swiping');
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !enabled) return;
      
      e.preventDefault(); // Prevent scrolling while swiping
      
      const touch = e.touches[0];
      const deltaY = touch.clientY - startY.current;
      const deltaX = touch.clientX - startX.current;
      
      // Only allow vertical swipes (ignore horizontal)
      if (Math.abs(deltaX) > Math.abs(deltaY)) return;
      
      setSwipeDistance(deltaY);
      
      if (deltaY > 0) {
        setSwipeDirection('down');
        modal.style.transform = `translateY(${Math.min(deltaY, threshold * 1.5)}px)`;
        modal.style.opacity = Math.max(0.3, 1 - (deltaY / (threshold * 2)));
      } else if (deltaY < 0) {
        setSwipeDirection('up');
        modal.style.transform = `translateY(${Math.max(deltaY, -threshold * 1.5)}px)`;
        modal.style.opacity = Math.max(0.3, 1 - (Math.abs(deltaY) / (threshold * 2)));
      }
      
      lastY.current = touch.clientY;
      lastTime.current = Date.now();
    };

    const handleTouchEnd = (e) => {
      if (!isDragging || !enabled) return;
      
      isDragging = false;
      setIsSwipping(false);
      
      const touch = e.changedTouches[0];
      const deltaY = touch.clientY - startY.current;
      const deltaTime = Date.now() - startTime.current;
      const velocityY = Math.abs(deltaY) / deltaTime;
      
      // Reset modal position
      modal.style.transform = '';
      modal.style.opacity = '';
      modal.classList.remove('swiping');
      
      // Check if swipe should trigger dismiss
      if (Math.abs(deltaY) > threshold || velocityY > velocity) {
        if (deltaY > 0 && swipeDirection === 'down') {
          // Swipe down to dismiss
          handleDismiss('down');
        } else if (deltaY < 0 && swipeDirection === 'up') {
          // Swipe up to dismiss
          handleDismiss('up');
        }
      }
      
      setSwipeDirection(null);
      setSwipeDistance(0);
    };

    const handleDismiss = (direction) => {
      // Add exit animation class
      modal.classList.add(`swipe-${direction}`);
      
      // Call onDismiss after animation
      setTimeout(() => {
        if (typeof onDismiss === 'function') {
          onDismiss();
        }
      }, 200);
    };

    // Add event listeners
    modal.addEventListener('touchstart', handleTouchStart, { passive: false });
    modal.addEventListener('touchmove', handleTouchMove, { passive: false });
    modal.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      modal.removeEventListener('touchstart', handleTouchStart);
      modal.removeEventListener('touchmove', handleTouchMove);
      modal.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, velocity, swipeDirection]);

  return {
    modalRef,
    isSwipping,
    swipeDirection,
    swipeDistance,
    classes: `modal-swipe-dismiss ${isSwipping ? 'swiping' : ''} ${swipeDirection ? `swipe-${swipeDirection}` : ''}`
  };
};

export default useSwipeToDismiss;
