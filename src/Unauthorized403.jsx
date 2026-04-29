import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized403 = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 0, 60, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: '24px', display: 'inline-block' }}
        >
          <ShieldAlert size={80} color="#ff003c" />
        </motion.div>
        
        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0 0 8px 0', 
          color: '#fff', 
          letterSpacing: '4px',
          fontFamily: 'Orbitron, sans-serif'
        }}>
          403
        </h1>
        <h2 style={{ 
          fontSize: '1.5rem', 
          margin: '0 0 24px 0', 
          color: '#ff003c',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Access Denied
        </h2>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          lineHeight: '1.6', 
          marginBottom: '32px',
          fontSize: '0.95rem'
        }}>
          The Aegis security protocols have restricted access to this sector. 
          Unauthorized cross-factory navigation or administrative access is strictly prohibited for your clearance level.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            <ArrowLeft size={18} />
            Previous Sector
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px 24px',
              background: 'var(--accent)',
              border: 'none',
              color: '#000',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            <Home size={18} />
            Command Center
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized403;
