import {
  getOrganisationsService,
  getOrganisationIdService,
  postOrganisationService,
  putOrganisationService,
  deleteOrganisationService,
} from '../src/services/organisation.service';
import {
  getOrganisationsRepository,
  getOrganisationIdRepository,
  postOrganisationRepository,
  putOrganisationRepository,
  deleteOrganisationRepository,
} from '../src/repositories/organisation.repository';
import { postMembreRepository } from '../src/repositories/membre.repository';
import { exigerMembre, exigerRole } from '../src/services/autorisation.service';
import { AccesRefuseError } from '../src/lib/errors';

jest.mock('../src/repositories/organisation.repository');
jest.mock('../src/repositories/membre.repository');
jest.mock('../src/services/autorisation.service');

const organisation = {
  id: 1,
  nom: 'OpenAI',
  proprietaire_id: 1,
};

beforeEach(() => {
  jest.clearAllMocks();
  (exigerMembre as jest.Mock).mockResolvedValue({
    id: 10,
    role: 'admin',
    organisation_id: 1,
    utilisateur_id: 1,
  });
  (exigerRole as jest.Mock).mockResolvedValue({
    id: 10,
    role: 'admin',
    organisation_id: 1,
    utilisateur_id: 1,
  });
});

describe('getOrganisationsService', () => {
  it('succès : renvoie la liste renvoyée par le repository', async () => {
    const organisations = [
      { id: 1, nom: 'OpenAI' },
      { id: 2, nom: 'Google' },
    ];
    (getOrganisationsRepository as jest.Mock).mockResolvedValue(organisations);

    const resultat = await getOrganisationsService(1);

    expect(getOrganisationsRepository).toHaveBeenCalledWith(1);
    expect(resultat).toBe(organisations);
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    (getOrganisationsRepository as jest.Mock).mockRejectedValue(
      new Error('DB down')
    );

    await expect(getOrganisationsService(1)).rejects.toThrow('DB down');
  });
});

describe('getOrganisationIdService', () => {
  it("succès : renvoie l'organisation trouvée par le repository", async () => {
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(organisation);

    const resultat = await getOrganisationIdService(1, 1);

    expect(getOrganisationIdRepository).toHaveBeenCalledWith(1);
    expect(exigerMembre).toHaveBeenCalledWith(1, 1);
    expect(resultat).toBe(organisation);
  });

  it('erreur : renvoie null si le repository ne trouve rien', async () => {
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(null);

    const resultat = await getOrganisationIdService(999, 1);

    expect(resultat).toBeNull();
    expect(exigerMembre).not.toHaveBeenCalled();
  });

  it("erreur : refuse l'accès si l'utilisateur n'est pas membre (IDOR)", async () => {
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(organisation);
    (exigerMembre as jest.Mock).mockRejectedValue(new AccesRefuseError());

    await expect(getOrganisationIdService(1, 2)).rejects.toThrow(
      AccesRefuseError
    );
  });
});

describe('postOrganisationService', () => {
  it("succès : force le propriétaire au JWT et crée le membre admin", async () => {
    const data = { nom: 'OpenAI', est_actif: true, proprietaire_id: 99 };
    const organisationCreee = { id: 1, nom: 'OpenAI', proprietaire_id: 1 };
    (postOrganisationRepository as jest.Mock).mockResolvedValue(
      organisationCreee
    );
    (postMembreRepository as jest.Mock).mockResolvedValue({
      id: 1,
      role: 'admin',
    });

    const resultat = await postOrganisationService(data as any, 1);

    expect(postOrganisationRepository).toHaveBeenCalledWith({
      ...data,
      proprietaire_id: 1,
    });
    expect(postMembreRepository).toHaveBeenCalledWith({
      organisation_id: 1,
      utilisateur_id: 1,
      role: 'admin',
    });
    expect(resultat).toBe(organisationCreee);
  });

  it('erreur : lève une erreur si le nom est vide', async () => {
    const data = { nom: '   ', est_actif: true, proprietaire_id: 1 };

    await expect(postOrganisationService(data as any, 1)).rejects.toThrow(
      "Le nom de l'organisation est obligatoire"
    );
    expect(postOrganisationRepository).not.toHaveBeenCalled();
  });

  it('erreur : lève une erreur si le nom est manquant', async () => {
    const data = { est_actif: true, proprietaire_id: 1 };

    await expect(postOrganisationService(data as any, 1)).rejects.toThrow(
      "Le nom de l'organisation est obligatoire"
    );
    expect(postOrganisationRepository).not.toHaveBeenCalled();
  });
});

describe('putOrganisationService', () => {
  it("succès : renvoie l'organisation modifiée par le repository", async () => {
    const organisationModifiee = { id: 1, nom: 'Nouvelle organisation' };
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(organisation);
    (putOrganisationRepository as jest.Mock).mockResolvedValue(
      organisationModifiee
    );

    const resultat = await putOrganisationService(
      1,
      { nom: 'Nouvelle organisation', proprietaire_id: 99 },
      1
    );

    expect(exigerRole).toHaveBeenCalledWith(1, 1, ['admin']);
    expect(putOrganisationRepository).toHaveBeenCalledWith(1, {
      nom: 'Nouvelle organisation',
    });
    expect(resultat).toBe(organisationModifiee);
  });

  it('erreur : renvoie null si le repository ne trouve rien à modifier', async () => {
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(null);

    const resultat = await putOrganisationService(999, { nom: 'Test' }, 1);

    expect(resultat).toBeNull();
    expect(putOrganisationRepository).not.toHaveBeenCalled();
  });
});

describe('deleteOrganisationService', () => {
  it("succès : renvoie l'organisation supprimée par le repository", async () => {
    const organisationSupprimee = { id: 1, nom: 'OpenAI', proprietaire_id: 1 };
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(
      organisationSupprimee
    );
    (deleteOrganisationRepository as jest.Mock).mockResolvedValue(
      organisationSupprimee
    );

    const resultat = await deleteOrganisationService(1, 1);

    expect(deleteOrganisationRepository).toHaveBeenCalledWith(1);
    expect(resultat).toBe(organisationSupprimee);
  });

  it('erreur : renvoie null si le repository ne trouve rien à supprimer', async () => {
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(null);

    const resultat = await deleteOrganisationService(999, 1);

    expect(resultat).toBeNull();
  });

  it("erreur : refuse la suppression si l'utilisateur n'est pas propriétaire (IDOR)", async () => {
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue({
      id: 1,
      nom: 'OpenAI',
      proprietaire_id: 99,
    });

    await expect(deleteOrganisationService(1, 1)).rejects.toThrow(
      AccesRefuseError
    );
    expect(deleteOrganisationRepository).not.toHaveBeenCalled();
  });
});
