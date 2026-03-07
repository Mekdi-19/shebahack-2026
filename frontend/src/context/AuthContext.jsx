import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check for temporary user first (for testing without backend)
    const tempUser = localStorage.getItem('tempUser');
    if (tempUser) {
      return JSON.parse(tempUser);
    }
    
    // Otherwise check for real user
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      // Also save as tempUser for temporary mode
      localStorage.setItem('tempUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('tempUser');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await api.login(email, password);
      
      if (data.token && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const data = await api.signup(userData);
      
      if (data.token && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      
      return { success: false, message: 'Signup failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isVendor = () => user?.role === 'vendor';
  const isAdmin = () => user?.role === 'admin';
  const isCustomer = () => user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isVendor,
        isAdmin,
        isCustomer,
        isAuthenticated: !!user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
