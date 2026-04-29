import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Factory, BrainCircuit, LogOut, CheckCircle, ShieldCheck, Sun, Moon } from 'lucide-react';
import WaveGenerator from './WaveGenerator';
import Dashboard from './Dashboard';
import FactoryView from './FactoryView';
import IntelligenceHub from './IntelligenceHub';
import AuthGateway from './AuthGateway';
import { useAuth } from './useAuth';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Home from './Home';
import BootScreen from './BootScreen';
import About from './About';
import Unauthorized403 from './Unauthorized403';
import { Toaster } from 'react-hot-toast';

function ProfileButton({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  
  const initial = user?.displayName 
    ? user.displayName.charAt(0).toUpperCase() 
    : user?.email 
      ? user.email.charAt(0).toUpperCase() 
      : 'U';

  const handleLogout = () => {
    setIsOpen(false);
    setIsShuttingDown(true);
    setTimeout(() => {
      signOut(auth).then(() => {
        window.location.href = '/';
      });
    }, 3500);
  };

  return (
    <>
      <AnimatePresence>
        {isShuttingDown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: '#000',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)'
            }}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1.1, 0] }}
              transition={{ duration: 3.5, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
              style={{ textAlign: 'center' }}
            >
              <h2 style={{ letterSpacing: '8px', fontSize: '2rem' }}>SYSTEM SHUTDOWN</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Severing secure uplink...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 12px var(--accent-glow)',
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            userSelect: 'none'
          }}
        >
          {initial}
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '220px',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '8px',
                zIndex: 1001,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.displayName || 'Enterprise Operator'}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || user?.phoneNumber || 'Secure Session'}
                </div>
              </div>
              
              <motion.button
                whileHover={{ background: 'rgba(255, 0, 60, 0.1)' }}
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ff003c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '0.9rem'
                }}
              >
                <LogOut size={16} />
                Disconnect
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function Navigation({ user, theme, setTheme }) {
  const location = useLocation();
  const { role, assignedFactory } = useAuth();
  
  const navItems = [
    { path: '/dashboard', label: role === 'admin' ? 'Global Command' : 'Node Overview', icon: LayoutDashboard },
    { 
      path: `/factory/${assignedFactory || 'factory-alpha-01'}`, 
      label: 'Fleet Diagnostics', 
      icon: Factory 
    },
    { path: '/intelligence', label: 'Intelligence Hub', icon: BrainCircuit, adminOnly: true },
  ].filter(item => !item.adminOnly || role === 'admin');

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '70px',
      background: 'var(--bg-main)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 40px'
    }}>
      <Link to="/about" style={{ textDecoration: 'none', marginRight: 'auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--accent)',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          cursor: 'pointer'
        }}>
          <BrainCircuit />
          <span style={{ 
            background: 'var(--title-gradient)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Aegis Industrial AI</span>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '8px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path.split('/')[1] ? `/${item.path.split('/')[1]}` : item.path);
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                position: 'relative',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? '500' : '400',
                transition: 'color 0.2s',
                cursor: 'pointer',
                borderRadius: '8px'
              }}>
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      zIndex: -1
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--accent)',
            transition: 'all 0.3s ease'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
        
        <ProfileButton user={user} />
      </div>
    </nav>
  );
}

const ProtectedRoute = ({ theme, setTheme }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--accent)' }}>Authenticating...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navigation user={user} theme={theme} setTheme={setTheme} />
      <div style={{ paddingTop: '70px', minHeight: '100vh', paddingBottom: '60px' }}>
        <Outlet />
      </div>

      <AnimatePresence>
        {user && role && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'fixed',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-card)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--accent)',
              padding: '8px 16px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 1000
            }}
          >
            <CheckCircle size={14} color="var(--accent)" />
            <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Enterprise Verified
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="app-container">
        {/* We keep a global wave generator so the background persists across routes */}
        <WaveGenerator rul={150} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<div style={{ paddingTop: '70px', minHeight: '100vh' }}><AuthGateway /></div>} />
          
          <Route element={<ProtectedRoute theme={theme} setTheme={setTheme} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/factory/:id" element={<FactoryView />} />
            <Route path="/intelligence" element={<IntelligenceHub />} />
            <Route path="/about" element={<About />} />
            <Route path="/403" element={<Unauthorized403 />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
