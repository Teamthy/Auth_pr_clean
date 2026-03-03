import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import * as authService from "../authService";
import { clearAccessToken, setAccessToken } from "../api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      clearAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncProfile();
  }, [syncProfile]);

  const login = useCallback(async ({ email, password }) => {
    const data = await authService.login({ email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback((payload) => authService.register(payload), []);
  const verifyEmail = useCallback((payload) => authService.verifyEmail(payload), []);
  const resendVerification = useCallback(
    (payload) => authService.resendVerification(payload),
    []
  );
  const forgotPassword = useCallback((payload) => authService.forgotPassword(payload), []);
  const resetPassword = useCallback((payload) => authService.resetPassword(payload), []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Clear local auth state regardless of backend response.
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      syncProfile,
      login,
      register,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
      logout,
    }),
    [
      user,
      isLoading,
      syncProfile,
      login,
      register,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
