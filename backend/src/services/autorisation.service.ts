import { AccesRefuseError } from '../lib/errors';
import { getMembreByUtilisateurEtOrganisationRepository } from '../repositories/membre.repository';
import { getOrganisationIdRepository } from '../repositories/organisation.repository';
import { Membre, RoleMembre } from '../types/types';

export async function getMembreDansOrganisation(
  utilisateurId: number,
  organisationId: number
): Promise<Membre | null> {
  return getMembreByUtilisateurEtOrganisationRepository(
    utilisateurId,
    organisationId
  );
}

export async function exigerMembre(
  utilisateurId: number,
  organisationId: number
): Promise<Membre> {
  const membre = await getMembreDansOrganisation(utilisateurId, organisationId);
  if (!membre) {
    throw new AccesRefuseError(
      "Vous n'êtes pas membre de cette organisation"
    );
  }
  return membre;
}

export async function exigerRole(
  utilisateurId: number,
  organisationId: number,
  rolesAutorises: RoleMembre[]
): Promise<Membre> {
  const membre = await exigerMembre(utilisateurId, organisationId);
  if (!rolesAutorises.includes(membre.role)) {
    throw new AccesRefuseError('Droits insuffisants pour cette action');
  }
  return membre;
}

export async function exigerAdminOuProprietaire(
  utilisateurId: number,
  organisationId: number
): Promise<Membre | { role: 'admin' }> {
  const organisation = await getOrganisationIdRepository(organisationId);
  if (!organisation) {
    throw new AccesRefuseError('Accès refusé');
  }
  if (organisation.proprietaire_id === utilisateurId) {
    const membre = await getMembreDansOrganisation(
      utilisateurId,
      organisationId
    );
    return membre ?? { role: 'admin' };
  }
  return exigerRole(utilisateurId, organisationId, ['admin']);
}
