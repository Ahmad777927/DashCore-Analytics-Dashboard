import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

/**
 * Cookie-based authentication.
 *
 * The JWT lives in an httpOnly cookie set by the Express server, so it is never
 * readable by JavaScript (XSS-safe) and no credentials are persisted in
 * localStorage. On boot we ask the API who we are; a 401 simply means the user
 * must sign in, which the ProtectedRoute enforces.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // `isInitializing` avoids a flash of the login screen while /auth/me resolves.
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    (async () => {
      try {
        const data = await authApi.me(controller.signal);
        if (!active) return;
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (err) {
        if (err?.name === 'AbortError') return;
        if (!active) return;
        // 401 (or an unreachable API) -> treat as signed out.
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (active) setIsInitializing(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const login = useCallback(async ({ identifier, password }) => {
    const data = await authApi.login({ identifier, password });
    setUser(data.user);
    setIsAuthenticated(true);
    return data.user;
  }, []);

  const signup = useCallback(async (payload) => {
    const data = await authApi.signup(payload);
    setUser(data.user);
    setIsAuthenticated(true);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the network call fails we still clear the client state.
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  /**
   * Persists profile changes to the API and mirrors the server's copy of the
   * user into context, so every screen (navbar, greeting, menu) updates too.
   */
  const updateUserProfile = useCallback(async (updatedData) => {
    const data = await authApi.updateProfile(updatedData);
    if (data?.user) setUser(data.user);
    return data?.user ?? null;
  }, []);

  // If any API call reports 401 (expired/revoked cookie) we drop the session
  // so ProtectedRoute bounces the user back to /login.
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, isInitializing, login, signup, logout, updateUserProfile }),
    [user, isAuthenticated, isInitializing, login, signup, logout, updateUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
