import { useState, useEffect } from 'react';

interface User {
  email: string;
  role: string;
  employeeName?: string;
}

interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    message: string;
    status: boolean;
    role: string;
  };
}

interface SignUpResponse {
  status: boolean;
  message: string;
  data: string;
}

// const BASE_URL = 'http://localhost:8080';
const BASE_URL = "https://cyin-production.up.railway.app";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (data.status && data.data.status) {
        const userData: User = {
          email,
          role: data.data.role,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (employeeName: string, email: string, password: string, role: string = 'ADMIN'): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/customers/signUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeName, email, password, role }),
      });

      const data: SignUpResponse = await response.json();

      if (data.status) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, login, logout, signup, loading };
};