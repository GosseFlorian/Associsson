import { create } from "zustand";

interface Tache {
  id: number;
  projet_id: number;
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  date_echeance: string;
};

interface TacheStore {
  taches: Tache[];
  chargement: boolean;
  error: string | null;
  fetchTache: () => Promise<void>;
}

export const useTacheStore = create<TacheStore>((set) => ({
  taches: [],
  chargement: false,
  error: null,

  fetchTache: async () => {
    set({ chargement: true, error: null });

    try {
      const response = await fetch("http://localhost:3000/tache");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des tâches");
      }
      const data: Tache[] = await response.json();

      set({
        taches: data,
        chargement: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue", //instanceof = verifie si error bien creer a partir de Error
        chargement: false,
      });
    }
  },
}));
