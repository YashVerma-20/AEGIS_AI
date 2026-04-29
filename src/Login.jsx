import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('fdm_token', data.token);
        localStorage.setItem('fdm_role', data.role);
        localStorage.setItem('fdm_assigned', data.assigned_factory);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection to Central Coordinator failed.');
    }
  };

  return (
    <div className="content-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '50%' }}>
              <Lock size={32} color="var(--accent)" />
            </div>
          </div>
          <h2 style={{ color: '#fff', marginBottom: '8px' }}>Security Gateway</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Authenticate to access fleet telemetry.</p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(255, 0, 60, 0.1)', border: '1px solid #ff003c', borderRadius: '8px', color: '#ff003c', marginBottom: '24px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Operator ID (j.doe or sys.admin)</label>
            <div style={{ position: 'relative' }}>
              <User size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 40px', 
                  background: 'rgba(0,0,0,0.5)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none'
                }} 
                placeholder="Enter username"
              />
            </div>
          </div>
          
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              padding: '14px', 
              background: 'var(--accent)', 
              color: '#000', 
              border: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Authenticate
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
