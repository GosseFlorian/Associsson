import { create } from "zustand";

interface Projet {
  id: number;
  organisation_id: number;
  titre: string;
  description: string;
  date_debut: string;
  est_termine: boolean;
  adresse: string;
}

interface ProjetStore {
  projets: Projet[];
  chargementProjet: boolean;
  errorProjet: string | null;

  fetchProjet: () => Promise<void>;
  fetchProjetByOrganisationId: (idOrganisation: number) => Projet[];
}

export const useProjetStore = create<ProjetStore>((set, get) => ({
  projets: [],
  chargementProjet: false,
  errorProjet: null,

  fetchProjet: async () => {
    set({
      chargementProjet: true,
      errorProjet: null,
    });

    try {
      const response = await fetch("http://localhost:3000/projet");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des projets");
      }

      const data: Projet[] = await response.json();

      set({
        projets: data,
        chargementProjet: false,
      });

    } catch (error) {
      set({
        errorProjet: error instanceof Error
          ? error.message
          : "Erreur inconnue",
        chargementProjet: false,
      });
    }
  },


  fetchProjetByOrganisationId: (idOrganisation) => {
    const projets = get().projets;

    return projets.filter(
      (projet) => projet.organisation_id === idOrganisation
    );
  },
}));
