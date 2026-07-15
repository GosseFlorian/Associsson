import { pool } from "../src/config/client";
import {
  postProjetRepository,
  getProjetsRepository,
  getProjetByIdRepository,
  putProjetRepository,
  deleteProjetRepository,
} from "../src/repositories/projet.repository";
import { Projet } from "../src/types";

// On mock entièrement le module de connexion à la base de données.
jest.mock("../src/config/client", () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockedPool = pool as unknown as { query: jest.Mock };

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

describe("projet.repository", () => {
  describe("postProjetRepository", () => {
    it("insère un projet et retourne la ligne créée", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [fakeProjet] });

      const result = await postProjetRepository(fakeProjet);

      expect(mockedPool.query).toHaveBeenCalledTimes(1);
      const [query, values] = mockedPool.query.mock.calls[0];
      expect(query).toContain("INSERT INTO projet");
      expect(values).toEqual([
        fakeProjet.organisation_id,
        fakeProjet.createur_id,
        fakeProjet.titre,
        fakeProjet.description,
        fakeProjet.date_debut,
        fakeProjet.date_fin,
        fakeProjet.adresse,
        fakeProjet.est_termine,
      ]);
      expect(result).toEqual(fakeProjet);
    });

    it("lève une erreur si aucune ligne n'est retournée", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [] });

      await expect(postProjetRepository(fakeProjet)).rejects.toThrow(
        "Échec de la création de Projet",
      );
    });
  });

  describe("getProjetsRepository", () => {
    it("retourne la liste des projets", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [fakeProjet] });

      const result = await getProjetsRepository();

      expect(mockedPool.query).toHaveBeenCalledTimes(1);
      expect(mockedPool.query.mock.calls[0][0]).toContain("SELECT");
      expect(result).toEqual([fakeProjet]);
    });

    it("retourne un tableau vide si aucun projet", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [] });

      const result = await getProjetsRepository();

      expect(result).toEqual([]);
    });
  });

  describe("getProjetByIdRepository", () => {
    it("retourne le projet correspondant à l'id", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [fakeProjet] });

      const result = await getProjetByIdRepository(1);

      expect(mockedPool.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE id = $1"),
        [1],
      );
      expect(result).toEqual(fakeProjet);
    });

    it("retourne undefined si le projet n'existe pas", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [] });

      const result = await getProjetByIdRepository(999);

      expect(result).toBeUndefined();
    });
  });

  describe("putProjetRepository", () => {
    it("met à jour un projet et retourne la ligne modifiée", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [fakeProjet] });

      const result = await putProjetRepository(1, fakeProjet);

      expect(mockedPool.query).toHaveBeenCalledTimes(1);
      const [query, values] = mockedPool.query.mock.calls[0];
      expect(query).toContain("UPDATE projet");
      expect(values[values.length - 1]).toBe(1); // id en dernier paramètre
      expect(result).toEqual(fakeProjet);
    });

    it("lève une erreur si le projet à modifier n'existe pas", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [] });

      await expect(putProjetRepository(999, fakeProjet)).rejects.toThrow(
        "Projet non trouvé",
      );
    });
  });

  describe("deleteProjetRepository", () => {
    it("supprime un projet et retourne la ligne supprimée", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [fakeProjet] });

      const result = await deleteProjetRepository(1);

      expect(mockedPool.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM projet"),
        [1],
      );
      expect(result).toEqual(fakeProjet);
    });

    it("lève une erreur si le projet à supprimer n'existe pas", async () => {
      mockedPool.query.mockResolvedValueOnce({ rows: [] });

      await expect(deleteProjetRepository(999)).rejects.toThrow(
        "Projet non trouvé",
      );
    });
  });
});
