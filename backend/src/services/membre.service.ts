import { Membre, MembreDetails } from '../types/types';
import {
  getMembresRepository,
  getMembreParIdRepository,
  getMembreByUtilisateurEtOrganisationRepository,
  putMembreRepository,
  postMembreRepository,
  deleteMembreRepository,
} from '../repositories/membre.repository';
import {
  exigerAdminOuProprietaire,
  exigerMembre,
} from './autorisation.service';

export async function getMembreService(
  utilisateurId: number
): Promise<MembreDetails[]> {
  return getMembresRepository(utilisateurId);
}

export async function getMembreParIdService(
  id: number,
  utilisateurId: number
): Promise<MembreDetails | null> {
  const membre = await getMembreParIdRepository(id);
  if (!membre) {
    return null;
  }
  await exigerMembre(utilisateurId, membre.organisation_id);
  return membre;
}

export async function postMembreService(
  data: Membre,
  utilisateurId: number
): Promise<Membre> {
  // Validation du role
  if (!data.role || data.role.trim() === '') {
    throw new Error('Le role du membre est obligatoire');
  }
  await exigerAdminOuProprietaire(utilisateurId, data.organisation_id);

  const dejaMembre = await getMembreByUtilisateurEtOrganisationRepository(
    data.utilisateur_id,
    data.organisation_id
  );
  if (dejaMembre) {
    return dejaMembre;
  }

  return postMembreRepository(data);
}

export async function putMembreService(
  id: number,
  data: Partial<Membre>,
  utilisateurId: number
): Promise<Membre | null> {
  if (!data.role || data.role.trim() === '') {
    throw new Error('Le role du membre est obligatoire');
  }
  const membre = await getMembreParIdRepository(id);
  if (!membre) {
    return null;
  }
  await exigerAdminOuProprietaire(utilisateurId, membre.organisation_id);
  return putMembreRepository(id, { role: data.role });
}

export async function deleteMembreService(
  id: number,
  utilisateurId: number
): Promise<Membre | null> {
  const membre = await getMembreParIdRepository(id);
  if (!membre) {
    return null;
  }
  await exigerAdminOuProprietaire(utilisateurId, membre.organisation_id);
  return deleteMembreRepository(id);
}
