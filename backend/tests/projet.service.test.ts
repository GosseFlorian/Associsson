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

// Avant chaque test, vide l'historique de tous les mocks pour garantir
// que chaque test démarre avec un état propre.
beforeEach(() => {
  jest.clearAllMocks();
});

describe("projet.service", () => {
  it("getProjetsService délègue au repository et retourne son résultat", async () => {
    // Ce test vérifie que le service transmet simplement (sans la modifier)
    // la liste que lui renvoie le repository.

    (getProjetsRepository as jest.Mock).mockResolvedValueOnce([fakeProjet]);

    const result = await getProjetsService();

    expect(getProjetsRepository).toHaveBeenCalledTimes(1);
    expect(result).toEqual([fakeProjet]);
  });

  it("getProjetsService propage l'erreur si le repository plante", async () => {
    // Ce test vérifie que si le repository échoue, l'erreur remonte bien
    // jusqu'à l'appelant du service (elle n'est pas avalée en silence).

    (getProjetsRepository as jest.Mock).mockRejectedValueOnce(
      new Error("DB down"),
    );

    await expect(getProjetsService()).rejects.toThrow("DB down");
  });

  it("getProjetByIdService délègue au repository avec le bon id", async () => {
    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await getProjetByIdService(1);

    expect(getProjetByIdRepository).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeProjet);
  });

  it("getProjetByIdService retourne null si le repository ne trouve rien", async () => {
    // Corrigé : le repository renvoie null (pas undefined) quand aucune
    // ligne n'est trouvée (`return result.rows[0] || null;`).

    (getProjetByIdRepository as jest.Mock).mockResolvedValueOnce(null);

    const result = await getProjetByIdService(999);

    expect(result).toBeNull();
  });

  it("postProjetService délègue au repository quand le titre est valide", async () => {
    (postProjetRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await postProjetService(fakeProjet);

    expect(postProjetRepository).toHaveBeenCalledWith(fakeProjet);
    expect(result).toEqual(fakeProjet);
  });

  it("postProjetService lève une erreur si le titre est vide", async () => {
    // Ajouté : le service valide le titre avant d'appeler le repository
    // (`if (!data.titre || data.titre.trim() === "")`), ce qui n'était pas
    // testé jusqu'ici.

    const data = { ...fakeProjet, titre: "   " };

    await expect(postProjetService(data)).rejects.toThrow(
      "Le titre du projet est obligatoire",
    );
    expect(postProjetRepository).not.toHaveBeenCalled();
  });

  it("postProjetService lève une erreur si le titre est manquant", async () => {
    const { titre, ...data } = fakeProjet;

    await expect(postProjetService(data as Projet)).rejects.toThrow(
      "Le titre du projet est obligatoire",
    );
    expect(postProjetRepository).not.toHaveBeenCalled();
  });

  it("putProjetService délègue au repository avec id et données", async () => {
    (putProjetRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await putProjetService(1, fakeProjet);

    expect(putProjetRepository).toHaveBeenCalledWith(1, fakeProjet);
    expect(result).toEqual(fakeProjet);
  });

  it("putProjetService retourne null si le repository ne trouve rien à modifier", async () => {
    // Ajouté : couvre le cas où l'id à modifier n'existe pas.

    (putProjetRepository as jest.Mock).mockResolvedValueOnce(null);

    const result = await putProjetService(999, fakeProjet);

    expect(result).toBeNull();
  });

  it("propage l'erreur si le repository échoue (ex: putProjetService)", async () => {
    (putProjetRepository as jest.Mock).mockRejectedValueOnce(
      new Error("Projet non trouvé"),
    );

    await expect(putProjetService(999, fakeProjet)).rejects.toThrow(
      "Projet non trouvé",
    );
  });

  it("deleteProjetService délègue au repository avec le bon id", async () => {
    (deleteProjetRepository as jest.Mock).mockResolvedValueOnce(fakeProjet);

    const result = await deleteProjetService(1);

    expect(deleteProjetRepository).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeProjet);
  });

  it("deleteProjetService retourne null si le repository ne trouve rien à supprimer", async () => {
    // Ajouté : couvre le cas où l'id à supprimer n'existe pas.

    (deleteProjetRepository as jest.Mock).mockResolvedValueOnce(null);

    const result = await deleteProjetService(999);

    expect(result).toBeNull();
  });
});
