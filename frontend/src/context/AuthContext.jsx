import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Mock users database
const mockUsers = [
  { id: 1, email: 'admin@empowerher.et', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, email: 'customer@test.et', password: 'customer123', role: 'customer', name: 'Test Customer' },
  { id: 3, email: 'vendor@test.et', password: 'vendor123', role: 'vendor', name: 'Almaz Tesfaye' },
  { id: 4, email: 'vendor2@test.et', password: 'vendor123', role: 'vendor', name: 'Tigist Bekele' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email, password, role) => {
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: 'Invalid credentials or role' };
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
        logout,
        isVendor,
        isAdmin,
        isCustomer,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
