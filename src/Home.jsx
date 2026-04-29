import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, ShieldAlert, Cpu, Globe } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  
  // Rotating the central "engine" based on scroll
  const rotateEngine = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div style={{ minHeight: '200vh', overflowX: 'hidden' }}>

      <div style={{ paddingTop: '100px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', padding: '100px 40px' }}>
        
        {/* 1. Hero Section */}
        <section style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '600px' }}>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '24px', color: 'var(--text-primary)' }}
            >
              The Next Era of <br/><span style={{ color: 'var(--accent)' }}>Industrial Intelligence</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px' }}
            >
              Aegis Industrial AI aggregates fleet-wide telemetry without compromising localized data privacy.
            </motion.p>
          </div>
          
          <motion.div 
            style={{ rotate: rotateEngine }}
            className="glass-panel"
          >
            <Settings size={200} color="var(--accent)" strokeWidth={1} style={{ filter: 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.4))' }} />
          </motion.div>
        </section>

        {/* 2. Problem vs Solution Narrative */}
        <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="grid-system">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="glass-panel"
              style={{ 
                borderColor: 'rgba(255, 0, 60, 0.3)',
                backgroundImage: 'linear-gradient(rgba(18, 18, 22, 0.75), rgba(18, 18, 22, 0.9)), url(/assets/gas_turbine.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <ShieldAlert size={48} color="#ff003c" style={{ marginBottom: '24px' }} />
              <h2>The Problem</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>40%</strong> of industrial downtime is entirely unplanned, costing billions globally. Legacy systems react to failure rather than preventing it.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="glass-panel"
              style={{ 
                borderColor: 'var(--accent)',
                backgroundImage: 'linear-gradient(rgba(18, 18, 22, 0.75), rgba(18, 18, 22, 0.9)), url(/assets/assembly_arm.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <Cpu size={48} color="var(--accent)" style={{ marginBottom: '24px' }} />
              <h2>The Solution</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Federated AI predicts catastrophic failures <strong>weeks in advance</strong> using 1D-CNN temporal models, keeping raw data safely on the edge.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 3. Global Operations Map */}
        <section style={{ padding: '100px 0', textAlign: 'center' }}>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginBottom: '60px', fontSize: '2.5rem' }}
          >
            Global Operations Map
          </motion.h2>
          
          <div style={{ position: 'relative', height: '400px', background: 'var(--bg-card)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <Globe size={400} color="var(--border-color)" style={{ position: 'absolute', opacity: 0.2 }} />
            
            {/* Connecting Lines */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 5, pointerEvents: 'none' }}>
              {[
                { x1: '35%', y1: '40%', x2: '50%', y2: '50%' },
                { x1: '35%', y1: '60%', x2: '50%', y2: '50%' },
                { x1: '65%', y1: '40%', x2: '50%', y2: '50%' },
                { x1: '65%', y1: '60%', x2: '50%', y2: '50%' }
              ].map((line, i) => (
                <motion.line 
                  key={`line-${i}`}
                  x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  animate={{ strokeDashoffset: [0, -20] }}
                  viewport={{ once: true }}
                  transition={{ 
                    pathLength: { delay: 1 + i * 0.2, type: 'spring', stiffness: 50 },
                    strokeDashoffset: { repeat: Infinity, duration: 1, ease: "linear" } 
                  }}
                  opacity={0.6}
                />
              ))}
            </svg>

            {/* Mock Factory Nodes as Glowing Pings */}
            <style>{`
              .factory-ping .node-details { opacity: 0; pointer-events: none; transition: opacity 0.2s; position: absolute; top: -80px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); border: 1px solid var(--accent); padding: 8px 12px; border-radius: 8px; width: max-content; z-index: 40; }
              .factory-ping:hover .node-details { opacity: 1; }
            `}</style>
            {[
              { id: 'Aero-Alpha', top: '40%', left: '35%', sensors: 14, sync: '2m' },
              { id: 'Logistics-Delta', top: '60%', left: '35%', sensors: 42, sync: '30s' },
              { id: 'Marine-Beta', top: '40%', left: '65%', sensors: 28, sync: '1m' },
              { id: 'Power-Gamma', top: '60%', left: '65%', sensors: 9, sync: '4m' }
            ].map((node, i) => (
              <motion.div 
                key={node.id}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                whileHover={{ scale: 1.5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring' }}
                className="factory-ping"
                style={{
                  position: 'absolute',
                  top: node.top,
                  left: node.left,
                  width: '16px',
                  height: '16px',
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  zIndex: 10,
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 15px 5px rgba(0, 229, 255, 0.4)'
                }}
              >
                {/* Ping Pulse Animation */}
                <motion.div
                  animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: i * 0.2 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                  }}
                />
                
                <div className="node-details" style={{ fontFamily: "'JetBrains Mono', monospace", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: '4px' }}>{node.id}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                    <span>{node.sensors} Active Sensors</span><br/>
                    <span style={{ color: 'var(--text-secondary)' }}>Last Sync: {node.sync} ago</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Central Coordinator */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              animate={{ y: [-5, 5, -5] }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: 'spring', y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--accent)',
                color: '#000',
                fontWeight: 'bold',
                padding: '20px 32px',
                borderRadius: '50px',
                zIndex: 20,
                boxShadow: '0 0 40px rgba(0, 229, 255, 0.4)'
              }}
            >
              Central Coordinator
            </motion.div>
          </div>
        </section>

        {/* 4. Call to Action */}
        <section style={{ padding: '150px 0', textAlign: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            style={{
              padding: '24px 64px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'transparent',
              color: 'var(--accent)',
              border: '2px solid var(--accent)',
              borderRadius: '50px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.2)',
              transition: 'all 0.3s ease',
              marginBottom: '60px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 229, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.2)';
            }}
          >
            Enter Command Center
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
          >
            <ShieldAlert size={16} color="var(--accent)" />
            <span>Enterprise Verified Stack: React + Flask + PostgreSQL</span>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default Home;
