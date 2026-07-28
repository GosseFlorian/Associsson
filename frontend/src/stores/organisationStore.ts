import { create } from "zustand";
import { useMembreStore } from "./membreStore";

interface Organisation {
  id: number;
  nom: string;
  date_creation: string;
  proprietaire_id: number;
}

interface OrganisationStore {
  organisations: Organisation[];
  chargementOrganisation: boolean;
  errorOrganisation: string | null;
  fetchOrganisation: () => Promise<void>;
  deleteOrganisation: (id: number) => Promise<void>;
  createOrganisation: (nom: string, proprietaire_id: number) => Promise<void>;
}

export const useOrganisationStore = create<OrganisationStore>((set) => ({
  organisations: [],
  chargementOrganisation: false,
  errorOrganisation: null,

  fetchOrganisation: async () => {
    set({ chargementOrganisation: true, errorOrganisation: null });

    try {
      const response = await fetch("http://localhost:3000/organisation");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des organisations");
      }
      const data: Organisation[] = await response.json();

      set({
        organisations: data,
        chargementOrganisation: false,
      });
    } catch (error) {
      set({
        errorOrganisation:
          error instanceof Error ? error.message : "Erreur inconnue",
        chargementOrganisation: false,
      });
    }
  },

  deleteOrganisation: async (id: number) => {
    set({ chargementOrganisation: true, errorOrganisation: null });

    try {
      const response = await fetch(`http://localhost:3000/organisation/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'organisations");
      }
        set((state) => ({
          organisations: state.organisations.filter((o) => o.id !== id),
          chargementOrganisation: false,
        }));
    } catch (error) {
      set({
        errorOrganisation:
          error instanceof Error ? error.message : "Erreur inconnue",
        chargementOrganisation: false,
      });    }
  },

  createOrganisation: async (nom: string, proprietaire_id: number) => {
    set({ chargementOrganisation: true, errorOrganisation: null });

    try {
      const response = await fetch("http://localhost:3000/organisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          proprietaire_id,
        }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'organisation");
      }
      set({
        chargementOrganisation: false,
      });
      const organisation = await response.json();
      await useMembreStore.getState().createMembre(
            proprietaire_id,
            organisation.id,
            "admin"
          );
    } catch (error) {
      set({
        errorOrganisation:
          error instanceof Error ? error.message : "Erreur inconnue",
        chargementOrganisation: false,
      });
    }
  }
}));
