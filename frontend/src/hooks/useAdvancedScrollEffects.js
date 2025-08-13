'use client';
import { useEffect, useRef, useState } from 'react';

// Hook for parallax scrolling effects
export const useParallax = (speed = 0.5, options = {}) => {
  const elementRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const { horizontal = false, direction = 1 } = options;

  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return;
    
    let ticking = false;

    const updatePosition = () => {
      if (!elementRef.current) return;

      const scrolled = window.pageYOffset;
      const rate = scrolled * speed * direction;
      
      setOffset(rate);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    // Initialize position immediately
    updatePosition();
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  const style = horizontal 
    ? { transform: `translateX(${offset}px)` }
    : { transform: `translateY(${offset}px)` };

  return [elementRef, style];
};

// Hook for scroll-triggered number counters
export const useScrollCounter = (end, options = {}) => {
  const elementRef = useRef(null);
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const {
    start = 0,
    duration = 2000,
    easing = 'easeOutExpo',
    threshold = 0.3
  } = options;

  const easingFunctions = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          
          const startTime = Date.now();
          const range = end - start;
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = easingFunctions[easing](progress);
            const currentCount = start + (range * easedProgress);
            
            setCount(Math.round(currentCount));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          animate();
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [end, start, duration, easing, threshold, hasStarted]);

  return [elementRef, count];
};

// Hook for scroll-triggered text reveal
export const useTextReveal = (options = {}) => {
  const elementRef = useRef(null);
  const [revealedChars, setRevealedChars] = useState(0);
  const [text, setText] = useState('');
  
  const {
    delay = 50,
    threshold = 0.3,
    randomize = false
  } = options;

  useEffect(() => {
    if (elementRef.current) {
      setText(elementRef.current.textContent || '');
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const textLength = text.length;
          let currentChar = 0;
          
          const revealNext = () => {
            if (currentChar < textLength) {
              setRevealedChars(currentChar + 1);
              currentChar++;
              
              const nextDelay = randomize ? 
                delay + Math.random() * delay : 
                delay;
              
              setTimeout(revealNext, nextDelay);
            }
          };
          
          revealNext();
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [text, delay, threshold, randomize]);

  const getRevealedText = () => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        style={{
          opacity: index < revealedChars ? 1 : 0,
          transition: 'opacity 0.1s ease'
        }}
      >
        {char}
      </span>
    ));
  };

  return [elementRef, getRevealedText];
};

// Hook for scroll-triggered background change
export const useScrollBackground = (colors, options = {}) => {
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const { smooth = true, offset = 0 } = options;

  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY + offset) / 
        (document.documentElement.scrollHeight - window.innerHeight);
      
      const colorIndex = Math.min(
        Math.floor(scrollPercentage * colors.length),
        colors.length - 1
      );
      
      if (smooth && colorIndex < colors.length - 1) {
        const localProgress = (scrollPercentage * colors.length) % 1;
        const color1 = colors[colorIndex];
        const color2 = colors[colorIndex + 1];
        
        // Simple color interpolation (works with hex colors)
        setCurrentColor(interpolateColor(color1, color2, localProgress));
      } else {
        setCurrentColor(colors[colorIndex]);
      }
    };

    // Initialize color immediately
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [colors, smooth, offset]);

  return currentColor;
};

// Helper function for color interpolation
const interpolateColor = (color1, color2, factor) => {
  if (factor <= 0) return color1;
  if (factor >= 1) return color2;
  
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Hook for scroll-triggered morphing shapes
export const useScrollMorph = (paths, options = {}) => {
  const [currentPath, setCurrentPath] = useState(paths[0]);
  const { smooth = true } = options;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = window.scrollY / 
        (document.documentElement.scrollHeight - window.innerHeight);
      
      const pathIndex = Math.min(
        Math.floor(scrollPercentage * paths.length),
        paths.length - 1
      );
      
      setCurrentPath(paths[pathIndex]);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [paths, smooth]);

  return currentPath;
};

// Hook for magnetic scroll effects
export const useMagnetic = (strength = 0.3) => {
  const elementRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: 'transform 0.3s ease-out'
  };

  return [elementRef, style];
};
