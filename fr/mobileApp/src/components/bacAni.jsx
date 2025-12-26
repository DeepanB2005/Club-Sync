import React, { useEffect, useRef } from 'react';
import { Star, Circle, Triangle, Square, Heart, Zap, Sparkles, Diamond } from 'lucide-react';

const ICONS = [Star, Circle, Triangle, Square, Heart, Zap, Sparkles, Diamond];

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function Aniruth() {
  const containerRef = useRef(null);
  const iconRefs = useRef([]);

  useEffect(() => {
    const icons = iconRefs.current;
    icons.forEach((icon, idx) => {
      if (!icon) return;
      const animate = () => {
        icon.style.transition = 'transform 6s cubic-bezier(0.4,0,0.2,1)';
        const x = getRandom(-30, 100);
        const y = getRandom(-30, 100);
        icon.style.transform = `translate(${x}vw, ${y}vh) scale(${getRandom(0.7, 1.3)}) rotate(${getRandom(0, 360)}deg)`;
      };
      animate();
      const interval = setInterval(animate, getRandom(4000, 8000));
      return () => clearInterval(interval);
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {Array.from({ length: 18 }).map((_, i) => {
        const Icon = ICONS[i % ICONS.length];
        const size = getRandom(32, 64);
        const color = `hsl(${getRandom(180, 360)}, 70%, 80%)`;
        return (  
          <span
            key={i}
            ref={el => (iconRefs.current[i] = el)}
            className="absolute blur-sm opacity-70"
            style={{
              left: `${getRandom(0, 100)}vw`,
              top: `${getRandom(0, 100)}vh`,
              transition: 'transform 6s cubic-bezier(0.4,0,0.2,1)',
              willChange: 'transform',
            }}
          >
            <Icon size={size} color={color} />
          </span>
        );
      })}
    </div>
  );
}

export default Aniruth;