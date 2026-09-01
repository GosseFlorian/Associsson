import { AccesRefuseError } from '../lib/errors';
import { Organisation, OrganisationDetails } from '../types/types';
import {
  getOrganisationIdRepository,
  getOrganisationsRepository,
  postOrganisationRepository,
  putOrganisationRepository,
  deleteOrganisationRepository,
} from '../repositories/organisation.repository';
import { postMembreRepository } from '../repositories/membre.repository';
import {
  exigerMembre,
  exigerRole,
} from './autorisation.service';

export const getOrganisationsService = async (
  utilisateurId: number
): Promise<OrganisationDetails[]> => {
  return await getOrganisationsRepository(utilisateurId);
};

export const getOrganisationIdService = async (
  id: number,
  utilisateurId: number
): Promise<OrganisationDetails | null> => {
  const organisation = await getOrganisationIdRepository(id);
  if (!organisation) {
    return null;
  }
  await exigerMembre(utilisateurId, id);
  return organisation;
};

export const postOrganisationService = async (
  data: Organisation,
  utilisateurId: number
): Promise<Organisation> => {
  // Validation du nom
  if (!data.nom || data.nom.trim() === '') {
    throw new Error("Le nom de l'organisation est obligatoire");
  }
  const organisation = await postOrganisationRepository({
    ...data,
    proprietaire_id: utilisateurId,
  });
  await postMembreRepository({
    organisation_id: organisation.id,
    utilisateur_id: utilisateurId,
    role: 'admin',
  });
  return organisation;
};

export const putOrganisationService = async (
  id: number,
  data: Partial<Organisation>,
  utilisateurId: number
): Promise<Organisation | null> => {
  const organisation = await getOrganisationIdRepository(id);
  if (!organisation) {
    return null;
  }
  await exigerRole(utilisateurId, id, ['admin']);
  const donneesAutorisees: Partial<Organisation> = { ...data };
  delete donneesAutorisees.proprietaire_id;
  return await putOrganisationRepository(id, donneesAutorisees);
};

export const deleteOrganisationService = async (
  id: number,
  utilisateurId: number
): Promise<Organisation | null> => {
  const organisation = await getOrganisationIdRepository(id);
  if (!organisation) {
    return null;
  }
  if (organisation.proprietaire_id !== utilisateurId) {
    throw new AccesRefuseError(
      'Seul le propriétaire peut supprimer cette organisation'
    );
  }
  return await deleteOrganisationRepository(id);
};
