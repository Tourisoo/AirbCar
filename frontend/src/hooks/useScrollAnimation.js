'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// Advanced scroll animation hook with performance optimizations
export const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
    trackProgress = false,
    respectMotionPreference = true
  } = options;

  // Check for reduced motion preference
  useEffect(() => {
    if (respectMotionPreference && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      
      const handleChange = (e) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [respectMotionPreference]);

  // Calculate scroll progress for advanced animations
  const calculateScrollProgress = useCallback((entry) => {
    if (!trackProgress) return;
    
    const { boundingClientRect, rootBounds } = entry;
    const elementHeight = boundingClientRect.height;
    const windowHeight = rootBounds?.height || window.innerHeight;
    
    const elementTop = boundingClientRect.top;
    const elementBottom = boundingClientRect.bottom;
    
    if (elementTop <= windowHeight && elementBottom >= 0) {
      let progress = 0;
      
      if (elementTop <= 0) {
        progress = Math.min(1, (windowHeight + elementTop) / elementHeight);
      } else {
        progress = Math.min(1, (windowHeight - elementTop) / windowHeight);
      }
      
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    }
  }, [trackProgress]);

  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        calculateScrollProgress(entry);
        
        if (entry.isIntersecting) {
          const animationDelay = isReducedMotion ? 0 : delay;
          
          setTimeout(() => {
            setIsVisible(true);
            if (triggerOnce) {
              setHasAnimated(true);
            }
          }, animationDelay);
        } else if (!triggerOnce && !hasAnimated) {
          setIsVisible(false);
        }
      },
      {
        threshold: Array.isArray(threshold) ? threshold : [threshold],
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
      
      // Check if element is already visible on mount (for refresh scenarios)
      const rect = currentElement.getBoundingClientRect();
      const isCurrentlyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isCurrentlyVisible && !hasAnimated) {
        const animationDelay = isReducedMotion ? 0 : Math.min(delay, 100); // Cap delay at 100ms for refresh
        setTimeout(() => {
          setIsVisible(true);
          if (triggerOnce) {
            setHasAnimated(true);
          }
        }, animationDelay);
      }
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated, calculateScrollProgress, isReducedMotion]);

  return [elementRef, isVisible, { scrollProgress, isReducedMotion, hasAnimated }];
};

// Enhanced Animation variants with more options
export const animations = {
  // Basic animations
  fadeInUp: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${options.distance || '30px'})`,
    transition: `all ${options.duration || '0.6s'} ${options.easing || 'ease-out'}`
  }),
  
  fadeInDown: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(-${options.distance || '30px'})`,
    transition: `all ${options.duration || '0.6s'} ${options.easing || 'ease-out'}`
  }),
  
  fadeInLeft: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : `translateX(-${options.distance || '30px'})`,
    transition: `all ${options.duration || '0.6s'} ${options.easing || 'ease-out'}`
  }),
  
  fadeInRight: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : `translateX(${options.distance || '30px'})`,
    transition: `all ${options.duration || '0.6s'} ${options.easing || 'ease-out'}`
  }),
  
  scaleIn: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : `scale(${options.scale || '0.8'})`,
    transition: `all ${options.duration || '0.6s'} ${options.easing || 'ease-out'}`
  }),
  
  slideInUp: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${options.distance || '50px'})`,
    transition: `all ${options.duration || '0.8s'} ${options.easing || 'ease-out'}`
  }),

  staggeredFadeInUp: (isVisible, index = 0, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${options.distance || '30px'})`,
    transition: `all ${options.duration || '0.6s'} ${options.easing || 'ease-out'} ${index * (options.staggerDelay || 0.1)}s`
  }),

  // Advanced animations
  bounceIn: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.3)',
    transition: `all ${options.duration || '0.6s'} cubic-bezier(0.68, -0.55, 0.265, 1.55)`
  }),

  rotateIn: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'rotate(0deg) scale(1)' : `rotate(${options.rotation || '-180deg'}) scale(${options.scale || '0.8'})`,
    transition: `all ${options.duration || '0.8s'} ${options.easing || 'ease-out'}`
  }),

  flipInY: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'rotateY(0deg)' : `rotateY(${options.rotation || '90deg'})`,
    transition: `all ${options.duration || '0.6s'} ${options.easing || 'ease-out'}`,
    transformStyle: 'preserve-3d'
  }),

  slideAndScale: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? 'translateY(0) scale(1)' 
      : `translateY(${options.distance || '40px'}) scale(${options.scale || '0.9'})`,
    transition: `all ${options.duration || '0.7s'} ${options.easing || 'ease-out'}`
  }),

  // Progress-based animations
  progressFade: (progress) => ({
    opacity: progress,
    transform: `translateY(${(1 - progress) * 30}px)`,
    transition: 'none'
  }),

  progressScale: (progress) => ({
    opacity: progress,
    transform: `scale(${0.8 + (progress * 0.2)})`,
    transition: 'none'
  }),

  // Parallax effect
  parallax: (scrollProgress, options = {}) => ({
    transform: `translateY(${scrollProgress * (options.speed || 50)}px)`,
    transition: 'none'
  }),

  // Complex combinations
  morphIn: (isVisible, options = {}) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? 'translateY(0) scale(1) rotate(0deg)' 
      : `translateY(${options.distance || '30px'}) scale(${options.scale || '0.8'}) rotate(${options.rotation || '5deg'})`,
    filter: isVisible ? 'blur(0px)' : `blur(${options.blur || '2px'})`,
    transition: `all ${options.duration || '0.8s'} ${options.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'}`
  }),

  glideIn: (isVisible, direction = 'left', options = {}) => {
    const transforms = {
      left: `translateX(-${options.distance || '100px'})`,
      right: `translateX(${options.distance || '100px'})`,
      up: `translateY(-${options.distance || '100px'})`,
      down: `translateY(${options.distance || '100px'})`
    };
    
    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate(0, 0)' : transforms[direction],
      transition: `all ${options.duration || '0.8s'} ${options.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'}`
    };
  },

  // Micro-interactions
  hoverLift: {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease'
  },

  hoverScale: {
    transform: 'scale(1.05)',
    transition: 'all 0.3s ease'
  },

  hoverGlow: {
    boxShadow: '0 0 20px rgba(255, 165, 0, 0.3)',
    transition: 'all 0.3s ease'
  }
};

// Animation presets for common use cases
export const animationPresets = {
  card: (isVisible, index = 0) => animations.staggeredFadeInUp(isVisible, index, {
    duration: '0.6s',
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    staggerDelay: 0.1
  }),

  hero: (isVisible) => animations.morphIn(isVisible, {
    duration: '1.2s',
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }),

  section: (isVisible) => animations.fadeInUp(isVisible, {
    duration: '0.8s',
    distance: '40px',
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }),

  feature: (isVisible, index = 0) => animations.bounceIn(isVisible, {
    duration: `${0.6 + (index * 0.1)}s`
  })
};

// Utility function to create custom easing
export const createCustomAnimation = (isVisible, config) => {
  const {
    from = {},
    to = {},
    duration = '0.6s',
    easing = 'ease-out',
    delay = '0s'
  } = config;

  const styles = {};
  
  Object.keys(to).forEach(property => {
    if (from[property] !== undefined) {
      styles[property] = isVisible ? to[property] : from[property];
    } else {
      styles[property] = to[property];
    }
  });

  styles.transition = `all ${duration} ${easing} ${delay}`;
  
  return styles;
};
