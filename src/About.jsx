import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Zap, Globe, Users, ArrowRight, Activity, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="content-wrapper" style={{ paddingBottom: '100px' }}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}
      >
        {/* 1. Hero Section */}
        <section style={{ padding: '80px 0', position: 'relative' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ 
              width: '180px', height: '180px', 
              margin: '0 auto 40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div style={{ 
              position: 'absolute', inset: 0, 
              border: '2px solid rgba(0, 229, 255, 0.1)', 
              borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%',
              boxShadow: '0 0 40px rgba(0, 229, 255, 0.1)'
            }} />
            <Shield size={80} color="var(--accent)" strokeWidth={1} style={{ filter: 'drop-shadow(0 0 15px var(--accent-glow))' }} />
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: '16px' }}
          >
            AEGIS: Autonomous Edge-Governed Intelligence System
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}
          >
            Redefining Predictive Maintenance through Federated Learning and Physics-Informed Neural Networks.
          </motion.p>
        </section>

        {/* 2. The Engine of Truth */}
        <section style={{ padding: '60px 0' }}>
          <motion.h2 
            variants={itemVariants}
            style={{ fontSize: '2rem', marginBottom: '48px', color: 'var(--text-primary)' }}
          >
            The Engine of Truth
          </motion.h2>
          <div className="grid-system" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { 
                title: 'Physics Engine', 
                desc: 'Euler-Lagrange thermodynamic modeling.', 
                icon: Zap,
                detail: 'Integrating conservation of energy laws directly into the loss function to ensure RUL predictions respect physical bounds.'
              },
              { 
                title: 'Neural Engine', 
                desc: '1D-CNN + LSTM feature extraction.', 
                icon: Cpu,
                detail: 'Temporal feature extraction across 14 high-frequency sensor channels using dilated convolutions for long-range dependency tracking.'
              },
              { 
                title: 'Federated Engine', 
                desc: 'Secure weight aggregation.', 
                icon: Globe,
                detail: 'The FedAvg algorithm enables cross-fleet resilience without raw data exposure, creating a collaborative expert model.'
              }
            ].map((engine, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="glass-panel"
                style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div style={{ 
                  width: '50px', height: '50px', 
                  background: 'rgba(0, 229, 255, 0.1)', 
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <engine.icon size={24} color="var(--accent)" />
                </div>
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>{engine.title}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{engine.desc}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{engine.detail}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. User Roles & Governance */}
        <section style={{ padding: '60px 0' }}>
          <motion.h2 
            variants={itemVariants}
            style={{ fontSize: '2rem', marginBottom: '48px', color: 'var(--text-primary)' }}
          >
            Network Governance
          </motion.h2>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <motion.div 
              variants={itemVariants}
              className="glass-panel" 
              style={{ flex: 1, maxWidth: '400px', textAlign: 'left', borderColor: 'var(--accent)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Activity size={20} color="var(--accent)" />
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>Admin Role</h3>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>• Full diagnostic rights across all regional nodes</li>
                <li>• Access to the Intelligence Hub (XAI / FedAvg)</li>
                <li>• Model synchronization & version control</li>
              </ul>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="glass-panel" 
              style={{ flex: 1, maxWidth: '400px', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Users size={20} color="var(--text-secondary)" />
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Industry Partner</h3>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>• Fleet-wide operational monitoring</li>
                <li>• High-level RUL predictions & risk assessment</li>
                <li>• Local dataset upload & training triggers</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* 4. The CTA */}
        <section style={{ padding: '100px 0 60px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px var(--accent-glow)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'var(--accent)',
                color: '#000',
                padding: '24px 60px',
                borderRadius: '50px',
                fontSize: '1.25rem',
                fontWeight: '900',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '16px',
                letterSpacing: '1px'
              }}
            >
              ENTER COMMAND CENTER <ArrowRight size={24} />
            </motion.button>
          </Link>
        </section>

        {/* 5. Credits */}
        <motion.footer 
          variants={itemVariants}
          style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '40px',
            marginTop: '40px'
          }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
            Neural Architects
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '32px', 
            fontFamily: 'monospace',
            color: 'var(--accent)',
            fontSize: '1rem',
            opacity: 0.8
          }}>
            <span>KHUSHI VERMA</span>
            <span>YASH VERMA</span>
            <span>DEEP JAIN</span>
          </div>
          <div style={{ marginTop: '24px', fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.5 }}>
            © 2026 Aegis Industrial AI | All Systems Operational
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}

export default About;
