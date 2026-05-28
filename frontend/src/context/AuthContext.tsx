import { createContext, useContext, useState, type ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, type LoginCredentials } from '../api/auth';

interface AuthContextValue {
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  async function login(credentials: LoginCredentials) {
    const response = await apiLogin(credentials);
    localStorage.setItem(TOKEN_KEY, response.access_token);
    setToken(response.access_token);
  }

  async function logout() {
    if (token) {
      await apiLogout(token).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
