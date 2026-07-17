import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginStore {
  idUtilisateur: number | null;
  idMembre: number | null;
  role: string | null;

  setIdUtilisateur: (id: number | null) => void;
  setIdMembre: (id: number | null) => void;
  setRole: (role: string | null) => void;
}

export const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      idUtilisateur: 1,
      idMembre: null,
      role: null,

      setIdUtilisateur: (id) =>
        set({ idUtilisateur: id }),

      setIdMembre: (id) =>
        set({ idMembre: id }),

      setRole: (role) =>
        set({ role }),
    }),
    {
      name: "login-storage",
    }
  )
);
