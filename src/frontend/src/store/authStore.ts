import { create } from "zustand";
import type { UserProfile, UserRole } from "../types";

interface AuthState {
  profile: UserProfile | null;
  role: UserRole;
  isProfileLoaded: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setRole: (role: UserRole) => void;
  setProfileLoaded: (loaded: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  role: "guest",
  isProfileLoaded: false,
  setProfile: (profile) => set({ profile, role: profile?.role ?? "guest" }),
  setRole: (role) => set({ role }),
  setProfileLoaded: (loaded) => set({ isProfileLoaded: loaded }),
  clearAuth: () =>
    set({ profile: null, role: "guest", isProfileLoaded: false }),
}));
