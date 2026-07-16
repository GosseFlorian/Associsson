import {
  getProjetsService,
  getProjetByIdService,
  postProjetService,
  putProjetService,
  deleteProjetService,
} from "../src/services/projet.service";
import {
  getProjetsRepository,
  getProjetByIdRepository,
  postProjetRepository,
  putProjetRepository,
  deleteProjetRepository,
} from "../src/repositories/projet.repository";
import { Projet } from "../src/types";

// Le service n'est qu'une fine couche au-dessus du repository :
// on mock donc entièrement le repository pour tester le service en isolation.
jest.mock("../src/repositories/projet.repository");

const fakeProjet: Projet = {
  id: 1,
  organisation_id: 10,
  createur_id: 5,
  titre: "Projet Test",
  description: "Description test",
  date_debut: "2026-01-01",
  date_fin: "2026-12-31",
  adresse: "1 rue du Test",
  est_termine: false,
} as Projet;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("projet.service", () => {
  it("getProjetsService délègue au repository et retourne son résultat", async () => {
    (getProjetsRepository as jest.Mock).mockResolvedValueOnce([fakeProjet]);

    const result = await getProjetsService();

    expect(getProjetsRepository).toHaveBeenCalledTimes(1);
    expect(result).toEqual([fakeProjet]);
  });

  it("getProjetByIdService délègue au repository avec le bon id", async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await getProjetByIdService(1);

    expect(getProjetByIdRepository).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeProjet);
  });

  it("getProjetByIdService retourne undefined si le repository ne trouve rien", async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await getProjetByIdService(999);

    expect(result).toBeUndefined();
  });

  it("postProjetService délègue au repository avec les bonnes données", async () => {
    (postProjetRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await postProjetService(fakeProjet);

    expect(postProjetRepository).toHaveBeenCalledWith(fakeProjet);
    expect(result).toEqual(fakeProjet);
  });

  it("putProjetService délègue au repository avec id et données", async () => {
    (putProjetRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await putProjetService(1, fakeProjet);

    expect(putProjetRepository).toHaveBeenCalledWith(1, fakeProjet);
    expect(result).toEqual(fakeProjet);
  });

  it("deleteProjetService délègue au repository avec le bon id", async () => {
    (deleteProjetRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await deleteProjetService(1);

    expect(deleteProjetRepository).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeProjet);
  });

  it("propage l'erreur si le repository échoue (ex: putProjetService)", async () => {
    (putProjetRepository as jest.Mock).mockRejectedValueOnce(
      new Error("Projet non trouvé"),
    );

    await expect(putProjetService(999, fakeProjet)).rejects.toThrow(
      "Projet non trouvé",
    );
  });
});
