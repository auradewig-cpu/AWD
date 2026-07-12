import { createContext, useContext, useState, type ReactNode } from 'react';
import { ADMIN_CREDENTIALS } from './config';
import {
  STORAGE_KEYS,
  saveToStorage,
  resetStorage,
  getAdminToken,
  setAdminToken,
  clearAdminToken,
} from './storage';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      // A live session requires BOTH the flag and a token.
      return (
        localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true' &&
        !!getAdminToken()
      );
    } catch {
      return false;
    }
  });

  // Verifies the password server-side (POST /api/auth) and stores the returned
  // session token. The password itself is never persisted client-side.
  async function login(email: string, password: string): Promise<boolean> {
    if (email !== ADMIN_CREDENTIALS.email) return false;
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data?.token) return false;
      setAdminToken(data.token);
      saveToStorage(STORAGE_KEYS.ADMIN_AUTH, true);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    resetStorage(STORAGE_KEYS.ADMIN_AUTH);
    clearAdminToken();
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
