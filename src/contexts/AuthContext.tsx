import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'owner1',
    password: 'password',
    name: 'Rajesh Kumar',
    mobileNumber: '+91-9876543210',
    role: 'owner',
    shopId: 'shop1'
  },
  {
    id: '2',
    username: 'sales1',
    password: 'password',
    name: 'Priya Sharma',
    mobileNumber: '+91-9876543211',
    role: 'salesperson',
    empId: 'EMP001',
    shopId: 'shop1'
  },
  {
    id: '3',
    username: 'distributor1',
    password: 'password',
    name: 'Arjun Patel',
    mobileNumber: '+91-9876543212',
    role: 'distributor'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
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