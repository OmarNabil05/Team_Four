import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { api, setAuthToken } from '../lib/api';

type AdminUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'spot-admin-token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get<{ data: AdminUser }>('/auth/profile');
      setUser(data.data);
    } catch (error) {
      console.error('Unable to load admin profile', error);
      setUser(null);
      setAuthToken(null);
      setToken(null);
      window.localStorage.removeItem(TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      setAuthToken(savedToken);
      setToken(savedToken);
      void fetchProfile();
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post<{
        data: { token: string; user: AdminUser };
      }>('/auth/login', { email, password });

      setAuthToken(data.data.token);
      setToken(data.data.token);
      window.localStorage.setItem(TOKEN_KEY, data.data.token);
      setUser(data.data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [login, logout, loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
