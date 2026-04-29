import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { BrainCircuit, Lock, Mail, ArrowRight, Phone } from 'lucide-react';

function AuthGateway() {
  const [authMethod, setAuthMethod] = useState('email'); // 'email', 'phone'
  const [isLogin, setIsLogin] = useState(true);
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Phone state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [role, setRole] = useState('industry');
  const [assignedNode, setAssignedNode] = useState('factory-alpha-01');
  const [isBooting, setIsBooting] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  }, []);

  const syncUser = async (user) => {
    await fetch('http://127.0.0.1:5000/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email || user.phoneNumber,
        role: role,
        assigned_node: assignedNode
      })
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        startBootSequence();
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await syncUser(userCredential.user);
        startBootSequence();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const startBootSequence = () => {
    setIsBooting(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        setBootProgress(100);
        clearInterval(interval);
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        setBootProgress(progress);
      }
    }, 150);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await syncUser(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await confirmationResult.confirm(otp);
      await syncUser(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 70px)',
      padding: '20px'
    }}>
      <AnimatePresence>
        {isBooting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: '#000',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px'
            }}
          >
            <BrainCircuit size={64} className="glow-icon" />
            <div style={{ width: '300px', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div 
                style={{ height: '100%', background: 'var(--accent)', width: `${bootProgress}%` }}
              />
            </div>
            <p style={{ fontFamily: 'monospace', color: 'var(--accent)', letterSpacing: '2px' }}>
              BOOTING SECURE SHELL... {Math.round(bootProgress)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="recaptcha-container"></div>
      
      <motion.div 
        layout
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <motion.div layout style={{ textAlign: 'center' }}>
          <BrainCircuit size={48} color="var(--accent)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            {authMethod === 'email' ? (isLogin ? 'Access Gateway' : 'Initialize Identity') : 'Secure Comms Link'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0' }}>
            {authMethod === 'email' 
              ? (isLogin ? 'Authenticate to access Aegis Industrial AI' : 'Register your credentials for the fleet')
              : 'Authenticate via secure SMS transmission'}
          </p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: '#ff003c', fontSize: '0.875rem', textAlign: 'center', background: 'rgba(255,0,60,0.1)', padding: '8px', borderRadius: '4px' }}
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {authMethod === 'email' ? (
            <motion.form 
              key="email-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleEmailSubmit} 
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <motion.div layout style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="email" 
                  placeholder="Operational Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </motion.div>

              <motion.div layout style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  placeholder="Passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="aegis-input"
                  style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </motion.div>

              <motion.div layout style={{ marginTop: '8px', padding: '12px', background: 'rgba(0, 229, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', textAlign: 'center' }}>Clearance Level</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="aegis-input"
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', textAlign: 'center' }}
                >
                  <option value="industry">Industry Partner</option>
                  <option value="admin">Global Admin</option>
                </select>
              </motion.div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <div style={{ position: 'relative', marginTop: '16px' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input 
                        type="password" 
                        placeholder="Confirm Passcode"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={!isLogin}
                        className="aegis-input"
                        style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button 
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginTop: '8px' }}
              >
                {isLogin ? 'Initialize Uplink' : 'Establish Record'}
                <ArrowRight size={18} />
              </motion.button>
              
              <motion.div layout style={{ textAlign: 'center' }}>
                <button 
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {isLogin ? "New to the fleet? Establish credentials." : "Already recorded? Initialize uplink."}
                </button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.form 
              key="phone-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={confirmationResult ? handleVerifyOtp : handleSendOtp} 
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {!confirmationResult ? (
                <>
                  <motion.div layout style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="tel" 
                      placeholder="+1 234 567 8900"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                    />
                  </motion.div>
                  <motion.button 
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    Send Authorization Code
                    <ArrowRight size={18} />
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div layout style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      placeholder="6-digit Code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', outline: 'none', letterSpacing: '2px' }}
                    />
                  </motion.div>
                  <motion.button 
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    Verify & Authenticate
                    <ArrowRight size={18} />
                  </motion.button>
                </>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        <motion.div layout style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </motion.div>

        <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {authMethod === 'phone' ? (
            <button
              onClick={() => { setAuthMethod('email'); setError(''); }}
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Mail size={18} />
              Use Email & Password
            </button>
          ) : (
            <button
              onClick={() => { setAuthMethod('phone'); setError(''); }}
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Phone size={18} />
              Use Phone Number
            </button>
          )}

          <button
            onClick={handleGoogleSignIn}
            style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AuthGateway;
