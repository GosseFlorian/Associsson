import { Projet, ProjetDetails } from '../types/types';
import {
  getProjetsRepository,
  getProjetByIdRepository,
  postProjetRepository,
  putProjetRepository,
  deleteProjetRepository,
} from '../repositories/projet.repository';
import { exigerMembre, exigerRole } from './autorisation.service';

export const getProjetsService = async (
  utilisateurId: number
): Promise<ProjetDetails[]> => {
  return await getProjetsRepository(utilisateurId);
};

export const getProjetByIdService = async (
  id: number,
  utilisateurId: number
): Promise<ProjetDetails | null> => {
  const projet = await getProjetByIdRepository(id);
  if (!projet) {
    return null;
  }
  await exigerMembre(utilisateurId, projet.organisation_id);
  return projet;
};

export const postProjetService = async (
  data: Projet,
  utilisateurId: number
): Promise<Projet> => {
  // Validation du titre
  if (!data.titre || data.titre.trim() === '') {
    throw new Error('Le titre du projet est obligatoire');
  }
  const membre = await exigerRole(utilisateurId, data.organisation_id, [
    'admin',
  ]);
  return await postProjetRepository({
    ...data,
    createur_id: membre.id,
  });
};

export const putProjetService = async (
  id: number,
  data: Projet,
  utilisateurId: number
): Promise<Projet | null> => {
  const projet = await getProjetByIdRepository(id);
  if (!projet) {
    return null;
  }
  await exigerRole(utilisateurId, projet.organisation_id, ['admin']);
  const donneesAutorisees: Projet = {
    ...data,
    organisation_id: projet.organisation_id,
  };
  return await putProjetRepository(id, donneesAutorisees);
};

export const deleteProjetService = async (
  id: number,
  utilisateurId: number
): Promise<Projet | null> => {
  const projet = await getProjetByIdRepository(id);
  if (!projet) {
    return null;
  }
  await exigerRole(utilisateurId, projet.organisation_id, ['admin']);
  return await deleteProjetRepository(id);
};
