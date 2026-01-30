import { type ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";
import userApi from "@/services/userService";
import authApi from "@/services/authService";
import type { User } from "@/interfaces/user";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSignedIn = !!token;

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      setToken(null);
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await userApi.getProfile();
      setUser(res);
    } catch (err) {
      console.error("Refresh user failed:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout, token]);

  const login = useCallback(
    async (newToken: string) => {
      localStorage.setItem("accessToken", newToken);
      setToken(newToken);
      await refreshUser();
    },
    [refreshUser]
  );

  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token, user, refreshUser]);

  const value: AuthContextType = {
    user,
    isSignedIn,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
