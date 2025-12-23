import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: 'business' | 'carrier' | null;
  setUserRole: (role: 'business' | 'carrier') => void; // <--- We added this
}

// Initialize with a dummy function for safety
const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  userRole: null, 
  setUserRole: () => {} 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize role from localStorage so it survives page refreshes
  const [userRole, setRoleState] = useState<'business' | 'carrier' | null>(() => {
    return (localStorage.getItem('userRole') as 'business' | 'carrier') || null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // The function to update state AND localStorage
  const setUserRole = (role: 'business' | 'carrier') => {
      setRoleState(role);
      localStorage.setItem('userRole', role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, userRole, setUserRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};