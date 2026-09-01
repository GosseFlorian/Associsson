import { AccesRefuseError } from '../src/lib/errors';
import {
  exigerMembre,
  exigerRole,
  exigerAdminOuProprietaire,
} from '../src/services/autorisation.service';
import { getMembreByUtilisateurEtOrganisationRepository } from '../src/repositories/membre.repository';
import { getOrganisationIdRepository } from '../src/repositories/organisation.repository';

jest.mock('../src/repositories/membre.repository');
jest.mock('../src/repositories/organisation.repository');

const membreAdmin = {
  id: 10,
  utilisateur_id: 1,
  organisation_id: 5,
  role: 'admin' as const,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('exigerMembre', () => {
  it("succès : renvoie le membre s'il appartient à l'organisation", async () => {
    (getMembreByUtilisateurEtOrganisationRepository as jest.Mock).mockResolvedValue(
      membreAdmin
    );

    const resultat = await exigerMembre(1, 5);

    expect(getMembreByUtilisateurEtOrganisationRepository).toHaveBeenCalledWith(
      1,
      5
    );
    expect(resultat).toBe(membreAdmin);
  });

  it("erreur : lève AccesRefuseError si l'utilisateur n'est pas membre", async () => {
    (getMembreByUtilisateurEtOrganisationRepository as jest.Mock).mockResolvedValue(
      null
    );

    await expect(exigerMembre(1, 5)).rejects.toThrow(AccesRefuseError);
  });
});

describe('exigerRole', () => {
  it('succès : accepte un membre dont le rôle est autorisé', async () => {
    (getMembreByUtilisateurEtOrganisationRepository as jest.Mock).mockResolvedValue(
      membreAdmin
    );

    const resultat = await exigerRole(1, 5, ['admin']);

    expect(resultat).toBe(membreAdmin);
  });

  it('erreur : refuse un bénévole pour une action admin', async () => {
    (getMembreByUtilisateurEtOrganisationRepository as jest.Mock).mockResolvedValue(
      { ...membreAdmin, role: 'benevole' }
    );

    await expect(exigerRole(1, 5, ['admin'])).rejects.toThrow(AccesRefuseError);
  });
});

describe('exigerAdminOuProprietaire', () => {
  it("succès : le propriétaire a le droit même sans ligne membre", async () => {
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue({
      id: 5,
      proprietaire_id: 1,
    });
    (getMembreByUtilisateurEtOrganisationRepository as jest.Mock).mockResolvedValue(
      null
    );

    const resultat = await exigerAdminOuProprietaire(1, 5);

    expect(resultat).toEqual({ role: 'admin' });
  });

  it("erreur : refuse un utilisateur qui n'est ni propriétaire ni admin", async () => {
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue({
      id: 5,
      proprietaire_id: 99,
    });
    (getMembreByUtilisateurEtOrganisationRepository as jest.Mock).mockResolvedValue(
      { ...membreAdmin, role: 'licencie' }
    );

    await expect(exigerAdminOuProprietaire(1, 5)).rejects.toThrow(
      AccesRefuseError
    );
  });
});
