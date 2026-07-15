export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  mot_de_passe: string;
  date_inscription: Date;
}

export interface Membre {
  id: number;
  organisation_id: number;
  utilisateur_id: number;
  role: string;
  nomUtilisateur: string;
  nomOrganisation: string;
}
export interface Projet {
  id: number;
  organisation_id: number;
  createur_id: number;
  titre: string;
  description: string;
  date_creation: Date;
  date_debut: Date;
  date_fin: Date;
  adresse: string;
  est_termine: boolean;
}

export interface Organisation {
  id: number;
  nom: string;
  date_creation: Date;
  est_actif: boolean;
  proprietaire_id: number;
}

export interface Tache {
  id: number;
  projet_id: number;
  titre: string;
  description: string | null;          
  statut: "a_faire" | "en_cours" | "termine";
  priorite: "faible" | "moyenne" | "haute" | "tres_haute";
  date_echeance: Date | null;          
  assigne_a: number | null;            
}
