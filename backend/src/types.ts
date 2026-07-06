export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  mot_de_passe: string;
  date_inscription: string;
}

export interface Membre {
  id: number;
  organisation_id: number;
  utilisateur_id: number;
  role: string;
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
