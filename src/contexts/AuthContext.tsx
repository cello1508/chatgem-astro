
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on component mount
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedUsername = localStorage.getItem('username');
    
    console.log("AuthProvider initialized - stored auth:", storedAuth);
    
    setIsAuthenticated(storedAuth);
    setUsername(storedUsername);
  }, []);

  const login = (username: string) => {
    console.log("Login called with username:", username);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);
    setIsAuthenticated(true);
    setUsername(username);
    
    // Force navigation to home after login
    console.log("Navigating to / after login");
    navigate('/');
  };

  const logout = () => {
    console.log("Logout called");
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
