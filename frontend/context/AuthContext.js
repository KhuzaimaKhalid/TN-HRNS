// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login(email, password, role);
      const { token, user: userData } = response;
      const fullUserData = { ...userData, name: userData.name || email.split('@')[0] };
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(fullUserData));
      localStorage.setItem('userRole', fullUserData.role || role);
      setUser(fullUserData);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response;
      const fullUserData = { ...newUser, name: userData.fullName || userData.name || 'User', email: userData.email };
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(fullUserData));
      localStorage.setItem('userRole', fullUserData.role || 'Employee');
      setUser(fullUserData);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);