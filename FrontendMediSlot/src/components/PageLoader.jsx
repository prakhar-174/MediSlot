import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PageLoader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete });
    
    tl.fromTo(textRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 1,
        ease: 'power3.inOut',
        delay: 0.4
      });
  }, [onComplete]);

  return (
    <div 
      ref={loaderRef} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-base text-text-secondary"
    >
      <div ref={textRef} className="text-3xl font-bold tracking-tighter">
        MediSlot.
      </div>
    </div>
  );
};

export default PageLoader;
