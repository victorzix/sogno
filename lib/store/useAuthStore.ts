import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
}

type AuthModalMode = "login" | "register";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /** Modal de login (Header); não persiste. */
  authModalOpen: boolean;
  authModalInitialMode: AuthModalMode;
  login: (user: User) => void;
  logout: () => void;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      authModalOpen: false,
      authModalInitialMode: "login",
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      openAuthModal: (mode = "login") =>
        set({ authModalOpen: true, authModalInitialMode: mode }),
      closeAuthModal: () => set({ authModalOpen: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
