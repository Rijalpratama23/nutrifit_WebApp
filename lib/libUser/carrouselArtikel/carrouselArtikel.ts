// lib/useCarousel.ts
import { useState, useEffect } from 'react';

export function useCarousel(length: number, interval = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, interval);
    return () => clearInterval(timer);
  }, [length, interval]);

  return { currentIndex, setCurrentIndex };
}
