import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import * as authService from "../authService";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncProfile = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (_error) {
      localStorage.removeItem("accessToken");
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
    localStorage.setItem("accessToken", data.accessToken);
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
    } catch (_error) {
      // Clear local auth state regardless of backend response.
    } finally {
      localStorage.removeItem("accessToken");
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
