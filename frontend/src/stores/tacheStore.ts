import { create } from "zustand";
import { apiFetch } from "../lib/api";

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

interface CreateTacheData {
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  date_echeance: string;
  assigne_a: number;
  projet_id: number;
  createur_id: number;
}

interface UpdateTacheData {
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  date_echeance: string;
}

interface TacheStore {
  taches: Tache[];
  chargementTache: boolean;
  errorTache: string | null;
  fetchTache: () => Promise<void>;
  toggleTache: (id: number) => Promise<void>;
  deleteTache: (id: number) => Promise<void>;
  createTache: (data: CreateTacheData) => Promise<void>;
  updateTache: (id: number, data: UpdateTacheData) => Promise<void>;
}

export const useTacheStore = create<TacheStore>((set, get) => ({
  taches: [],
  chargementTache: false,
  errorTache: null,

  fetchTache: async () => {
    set({ chargementTache: true, errorTache: null });

    try {
      const response = await apiFetch("/tache");

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

      await apiFetch(`/tache/${id}`, {
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
      const response = await apiFetch(`/tache/${id}`, {
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
        errorTache: error instanceof Error ? error.message : "Erreur inconnue",
        chargementTache: false,
      });
    }
  },

  createTache: async (data: CreateTacheData) => {
    set({ chargementTache: true, errorTache: null });

    try {
      const response = await apiFetch("/tache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création de la tâche");
      }

      await get().fetchTache();
    } catch (error) {
      set({
        errorTache: error instanceof Error ? error.message : "Erreur inconnue",
        chargementTache: false,
      });
    }
  },

  updateTache: async (id: number, data: UpdateTacheData) => {
    set({ chargementTache: true, errorTache: null });

    try {
      const response = await apiFetch(`/tache/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la modification de la tâche");
      }

      const tacheModifiee: Tache = await response.json();

      set((state) => ({
        taches: state.taches.map((t) =>
          t.id === id ? tacheModifiee : t
        ),
        chargementTache: false,
      }));
    } catch (error) {
      set({
        errorTache:
          error instanceof Error ? error.message : "Erreur inconnue",
        chargementTache: false,
      });
    }
  },
}));
