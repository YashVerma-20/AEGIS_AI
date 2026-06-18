import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [assignedFactory, setAssignedFactory] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const token = await firebaseUser.getIdToken();
          const res = await fetch('https://aegis-ai-backend-mmo5.onrender.com/api/sync-user', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setRole(data.role || 'industry');
            setAssignedFactory(data.assigned_factory || 'factory-alpha-01');
          } else {
            setRole(null);
            setAssignedFactory(null);
          }
        } catch (e) {
          console.error("Failed to verify role", e);
          setRole(null);
          setAssignedFactory(null);
        }
      } else {
        setUser(null);
        setRole(null);
        setAssignedFactory(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading, role, assignedFactory };
}
