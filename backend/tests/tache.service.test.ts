import {
  getTachesService,
  getTacheIdService,
  postTacheService,
  putTacheService,
  deleteTacheService,
} from '../src/services/tache.service';
import {
  getTachesRepository,
  getTacheByIdRepository,
  postTacheRepository,
  putTacheRepository,
  deleteTacheRepository,
} from '../src/repositories/tache.repository';
import { getProjetByIdRepository } from '../src/repositories/projet.repository';
import { exigerMembre, exigerRole } from '../src/services/autorisation.service';
import { AccesRefuseError } from '../src/lib/errors';

jest.mock('../src/repositories/tache.repository');
jest.mock('../src/repositories/projet.repository');
jest.mock('../src/services/autorisation.service');

const projet = { id: 1, organisation_id: 10 };
const membreBenevole = {
  id: 8,
  role: 'benevole' as const,
  organisation_id: 10,
  utilisateur_id: 1,
};

beforeEach(() => {
  jest.clearAllMocks();
  (exigerMembre as jest.Mock).mockResolvedValue(membreBenevole);
  (exigerRole as jest.Mock).mockResolvedValue(membreBenevole);
  (getProjetByIdRepository as jest.Mock).mockResolvedValue(projet);
});

describe('getTachesService', () => {
  it('succès : renvoie la liste renvoyée par le repository', async () => {
    const taches = [{ id: 1, titre: 'Tâche 1', statut: 'a_faire' }];
    (getTachesRepository as jest.Mock).mockResolvedValue(taches);

    const resultat = await getTachesService(1);

    expect(getTachesRepository).toHaveBeenCalledWith(1);
    expect(resultat).toBe(taches);
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    (getTachesRepository as jest.Mock).mockRejectedValue(new Error('DB down'));

    await expect(getTachesService(1)).rejects.toThrow('DB down');
  });
});

describe('getTacheIdService', () => {
  it('succès : renvoie la tâche trouvée par le repository', async () => {
    const tache = { id: 5, titre: 'Tâche 5', statut: 'en_cours', projet_id: 1 };
    (getTacheByIdRepository as jest.Mock).mockResolvedValue(tache);

    const resultat = await getTacheIdService(5, 1);

    expect(getTacheByIdRepository).toHaveBeenCalledWith(5);
    expect(exigerMembre).toHaveBeenCalledWith(1, 10);
    expect(resultat).toBe(tache);
  });

  it('erreur : renvoie null si le repository ne trouve rien', async () => {
    (getTacheByIdRepository as jest.Mock).mockResolvedValue(null);

    const resultat = await getTacheIdService(999, 1);

    expect(resultat).toBeNull();
  });

  it("erreur : refuse l'accès à une tâche d'une autre organisation (IDOR)", async () => {
    (getTacheByIdRepository as jest.Mock).mockResolvedValue({
      id: 5,
      projet_id: 1,
    });
    (exigerMembre as jest.Mock).mockRejectedValue(new AccesRefuseError());

    await expect(getTacheIdService(5, 99)).rejects.toThrow(AccesRefuseError);
  });
});

describe('postTacheService', () => {
  it('succès : impose le createur_id du membre authentifié', async () => {
    const data = {
      titre: 'Nouvelle tâche',
      statut: 'a_faire',
      priorite: 'moyenne',
      projet_id: 1,
      createur_id: 999,
    };
    const tacheCreee = { id: 10, ...data, createur_id: 8 };
    (postTacheRepository as jest.Mock).mockResolvedValue(tacheCreee);

    const resultat = await postTacheService(data as any, 1);

    expect(exigerRole).toHaveBeenCalledWith(1, 10, ['admin', 'benevole']);
    expect(postTacheRepository).toHaveBeenCalledWith({
      ...data,
      createur_id: 8,
    });
    expect(resultat).toBe(tacheCreee);
  });

  it('erreur : lève une erreur si le titre est vide', async () => {
    const data = {
      titre: '   ',
      statut: 'a_faire',
      priorite: 'moyenne',
      projet_id: 1,
    };

    await expect(postTacheService(data as any, 1)).rejects.toThrow(
      'Le titre de la tâche est obligatoire'
    );
    expect(postTacheRepository).not.toHaveBeenCalled();
  });

  it('erreur : lève une erreur si le titre est manquant', async () => {
    const data = { statut: 'a_faire', priorite: 'moyenne', projet_id: 1 };

    await expect(postTacheService(data as any, 1)).rejects.toThrow(
      'Le titre de la tâche est obligatoire'
    );
  });

  it('erreur : lève une erreur si le projet est introuvable', async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValue(null);

    await expect(
      postTacheService({ titre: 'Ok', projet_id: 1 } as any, 1)
    ).rejects.toThrow('Projet introuvable');
  });
});

describe('putTacheService', () => {
  it('succès : ignore projet_id et createur_id (anti-IDOR)', async () => {
    const tache = { id: 1, projet_id: 1, createur_id: 8 };
    const tacheModifiee = { id: 1, titre: 'Tâche modifiée', statut: 'termine' };
    (getTacheByIdRepository as jest.Mock).mockResolvedValue(tache);
    (putTacheRepository as jest.Mock).mockResolvedValue(tacheModifiee);

    const resultat = await putTacheService(
      1,
      { statut: 'termine', projet_id: 99, createur_id: 99 },
      1
    );

    expect(exigerRole).toHaveBeenCalledWith(1, 10, ['admin', 'benevole']);
    expect(putTacheRepository).toHaveBeenCalledWith(1, { statut: 'termine' });
    expect(resultat).toBe(tacheModifiee);
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    (getTacheByIdRepository as jest.Mock).mockResolvedValue({
      id: 1,
      projet_id: 1,
    });
    (putTacheRepository as jest.Mock).mockRejectedValue(
      new Error('Echec de la modification')
    );

    await expect(putTacheService(1, { statut: 'termine' }, 1)).rejects.toThrow(
      'Echec de la modification'
    );
  });
});

describe('deleteTacheService', () => {
  it('succès : renvoie la tâche supprimée par le repository', async () => {
    const tacheSupprimee = { id: 7, projet_id: 1 };
    (getTacheByIdRepository as jest.Mock).mockResolvedValue(tacheSupprimee);
    (deleteTacheRepository as jest.Mock).mockResolvedValue(tacheSupprimee);

    const resultat = await deleteTacheService(7, 1);

    expect(exigerRole).toHaveBeenCalledWith(1, 10, ['admin', 'benevole']);
    expect(deleteTacheRepository).toHaveBeenCalledWith(7);
    expect(resultat).toBe(tacheSupprimee);
  });

  it('erreur : renvoie null si le repository ne trouve rien à supprimer', async () => {
    (getTacheByIdRepository as jest.Mock).mockResolvedValue(null);

    const resultat = await deleteTacheService(999, 1);

    expect(resultat).toBeNull();
  });
});
