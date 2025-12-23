import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: 'business' | 'carrier' | null; // We will store this in local storage for now
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, userRole: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'business' | 'carrier' | null>(() => {
    // Try to recover role from localStorage on refresh
    return (localStorage.getItem('userRole') as 'business' | 'carrier') || null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Helper to set role manually during login
  const setRole = (role: 'business' | 'carrier') => {
      setUserRole(role);
      localStorage.setItem('userRole', role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, userRole }}>
       {/* We attach setRole to the window or export a custom hook wrapper if needed, 
           but for simplicity, we'll manage role setting in the Login component */}
      {!loading && children}
    </AuthContext.Provider>
  );
};