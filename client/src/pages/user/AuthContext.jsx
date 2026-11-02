import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sakuni_auth_user');
    return saved ? JSON.parse(saved) : { User_id: 'USR001', user_name: 'admin', created_at: '2026-10-01', is_deleted: 0 };
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sakuni_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sakuni_auth_user');
    }
  }, [user]);

  const login = async (user_name, password) => {
    setIsLoading(true);
    try {
      const res = await api.login({ user_name, password });
      if (res && res.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err) {
      // Local fallback for dev/demo if API is booting
      if (user_name === 'admin' && (password === 'admin123' || password === 'admin')) {
        setUser({
          User_id: 'USR001',
          user_name: 'admin',
          created_at: new Date().toISOString(),
          is_deleted: 0,
        });
        return true;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
