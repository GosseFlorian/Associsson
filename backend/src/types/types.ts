export type StatutTache = "a_assigne" | "en_cours" | "termine";
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
  description?: string | null;
  date_creation: Date;
  date_debut?: Date | null;
  date_fin?: Date | null;
  adresse?: string | null;
  est_termine: boolean;
  nombre_place?: number;
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
  createur_id: number;
  projet_id: number;
  titre: string;
  description?: string | null;
  statut: StatutTache;
  priorite: PrioriteTache;
  date_echeance?: Date | null;
  assigne_a?: number | null;
}

export interface InscriptionProjet {
  id: number;
  projet_id: number;
  membre_id: number;
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
  nombreInscrit: number;
}

// Pour getTachesRepository et getTacheByIdRepository
export interface TacheDetails extends Tache {
  nomProjet: string;
  nomAssigneA?: string | null;
  nomCreateur: string;
}
// Pour getInscriptionProjetRepository et getInscriptionProjetByIdRepository
export interface InscriptionProjetDetails extends InscriptionProjet {
  nomProjet: string;
  nomMembre: string;
  nombrePlaceProjet?: number | null;
}
