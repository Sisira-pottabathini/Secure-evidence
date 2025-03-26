
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'staff' | 'user';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock user database for testing purposes
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'manager@example.com',
      name: 'Admin Manager',
      role: 'manager',
    },
    {
      id: '2',
      email: 'staff@example.com',
      name: 'Staff Member',
      role: 'staff',
    },
    {
      id: '3',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
    }
  ]);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('secureVaultUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would call an API
      // For demo purposes, we're mocking authentication
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check the mock user database first
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('secureVaultUser', JSON.stringify(foundUser));
        toast.success('Logged in successfully');
        navigate('/dashboard');
        return;
      }
      
      // Check registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find((u: any) => u.email === email);
      
      if (registeredUser && registeredUser.password === password) {
        const userData: User = {
          id: registeredUser.id,
          email: registeredUser.email,
          name: registeredUser.name,
          role: registeredUser.role || 'manager', // Default to manager for newly registered users
        };
        setUser(userData);
        localStorage.setItem('secureVaultUser', JSON.stringify(userData));
        toast.success('Logged in successfully');
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would call an API
      // For demo purposes, we're mocking registration
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = registeredUsers.some((user: any) => user.email === email);
      
      if (userExists) {
        toast.error('User with this email already exists');
        return;
      }
      
      // Create new user
      const newUser = {
        id: (Date.now()).toString(),
        email,
        name,
        password, // In a real app, never store plain passwords
        role: 'manager', // Default role for new registrations
      };
      
      // Save to local storage
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      toast.success('Account created successfully. Please login to continue.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('secureVaultUser');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
