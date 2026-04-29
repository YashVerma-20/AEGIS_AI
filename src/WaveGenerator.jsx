import React, { useEffect, useState } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';

const WaveGenerator = ({ rul }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Spring physics as requested (stiffness: 400, damping: 50)
  const springVelocity = useSpring(scrollVelocity, {
    stiffness: 400,
    damping: 50
  });

  // Map velocity to "chaos" / noise level
  const noiseLevel = useTransform(springVelocity, [-1000, 0, 1000], [100, 0, 100]);

  const [pathData, setPathData] = useState("");

  useEffect(() => {
    let animationFrameId;
    let time = 0;

    const renderWave = () => {
      // Slower time progression if RUL > 100
      const speed = rul > 100 ? 0.01 : 0.02;
      time += speed;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerY = height / 2;
      
      const segments = 100;
      const currentNoise = noiseLevel.get();
      
      let d = `M 0 ${centerY}`;
      
      // Low-frequency wave when RUL > 100
      const freqMultiplier = rul > 100 ? 2 : 4;
      
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        // Base sine wave
        let y = Math.sin((i / segments) * Math.PI * freqMultiplier + time) * 50;
        
        // Add chaos based on velocity
        if (currentNoise > 0) {
          const noise = (Math.random() - 0.5) * currentNoise;
          y += noise;
        }
        
        d += ` L ${x} ${centerY + y}`;
      }

      setPathData(d);
      animationFrameId = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => cancelAnimationFrame(animationFrameId);
  }, [noiseLevel, rul]);

  return (
    <div className="wave-background">
      <svg width="100%" height="100%">
        <path className="wave-path" d={pathData} />
      </svg>
    </div>
  );
};

export default WaveGenerator;
