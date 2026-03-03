import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import * as authService from "../authService";
import { clearAccessToken, setAccessToken } from "../api";

const devBypassEnabled =
  import.meta.env.DEV &&
  String(import.meta.env.VITE_AUTH_BYPASS || "").toLowerCase() === "true";
const bypassRole = String(import.meta.env.VITE_AUTH_BYPASS_ROLE || "user").toLowerCase();

function createBypassUser() {
  const role = bypassRole === "admin" ? "admin" : "user";
  return {
    id: "dev-bypass-user",
    fullName: role === "admin" ? "Dev Admin" : "Dev User",
    email: role === "admin" ? "admin.local@dev.test" : "user.local@dev.test",
    role,
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(!devBypassEnabled);

  const syncProfile = useCallback(async () => {
    if (devBypassEnabled) {
      setUser(createBypassUser());
      setIsLoading(false);
      return;
    }

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

  const googleLogin = useCallback(async (googleAccessToken) => {
    const data = await authService.googleAuth({ accessToken: googleAccessToken });
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
    if (devBypassEnabled) {
      setUser(createBypassUser());
      return;
    }

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
      googleLogin,
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
      googleLogin,
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
