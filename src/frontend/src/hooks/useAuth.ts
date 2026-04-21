import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
  } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { profile, role, isProfileLoaded, setProfileLoaded, clearAuth } =
    useAuthStore();

  const handleLogout = () => {
    clear();
    queryClient.clear();
    clearAuth();
  };

  // Reset profile loaded state when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      clearAuth();
    }
  }, [isAuthenticated, clearAuth]);

  return {
    login,
    logout: handleLogout,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    profile,
    role,
    isProfileLoaded,
    setProfileLoaded,
    isAdmin: role === "admin",
    isStudent: role === "student",
  };
}
