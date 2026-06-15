// lib/useCarousel.js
import { useState, useEffect } from 'react';

export function useCarousel(length: number, interval: number = 3000) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, interval);

    return () => clearInterval(timer);
  }, [length, interval]);

  return { currentSlide, setCurrentSlide };
}
