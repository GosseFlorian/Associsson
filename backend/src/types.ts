export type StatutTache = "a_faire" | "en_cours" | "termine";
export type PrioriteTache = "faible" | "moyenne" | "haute" | "tres_haute";
export type RoleMembre = "admin" | "benevole" | "licencie";

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
  role: RoleMembre;
}

export interface Projet {
  id: number;
  organisation_id: number;
  createur_id: number;
  titre: string;
  description?: string;
  date_creation: Date;
  date_debut?: Date;
  date_fin?: Date;
  adresse?: string;
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
  description?: string;
  statut: StatutTache;
  priorite: PrioriteTache;
  date_echeance?: Date;
  assigne_a?: number | null;
}

// Pour getMembresRepository et getMembreParIdRepository
export interface MembreDetails extends Membre {
  nomUtilisateur: string;
  nomOrganisation: string;
}

// Pour getOrganisationRepository et getOrganisationIdRepository
export interface OrganisationDetails extends Organisation {
  nomProprietaire: string;
}

// Pour getProjetsRepository et getProjetByIdRepository
export interface ProjetDetails extends Projet {
  nomOrganisation: string;
  nomCreateur: string;
}

// Pour getTachesRepository et getTacheByIdRepository
export interface TacheDetails extends Tache {
  nomProjet: string;
  nomAssigneA?: string;
}
