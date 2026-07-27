import { create } from "zustand"

interface Membre {
  id: number;
  organisation_id: number;
  utilisateur_id: number;
  nomUtilisateur: string;
  nomOrganisation: string;
  role: string;
};

interface MembreStore {
  membres: Membre[];
  chargementMembre: boolean;
  errorMembre: string | null;
  fetchMembre: () => Promise<void>;
  fetchMembreByUtilisateurId: (
    idUtilisateur: number,
    idOrganisation: number
  ) => Membre | undefined;
  createMembre: (utilisateur_id: number, organisation_id: number, role: string) => Promise<void>;
};

export const useMembreStore = create<MembreStore>((set, get) => ({
  membres: [],
  chargementMembre: false,
  errorMembre: null,

  fetchMembre: async () => {
    set({ chargementMembre: true, errorMembre: null });

    try {
      const response = await fetch("http://localhost:3000/membre")

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des membres");
      }
      const data: Membre[] = await response.json();

      set({
        membres: data,
        chargementMembre: false,
      });
    } catch (error) {
      set({
        errorMembre: error instanceof Error ? error.message : "Erreur inconnue",
        chargementMembre: false,
      });
    }
  },

  fetchMembreByUtilisateurId: (idUtilisateur, idOrganisation) => {
    const membres = get().membres;

    return membres.find(
      (membre) =>
        membre.utilisateur_id === idUtilisateur &&
        membre.organisation_id === idOrganisation
    );
  },

  createMembre: async (utilisateur_id: number, organisation_id: number, role: string) => {
    set({ chargementMembre: true, errorMembre: null });

    try {
      const response = await fetch("http://localhost:3000/membre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          utilisateur_id,
          organisation_id,
          role,
        }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création du membre");
      }
      set({
        chargementMembre: false,
      });
    } catch (error) {
      set({
        errorMembre:
          error instanceof Error ? error.message : "Erreur inconnue",
        chargementMembre: false,
      });

      throw error;
    }
  },
}));
