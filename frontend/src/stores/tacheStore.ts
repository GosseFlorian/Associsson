import { create } from "zustand";

interface Tache {
  id: number;
  projet_id: number;
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  date_echeance: string;
  assigne_a: number;
};

interface TacheStore {
  taches: Tache[];
  chargementTache: boolean;
  errorTache: string | null;
  fetchTache: () => Promise<void>;
}

export const useTacheStore = create<TacheStore>((set) => ({
  taches: [],
  chargementTache: false,
  errorTache: null,

  fetchTache: async () => {
    set({ chargementTache: true, errorTache: null });

    try {
      const response = await fetch("http://localhost:3000/tache");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des tâches");
      }
      const data: Tache[] = await response.json();

      set({
        taches: data,
        chargementTache: false,
      });
    } catch (error) {
      set({
        errorTache: error instanceof Error ? error.message : "Erreur inconnue", //instanceof = verifie si error bien creer a partir de Error
        chargementTache: false,
      });
    }
  },
}));
