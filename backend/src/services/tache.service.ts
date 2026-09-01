import {
  getTachesRepository,
  getTacheByIdRepository,
  postTacheRepository,
  putTacheRepository,
  deleteTacheRepository,
} from '../repositories/tache.repository';
import { getProjetByIdRepository } from '../repositories/projet.repository';
import { Tache, TacheDetails } from '../types/types';
import { exigerMembre, exigerRole } from './autorisation.service';

const ROLES_MUTATION_TACHE = ['admin', 'benevole'] as const;

async function organisationIdDeLaTache(
  tache: Tache | TacheDetails
): Promise<number | null> {
  const projet = await getProjetByIdRepository(tache.projet_id);
  return projet?.organisation_id ?? null;
}

export const getTachesService = async (
  utilisateurId: number
): Promise<TacheDetails[]> => {
  return await getTachesRepository(utilisateurId);
};

export const getTacheIdService = async (
  id: number,
  utilisateurId: number
): Promise<TacheDetails | null> => {
  const tache = await getTacheByIdRepository(id);
  if (!tache) {
    return null;
  }
  const organisationId = await organisationIdDeLaTache(tache);
  if (organisationId === null) {
    return null;
  }
  await exigerMembre(utilisateurId, organisationId);
  return tache;
};

export const postTacheService = async (
  data: Tache,
  utilisateurId: number
): Promise<Tache> => {
  // Validation du titre
  if (!data.titre || data.titre.trim() === '') {
    throw new Error('Le titre de la tâche est obligatoire');
  }
  const projet = await getProjetByIdRepository(data.projet_id);
  if (!projet) {
    throw new Error('Projet introuvable');
  }
  const membre = await exigerRole(
    utilisateurId,
    projet.organisation_id,
    [...ROLES_MUTATION_TACHE]
  );
  return await postTacheRepository({
    ...data,
    createur_id: membre.id,
  });
};

export const putTacheService = async (
  id: number,
  data: Partial<Tache>,
  utilisateurId: number
): Promise<Tache | null> => {
  const tache = await getTacheByIdRepository(id);
  if (!tache) {
    return null;
  }
  const organisationId = await organisationIdDeLaTache(tache);
  if (organisationId === null) {
    return null;
  }
  await exigerRole(utilisateurId, organisationId, [...ROLES_MUTATION_TACHE]);
  const donneesAutorisees: Partial<Tache> = { ...data };
  delete donneesAutorisees.projet_id;
  delete donneesAutorisees.createur_id;
  return await putTacheRepository(id, donneesAutorisees);
};

export const deleteTacheService = async (
  id: number,
  utilisateurId: number
): Promise<Tache | null> => {
  const tache = await getTacheByIdRepository(id);
  if (!tache) {
    return null;
  }
  const organisationId = await organisationIdDeLaTache(tache);
  if (organisationId === null) {
    return null;
  }
  await exigerRole(utilisateurId, organisationId, [...ROLES_MUTATION_TACHE]);
  return await deleteTacheRepository(id);
};
