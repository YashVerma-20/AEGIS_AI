import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Database, Globe } from 'lucide-react';

const BOOT_STEPS = [
  { id: 1, text: 'Initializing Aegis Neural Core...', icon: Cpu },
  { id: 2, text: 'Synchronizing Federated Weight Buffer...', icon: Database },
  { id: 3, text: 'Establishing Fleet-wide Mesh Connection...', icon: Globe },
  { id: 4, text: 'System Integrity Verified: Enterprise Grade', icon: ShieldCheck },
];

function BootScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < BOOT_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(onComplete, 1500);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStep, onComplete]);

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      background: '#050505', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#fff',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ marginBottom: '60px', textAlign: 'center' }}
      >
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              border: '2px solid rgba(0, 229, 255, 0.2)', 
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              borderTopColor: 'var(--accent)'
            }}
          />
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--accent)',
            letterSpacing: '4px'
          }}>
            AEGIS
          </div>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase' }}
        >
          Industrial AI Deployment
        </motion.div>
      </motion.div>

      <div style={{ width: '300px' }}>
        <AnimatePresence mode="wait">
          {currentStep < BOOT_STEPS.length && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}
            >
              {React.createElement(BOOT_STEPS[currentStep].icon, { size: 16, color: 'var(--accent)' })}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {BOOT_STEPS[currentStep].text}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div style={{ height: '2px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '24px', position: 'relative', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / BOOT_STEPS.length) * 100}%` }}
            style={{ height: '100%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}
          />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '40px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
        LOADER_V2.4 // FEDERATED_CORE_ACTIVE // SECURITY_LOCKED
      </div>
    </div>
  );
}

export default BootScreen;
