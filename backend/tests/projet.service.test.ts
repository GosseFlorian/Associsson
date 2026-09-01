import {
  getProjetsService,
  getProjetByIdService,
  postProjetService,
  putProjetService,
  deleteProjetService,
} from '../src/services/projet.service';
import {
  getProjetsRepository,
  getProjetByIdRepository,
  postProjetRepository,
  putProjetRepository,
  deleteProjetRepository,
} from '../src/repositories/projet.repository';
import { Projet } from '../src/types/types';
import { exigerMembre, exigerRole } from '../src/services/autorisation.service';
import { AccesRefuseError } from '../src/lib/errors';

jest.mock('../src/repositories/projet.repository');
jest.mock('../src/services/autorisation.service');

const fakeProjet: Projet = {
  id: 1,
  organisation_id: 10,
  createur_id: 5,
  titre: 'Projet Test',
  description: 'Description test',
  date_debut: '2026-01-01',
  date_fin: '2026-12-31',
  adresse: '1 rue du Test',
  est_termine: false,
} as Projet;

const membreAdmin = {
  id: 5,
  role: 'admin' as const,
  organisation_id: 10,
  utilisateur_id: 1,
};

beforeEach(() => {
  jest.clearAllMocks();
  (exigerMembre as jest.Mock).mockResolvedValue(membreAdmin);
  (exigerRole as jest.Mock).mockResolvedValue(membreAdmin);
});

describe('projet.service', () => {
  it('getProjetsService délègue au repository et retourne son résultat', async () => {
    (getProjetsRepository as jest.Mock).mockResolvedValueOnce([fakeProjet]);

    const result = await getProjetsService(1);

    expect(getProjetsRepository).toHaveBeenCalledWith(1);
    expect(result).toEqual([fakeProjet]);
  });

  it("getProjetsService propage l'erreur si le repository plante", async () => {
    (getProjetsRepository as jest.Mock).mockRejectedValueOnce(
      new Error('DB down')
    );

    await expect(getProjetsService(1)).rejects.toThrow('DB down');
  });

  it('getProjetByIdService délègue au repository avec le bon id', async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await getProjetByIdService(1, 1);

    expect(getProjetByIdRepository).toHaveBeenCalledWith(1);
    expect(exigerMembre).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(fakeProjet);
  });

  it('getProjetByIdService retourne null si le repository ne trouve rien', async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(null);

    const result = await getProjetByIdService(999, 1);

    expect(result).toBeNull();
    expect(exigerMembre).not.toHaveBeenCalled();
  });

  it("getProjetByIdService refuse l'accès hors organisation (IDOR)", async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);
    (exigerMembre as jest.Mock).mockRejectedValueOnce(new AccesRefuseError());

    await expect(getProjetByIdService(1, 99)).rejects.toThrow(AccesRefuseError);
  });

  it('postProjetService impose le createur_id du membre authentifié', async () => {
    (postProjetRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await postProjetService(
      { ...fakeProjet, createur_id: 999 },
      1
    );

    expect(exigerRole).toHaveBeenCalledWith(1, 10, ['admin']);
    expect(postProjetRepository).toHaveBeenCalledWith({
      ...fakeProjet,
      createur_id: 5,
    });
    expect(result).toEqual(fakeProjet);
  });

  it('postProjetService lève une erreur si le titre est vide', async () => {
    const data = { ...fakeProjet, titre: '   ' };

    await expect(postProjetService(data, 1)).rejects.toThrow(
      'Le titre du projet est obligatoire'
    );
    expect(postProjetRepository).not.toHaveBeenCalled();
  });

  it('postProjetService lève une erreur si le titre est manquant', async () => {
    const { titre, ...data } = fakeProjet;

    await expect(postProjetService(data as Projet, 1)).rejects.toThrow(
      'Le titre du projet est obligatoire'
    );
    expect(postProjetRepository).not.toHaveBeenCalled();
  });

  it('putProjetService empêche de changer organisation_id', async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);
    (putProjetRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await putProjetService(
      1,
      { ...fakeProjet, organisation_id: 99 },
      1
    );

    expect(exigerRole).toHaveBeenCalledWith(1, 10, ['admin']);
    expect(putProjetRepository).toHaveBeenCalledWith(1, {
      ...fakeProjet,
      organisation_id: 10,
    });
    expect(result).toEqual(fakeProjet);
  });

  it("putProjetService retourne null si le projet n'existe pas", async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(null);

    const result = await putProjetService(999, fakeProjet, 1);

    expect(result).toBeNull();
  });

  it("propage l'erreur si le repository échoue (ex: putProjetService)", async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);
    (putProjetRepository as jest.Mock).mockRejectedValueOnce(
      new Error('Projet non trouvé')
    );

    await expect(putProjetService(999, fakeProjet, 1)).rejects.toThrow(
      'Projet non trouvé'
    );
  });

  it('deleteProjetService délègue au repository avec le bon id', async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);
    (deleteProjetRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await deleteProjetService(1, 1);

    expect(exigerRole).toHaveBeenCalledWith(1, 10, ['admin']);
    expect(deleteProjetRepository).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeProjet);
  });

  it('deleteProjetService retourne null si le repository ne trouve rien à supprimer', async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(null);

    const result = await deleteProjetService(999, 1);

    expect(result).toBeNull();
  });
});
