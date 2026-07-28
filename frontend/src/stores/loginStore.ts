import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginStore {
  idUtilisateur: number | null;
  idMembre: number | null;
  role: string | null;
  token: string | null;

  setIdUtilisateur: (id: number | null) => void;
  setIdMembre: (id: number | null) => void;
  setRole: (role: string | null) => void;
  setToken: (token: string | null) => void;
  deconnexion: () => void;
}

export const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      idUtilisateur: null,
      idMembre: null,
      role: null,
      token: null,

      setIdUtilisateur: (id) => set({ idUtilisateur: id }),
      setIdMembre: (id) => set({ idMembre: id }),
      setRole: (role) => set({ role }),
      setToken: (token) => set({ token }),

      deconnexion: () =>
        set({ idUtilisateur: null, idMembre: null, role: null, token: null }),
    }),
    {
      name: "login-storage",
    },
  ),
);
