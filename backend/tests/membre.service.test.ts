import {
  getMembreService,
  getMembreParIdService,
  putMembreService,
  postMembreService,
  deleteMembreService,
} from '../src/services/membre.service';
import {
  getMembresRepository,
  getMembreParIdRepository,
  getMembreByUtilisateurEtOrganisationRepository,
  putMembreRepository,
  postMembreRepository,
  deleteMembreRepository,
} from '../src/repositories/membre.repository';
import {
  exigerAdminOuProprietaire,
  exigerMembre,
} from '../src/services/autorisation.service';
import { AccesRefuseError } from '../src/lib/errors';

jest.mock('../src/repositories/membre.repository');
jest.mock('../src/services/autorisation.service');

const membre = {
  id: 5,
  role: 'benevole',
  organisation_id: 2,
  utilisateur_id: 3,
};

beforeEach(() => {
  jest.clearAllMocks();
  (exigerMembre as jest.Mock).mockResolvedValue(membre);
  (exigerAdminOuProprietaire as jest.Mock).mockResolvedValue({
    role: 'admin',
  });
});

describe('getMembreService', () => {
  it('succès : renvoie la liste renvoyée par le repository', async () => {
    const membres = [{ role: 'membre' }];
    (getMembresRepository as jest.Mock).mockResolvedValue(membres);

    const resultat = await getMembreService(1);

    expect(getMembresRepository).toHaveBeenCalledWith(1);
    expect(resultat).toBe(membres);
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    (getMembresRepository as jest.Mock).mockRejectedValue(new Error('DB down'));

    await expect(getMembreService(1)).rejects.toThrow('DB down');
  });
});

describe('getMembreParIdService', () => {
  it('succès : renvoie le membre trouvé par le repository', async () => {
    (getMembreParIdRepository as jest.Mock).mockResolvedValue(membre);

    const resultat = await getMembreParIdService(5, 1);

    expect(getMembreParIdRepository).toHaveBeenCalledWith(5);
    expect(exigerMembre).toHaveBeenCalledWith(1, 2);
    expect(resultat).toBe(membre);
  });

  it('erreur : renvoie null si le repository ne trouve rien', async () => {
    (getMembreParIdRepository as jest.Mock).mockResolvedValue(null);

    const resultat = await getMembreParIdService(999, 1);

    expect(resultat).toBeNull();
    expect(exigerMembre).not.toHaveBeenCalled();
  });

  it("erreur : refuse l'accès à un membre d'une autre organisation (IDOR)", async () => {
    (getMembreParIdRepository as jest.Mock).mockResolvedValue(membre);
    (exigerMembre as jest.Mock).mockRejectedValue(new AccesRefuseError());

    await expect(getMembreParIdService(5, 99)).rejects.toThrow(AccesRefuseError);
  });
});

describe('postMembreService', () => {
  it('succès : renvoie le membre créé par le repository quand le rôle est valide', async () => {
    const data = { utilisateur_id: 1, organisation_id: 2, role: 'benevole' };
    const membreCree = { id: 10, ...data };
    (getMembreByUtilisateurEtOrganisationRepository as jest.Mock).mockResolvedValue(
      null
    );
    (postMembreRepository as jest.Mock).mockResolvedValue(membreCree);

    const resultat = await postMembreService(data as any, 1);

    expect(exigerAdminOuProprietaire).toHaveBeenCalledWith(1, 2);
    expect(postMembreRepository).toHaveBeenCalledWith(data);
    expect(resultat).toBe(membreCree);
  });

  it('succès : renvoie le membre existant sans doublon', async () => {
    const data = { utilisateur_id: 1, organisation_id: 2, role: 'admin' };
    (getMembreByUtilisateurEtOrganisationRepository as jest.Mock).mockResolvedValue(
      membre
    );

    const resultat = await postMembreService(data as any, 1);

    expect(postMembreRepository).not.toHaveBeenCalled();
    expect(resultat).toBe(membre);
  });

  it('erreur : lève une erreur si le rôle est vide', async () => {
    const data = { utilisateur_id: 1, organisation_id: 2, role: '   ' };

    await expect(postMembreService(data as any, 1)).rejects.toThrow(
      'Le role du membre est obligatoire'
    );
    expect(postMembreRepository).not.toHaveBeenCalled();
  });

  it('erreur : lève une erreur si le rôle est manquant', async () => {
    const data = { utilisateur_id: 1, organisation_id: 2 };

    await expect(postMembreService(data as any, 1)).rejects.toThrow(
      'Le role du membre est obligatoire'
    );
    expect(postMembreRepository).not.toHaveBeenCalled();
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    (exigerAdminOuProprietaire as jest.Mock).mockResolvedValue({
      role: 'admin',
    });
    (getMembreByUtilisateurEtOrganisationRepository as jest.Mock).mockResolvedValue(
      null
    );
    (postMembreRepository as jest.Mock).mockRejectedValue(
      new Error('Échec de la création du membre')
    );

    await expect(
      postMembreService({ role: 'benevole', organisation_id: 2 } as any, 1)
    ).rejects.toThrow('Échec de la création du membre');
  });
});

describe('putMembreService', () => {
  it('succès : ne transmet que le rôle (anti-IDOR)', async () => {
    const membreModifie = { id: 1, role: 'admin' };
    (getMembreParIdRepository as jest.Mock).mockResolvedValue(membre);
    (putMembreRepository as jest.Mock).mockResolvedValue(membreModifie);

    const resultat = await putMembreService(
      1,
      { role: 'admin', organisation_id: 99 },
      1
    );

    expect(exigerAdminOuProprietaire).toHaveBeenCalledWith(1, 2);
    expect(putMembreRepository).toHaveBeenCalledWith(1, { role: 'admin' });
    expect(resultat).toBe(membreModifie);
  });

  it('erreur : renvoie null si le repository ne trouve rien à modifier', async () => {
    (getMembreParIdRepository as jest.Mock).mockResolvedValue(null);

    const resultat = await putMembreService(999, { role: 'admin' }, 1);

    expect(resultat).toBeNull();
  });

  it('erreur : lève une erreur si le rôle est absent', async () => {
    await expect(
      putMembreService(1, { organisation_id: 2 }, 1)
    ).rejects.toThrow('Le role du membre est obligatoire');
    expect(getMembreParIdRepository).not.toHaveBeenCalled();
    expect(putMembreRepository).not.toHaveBeenCalled();
  });
});

describe('deleteMembreService', () => {
  it('succès : renvoie le membre supprimé par le repository', async () => {
    const membreSupprime = { id: 7, organisation_id: 2 };
    (getMembreParIdRepository as jest.Mock).mockResolvedValue(membreSupprime);
    (deleteMembreRepository as jest.Mock).mockResolvedValue(membreSupprime);

    const resultat = await deleteMembreService(7, 1);

    expect(exigerAdminOuProprietaire).toHaveBeenCalledWith(1, 2);
    expect(deleteMembreRepository).toHaveBeenCalledWith(7);
    expect(resultat).toBe(membreSupprime);
  });

  it('erreur : renvoie null si le repository ne trouve rien à supprimer', async () => {
    (getMembreParIdRepository as jest.Mock).mockResolvedValue(null);

    const resultat = await deleteMembreService(999, 1);

    expect(resultat).toBeNull();
  });
});
