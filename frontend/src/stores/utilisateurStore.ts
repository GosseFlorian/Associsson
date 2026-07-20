import { create } from "zustand";

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  date_inscription: string;
};

interface UtilisateurStore {
  utilisateurs: Utilisateur[];
  utilisateur: Utilisateur | null,
  chargementUtilisateur: boolean;
  errorUtilisateur: string | null;
  fetchUtilisateur: () => Promise<void>;
  fetchUtilisateurById: (id: number) => Promise<void>;
}

export const useUtilisateurStore = create<UtilisateurStore>((set) => ({
  utilisateurs: [],
  utilisateur: null,
  chargementUtilisateur: false,
  errorUtilisateur: null,

  fetchUtilisateur: async () => {
    set({ chargementUtilisateur: true, errorUtilisateur: null });

    try {
      const response = await fetch("http://localhost:3000/utilisateur");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des utilisateurs");
      }
      const data: Utilisateur[] = await response.json();

      set({
        utilisateurs : data,
        chargementUtilisateur: false,
      });
    } catch (error) {
      set({
        errorUtilisateur: error instanceof Error ? error.message : "Erreur inconnue", //instanceof = verifie si error bien creer a partir de Error
        chargementUtilisateur: false,
      });
    }
  },

  fetchUtilisateurById: async (id: number) => {
     set({ chargementUtilisateur: true, errorUtilisateur: null });

     try {
       const response = await fetch(
         `http://localhost:3000/utilisateur/${id}`
       );

       if (!response.ok) {
         throw new Error("Utilisateur introuvable");
       }

       const data: Utilisateur = await response.json();

       set({
         utilisateur: data,
         chargementUtilisateur: false,
       });

     } catch (error) {
       set({
         errorUtilisateur: error instanceof Error ? error.message : "Erreur inconnue",
         chargementUtilisateur: false,
       });
     }
   },
}));
