import { create } from "zustand"

interface Organisation {
  id: number;
  nom: string;
  date_creation: string;
  proprietaire_id: number;
};

interface OrganisationStore {
  organisations: Organisation[];
  chargementOrganisation: boolean;
  errorOrganisation: string | null;
  fetchOrganisation: () => Promise<void>;
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
        errorOrganisation: error instanceof Error ? error.message : "Erreur inconnue",
        chargementOrganisation: false,
      });
    }
  },
}));
