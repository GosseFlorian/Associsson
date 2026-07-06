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
