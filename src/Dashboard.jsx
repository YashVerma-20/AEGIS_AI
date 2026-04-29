import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Activity, AlertTriangle, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const initialFactories = [
  { id: 'factory-alpha-01', name: 'Aero-Alpha', status: 'healthy', rul: 120, complexity: 'Low Latency' },
  { id: 'factory-beta-02', name: 'Marine-Beta', status: 'warning', rul: 65, complexity: 'Multithreaded' },
  { id: 'factory-gamma-03', name: 'Logistics-Delta', status: 'healthy', rul: 180, complexity: 'Overclocked' },
  { id: 'factory-delta-04', name: 'Power-Gamma', status: 'critical', rul: 25, complexity: 'High Throughput' },
];

import { useAuth } from './useAuth';

function Dashboard() {
  const { role, assignedFactory } = useAuth();
  const [globalVersion, setGlobalVersion] = useState('v1.0.0');
  const [syncPulse, setSyncPulse] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const socket = io('http://127.0.0.1:5000');

    socket.on('global_model_updated', (data) => {
      setGlobalVersion(data.version);

      // 1. Trigger the Downward Flow Pulse
      setSyncPulse(true);
      setTimeout(() => setSyncPulse(false), 2000);

      // 3. Success Confetti if high version
      if (data.version !== 'v1.0.0') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    });

    // Fetch initial Global Version state from Central Coordinator
    async function fetchInitialState() {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/intelligence_history', { cache: 'no-store' });
        const data = await res.json();
        if (data.current_version) {
          setGlobalVersion(data.current_version);
        }
      } catch (err) {
        console.error("Failed to fetch initial intelligence state", err);
      }
    }
    fetchInitialState();

    return () => socket.disconnect();
  }, []);

  return (
    <div className="content-wrapper" style={{ position: 'relative' }}>
      {/* Global Sync Pulse Animation */}
      <AnimatePresence>
        {syncPulse && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '400px',
              height: '400px',
              marginLeft: '-200px',
              marginTop: '-200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
              zIndex: 99,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      <header className="header" style={{ marginBottom: '40px', position: 'relative' }}>
        {/* Subtle Particle Effect behind Badge */}
        <AnimatePresence>
          {showConfetti && (
            <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', zIndex: -1 }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
                  style={{
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    background: 'var(--accent)',
                    boxShadow: '0 0 10px var(--accent)',
                    borderRadius: '50%'
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}
        >
          <ShieldCheck color="var(--success)" size={20} />
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold', letterSpacing: '1px' }}>ENTERPRISE VERIFIED</span>
        </motion.div>

        <motion.h1
          className="header-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Global Command Center
        </motion.h1>
        <p className="header-subtitle">
          Federated AI v{globalVersion} | Collaborative Fleet Intelligence Active.
        </p>
      </header>

      <div className="grid-system">
        {initialFactories.map((f, i) => (
          <Link to={`/factory/${f.id}`} key={f.id} style={{ textDecoration: 'none' }}>
            <motion.div
              className="glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              style={{
                borderColor: f.status === 'critical' ? 'rgba(255, 0, 60, 0.5)' : 'var(--border-color)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Smart Sync Indicator Badge */}
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 229, 255, 0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--accent)' }}>
                <Globe size={10} color="var(--accent)" />
                <span style={{ fontSize: '0.6rem', color: 'var(--accent)', fontWeight: 'bold' }}>SYNC ACTIVE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Server color={f.status === 'critical' ? '#ff003c' : 'var(--accent)'} />
                {f.status === 'critical' && <AlertTriangle color="#ff003c" />}
              </div>

              <h3 style={{ marginTop: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {f.name}
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>[{f.complexity}]</span>
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status: {f.status.toUpperCase()}</p>

              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Remaining Useful Life</p>
                <p style={{ margin: 0, color: f.status === 'critical' ? '#ff003c' : 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {f.rul} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>Cycles</span>
                </p>
              </div>

              {/* Tooltip Simulation on Hover */}
              <div className="sync-tooltip" style={{ marginTop: '16px', fontSize: '0.65rem', color: 'var(--accent)', opacity: 0.8 }}>
                Running Federated {globalVersion} - Enhanced with Logistics-Delta cross-intelligence.
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* The Intelligence Badge: Status Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '40px',
          background: 'var(--bg-main)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--accent-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          zIndex: 999,
          fontSize: '0.75rem',
          letterSpacing: '1px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
          <ShieldCheck size={14} />
          <span style={{ fontWeight: 'bold' }}>Connected to Global Model {globalVersion}</span>
        </div>
        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ color: 'var(--text-secondary)' }}>
          Last Synced: <span style={{ color: 'var(--text-primary)' }}>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        </div>
        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
          <span>Secure Uplink Active</span>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
