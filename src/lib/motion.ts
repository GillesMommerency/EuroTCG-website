/**
 * Motion utilities for animations
 * Note: Motion One library provides better browser compatibility than Framer Motion
 */

/**
 * Common animation configurations
 */
export const motionConfig = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

/**
 * Create a simple fade in animation using CSS
 */
export const fadeIn = (element: Element, options: { duration?: number; delay?: number } = {}) => {
  const { duration = motionConfig.duration.normal, delay = 0 } = options;

  if (typeof window === 'undefined') return;

  const el = element as HTMLElement;
  el.style.opacity = '0';
  el.style.transition = `opacity ${duration}s ${motionConfig.easing.ease}`;

  setTimeout(() => {
    el.style.opacity = '1';
  }, delay * 1000);
};

/**
 * Create a simple slide up animation using CSS
 */
export const slideInUp = (
  element: Element,
  options: { duration?: number; delay?: number; distance?: number } = {}
) => {
  const { duration = motionConfig.duration.normal, delay = 0, distance = 20 } = options;

  if (typeof window === 'undefined') return;

  const el = element as HTMLElement;
  el.style.opacity = '0';
  el.style.transform = `translateY(${distance}px)`;
  el.style.transition = `opacity ${duration}s ${motionConfig.easing.ease}, transform ${duration}s ${motionConfig.easing.ease}`;

  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, delay * 1000);
};

/**
 * Stagger animations for lists
 */
export const staggerIn = (elements: NodeListOf<Element> | Element[], stagger: number = 0.1) => {
  const elementsArray = Array.from(elements);

  elementsArray.forEach((element, index) => {
    slideInUp(element, { delay: index * stagger });
  });
};

/**
 * Intersection Observer animation
 */
export const animateOnIntersect = (
  selector: string,
  animationFn: (element: Element) => void,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return;

  const elements = document.querySelectorAll(selector);
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    ...options,
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animationFn(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, defaultOptions);

  elements.forEach(element => observer.observe(element));

  return observer;
};

/**
 * Hover scale effect
 */
export const hoverScale = (element: Element, scale: number = 1.05) => {
  if (typeof window === 'undefined') return;

  const el = element as HTMLElement;
  el.style.transition = `transform ${motionConfig.duration.fast}s ${motionConfig.easing.ease}`;

  const handleMouseEnter = () => {
    el.style.transform = `scale(${scale})`;
  };

  const handleMouseLeave = () => {
    el.style.transform = 'scale(1)';
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Prefers reduced motion check
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Safe animation wrapper that respects user preferences
 */
export const safeAnimate = (animationFn: () => void, fallbackFn?: () => void) => {
  if (prefersReducedMotion()) {
    fallbackFn?.();
  } else {
    animationFn();
  }
};

/**
 * Simple loading spinner animation
 */
export const createSpinner = (element: Element) => {
  if (typeof window === 'undefined') return;

  const el = element as HTMLElement;
  el.style.animation = 'spin 1s linear infinite';

  // Add keyframes if not already present
  if (!document.querySelector('#spinner-keyframes')) {
    const style = document.createElement('style');
    style.id = 'spinner-keyframes';
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Initialize page animations
 */
export const initPageAnimations = () => {
  if (typeof window === 'undefined') return;

  // Fade in page content
  const pageContent = document.querySelector('main');
  if (pageContent) {
    fadeIn(pageContent, { duration: motionConfig.duration.slow });
  }

  // Animate elements with data-animate attribute
  animateOnIntersect('[data-animate="fade-in"]', element => {
    fadeIn(element);
  });

  animateOnIntersect('[data-animate="slide-up"]', element => {
    slideInUp(element);
  });

  // Stagger list items
  const staggerLists = document.querySelectorAll('[data-animate="stagger"]');
  staggerLists.forEach(list => {
    const items = list.children;
    staggerIn(Array.from(items));
  });

  // Add hover effects to interactive elements
  const hoverElements = document.querySelectorAll('[data-hover="scale"]');
  hoverElements.forEach(element => {
    hoverScale(element);
  });
};
