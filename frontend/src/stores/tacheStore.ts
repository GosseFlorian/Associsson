import { create } from "zustand";

interface Tache {
  id: number;
  createur_id: number;
  projet_id: number;
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  date_echeance: string;
  assigne_a: number;
}

interface TacheStore {
  taches: Tache[];
  chargementTache: boolean;
  errorTache: string | null;
  fetchTache: () => Promise<void>;
  toggleTache: (id: number) => Promise<void>;
  deleteTache: (id: number) => Promise<void>;
}

export const useTacheStore = create<TacheStore>((set, get) => ({
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

  toggleTache: async (id: number) => {
    try {
      const tache = get().taches.find((t) => t.id === id);
      if (!tache) return;
      const newValue = tache.statut === "termine" ? "en_cours" : "termine";

      await fetch(`http://localhost:3000/tache/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newValue }),
      });

      set((state) => ({
        taches: state.taches.map((t) =>
          t.id === id ? { ...t, statut: newValue } : t,
        ),
      }));
    } catch (err) {
      console.error("Erreur toggle tache:", err);
    }
  },

  deleteTache: async (id: number) => {
    set({ chargementTache: true, errorTache: null });

    try {
      const response = await fetch(`http://localhost:3000/tache/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la tache");
      }
        set((state) => ({
          taches: state.taches.filter((o) => o.id !== id),
          chargementOrganisation: false,
        }));
    } catch (error) {
      set({
        errorTache:
          error instanceof Error ? error.message : "Erreur inconnue",
        chargementTache: false,
      });    }
  },
}));
