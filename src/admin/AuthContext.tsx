import { createContext, useContext, useState, type ReactNode } from 'react';
import { ADMIN_CREDENTIALS } from './config';
import { STORAGE_KEYS, saveToStorage, resetStorage } from './storage';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  function login(email: string, password: string): boolean {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      saveToStorage(STORAGE_KEYS.ADMIN_AUTH, true);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  function logout() {
    resetStorage(STORAGE_KEYS.ADMIN_AUTH);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AuthProvider');
  return ctx;
}
