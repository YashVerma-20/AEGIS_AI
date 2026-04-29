import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, AlertTriangle, ShieldCheck, CheckSquare } from 'lucide-react';
import { auth } from './firebase';
import { useParams } from 'react-router-dom';

function ConsultantDrawer({ isOpen, onClose, rul, sensorData, onIdentifyAnomaly }) {
  const [assessment, setAssessment] = useState(null);
  const { id: factoryId } = useParams();

  useEffect(() => {
    if (isOpen && rul !== null) {
      // Aegis AI Inference Logic
      // Aegis AI Inference Logic - Tuned for industrial sensitivity
      if (rul < 125) {
        // Find highest variance sensor to flag as anomaly
        const maxVal = Math.max(...sensorData);
        const anomalyIndex = sensorData.indexOf(maxVal);
        const isActuallyCritical = rul < 80;
        
        setAssessment({
          status: isActuallyCritical ? 'Critical Degradation' : 'Subtle Degradation Detected',
          anomaly: `S${anomalyIndex + 1} (Abnormal Signature)`,
          prescription: isActuallyCritical 
            ? `Immediate inspection required for S${anomalyIndex + 1}. Predicted failure within ${rul.toFixed(0)} cycles.`
            : `Schedule secondary validation for sensor line S${anomalyIndex + 1}. Performance drift noted.`,
          isCritical: isActuallyCritical,
          anomalyIndex: anomalyIndex
        });
        onIdentifyAnomaly(anomalyIndex);
      } else {
        setAssessment({
          status: 'Nominal Operations',
          anomaly: 'None detected',
          prescription: 'Continue standard federated monitoring.',
          isCritical: false,
          anomalyIndex: null
        });
        onIdentifyAnomaly(null);
      }
    }
  }, [isOpen, rul, sensorData, onIdentifyAnomaly]);

  const acknowledgePrescription = async () => {
    if (!assessment) return;
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      await fetch('http://127.0.0.1:5000/api/logs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          factory_id: factoryId || 'factory-alpha-01',
          agent_diagnosis: assessment.status + ' - ' + assessment.anomaly,
          operator_action: 'Acknowledged Prescription'
        })
      });
      onClose();
    } catch (e) {
      console.error('Failed to save log', e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 1050 }}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: '70px',
              right: 0,
              bottom: 0,
              width: '400px',
              background: 'var(--bg-main)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid var(--border-color)',
              zIndex: 1100,
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.div
                  animate={!assessment?.status.includes('Nominal') ? { 
                    scale: [1, 1.2, 1],
                    filter: ['drop-shadow(0 0 0px #ff003c)', 'drop-shadow(0 0 8px #ff003c)', 'drop-shadow(0 0 0px #ff003c)']
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Bot color={assessment?.isCritical || !assessment?.status.includes('Nominal') ? "#ff003c" : "var(--accent)"} size={28} />
                </motion.div>
                <h2 style={{ 
                  margin: 0, 
                  background: 'var(--title-gradient)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.5rem' 
                }}>Aegis AI</h2>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {assessment ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <motion.div 
                  animate={!assessment.status.includes('Nominal') ? { 
                    borderColor: ['rgba(255,0,60,0.2)', 'rgba(255,0,60,0.8)', 'rgba(255,0,60,0.2)'],
                    boxShadow: ['0 0 0px rgba(255,0,60,0)', '0 0 15px rgba(255,0,60,0.3)', '0 0 0px rgba(255,0,60,0)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ 
                    background: 'var(--bg-card)', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    border: `1px solid ${assessment.isCritical || !assessment.status.includes('Nominal') ? 'rgba(255, 0, 60, 0.5)' : 'var(--accent-glow)'}` 
                  }}
                >
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.875rem', textTransform: 'uppercase' }}>Status</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: assessment.isCritical || !assessment.status.includes('Nominal') ? '#ff003c' : 'var(--accent)', fontWeight: 'bold' }}>
                    {assessment.isCritical || !assessment.status.includes('Nominal') ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
                    <span>{assessment.status}</span>
                  </div>
                </motion.div>

                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.875rem', textTransform: 'uppercase' }}>Anomaly Detected</h4>
                  <p style={{ color: 'var(--text-primary)', margin: 0 }}>{assessment.anomaly}</p>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: `1px solid ${assessment.isCritical ? 'rgba(255, 0, 60, 0.5)' : 'var(--accent-glow)'}` }}>
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.875rem', textTransform: 'uppercase' }}>Precautionary Window</h4>
                  <p style={{ color: assessment.isCritical ? '#ff003c' : 'var(--accent)', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                    { (rul * 2).toFixed(1) } Hours / { (rul * 2 / 24).toFixed(1) } Days
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Estimated based on current operation cycle density.</p>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.875rem', textTransform: 'uppercase' }}>Prescription</h4>
                  <p style={{ color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>{assessment.prescription}</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={acknowledgePrescription}
                  style={{
                    padding: '16px',
                    background: 'var(--accent)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}
                >
                  <CheckSquare size={20} />
                  Acknowledge & Record Log
                </motion.button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                  <Bot size={40} style={{ opacity: 0.5, marginBottom: '16px' }} />
                </motion.div>
                <p>Ingesting telemetry...</p>
              </div>
            )}
            
            <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Powered by Aegis Industrial AI Federated Engine
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConsultantDrawer;
