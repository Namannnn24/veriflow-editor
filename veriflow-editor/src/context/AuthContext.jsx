import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getToken, setToken, removeToken } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const data = await authAPI.me();
          setUser(data.user || data);
        } catch (err) {
          console.error('Auth initialization error:', err);
          removeToken();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authAPI.login(email, password);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signup = async (email, password, name) => {
    setError(null);
    try {
      const data = await authAPI.signup(email, password, name);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
