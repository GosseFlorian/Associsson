import { pool } from "../src/config/client";
import {
  postProjetRepository,
  getProjetsRepository,
  getProjetByIdRepository,
  putProjetRepository,
  deleteProjetRepository,
} from "../src/repositories/projet.repository";
import { Projet } from "../src/types";

// On mock le module config/client entier : pool.query devient une fausse
// fonction. Le repository ne se connecte jamais à une vraie base de données.
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

// Avant chaque test, vide l'historique de tous les mocks pour garantir
// que chaque test démarre avec un état propre.
beforeEach(() => {
  jest.clearAllMocks();
});

describe("postProjetRepository", () => {
  it("succès : insère un projet et renvoie la ligne créée", async () => {
    // Ce test vérifie que le repository transmet bien les valeurs dans
    // l'ordre attendu par la requête INSERT, et renvoie la ligne créée.

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [fakeProjet] });

    // Act
    const resultat = await postProjetRepository(fakeProjet);

    // Assert
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
    expect(resultat).toBe(fakeProjet);
  });

  it("erreur : lève une erreur explicite si aucune ligne n'est retournée", async () => {
    // Ce test vérifie que si l'INSERT ne retourne aucune ligne (cas
    // anormal), le repository lève une erreur explicite plutôt que de
    // renvoyer undefined silencieusement.

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [] });

    // Act
    const fn = () => postProjetRepository(fakeProjet);

    // Assert
    await expect(fn()).rejects.toThrow("Échec de la création de Projet");
  });
});

describe("getProjetsRepository", () => {
  it("succès : renvoie la liste des projets", async () => {
    // Ce test vérifie que le repository renvoie bien les lignes (rows)
    // du résultat SQL, sans les transformer.

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [fakeProjet] });

    // Act
    const resultat = await getProjetsRepository();

    // Assert
    expect(mockedPool.query).toHaveBeenCalledTimes(1);
    expect(mockedPool.query.mock.calls[0][0]).toContain("SELECT");
    expect(resultat).toEqual([fakeProjet]);
  });

  it("succès : renvoie un tableau vide si aucun projet", async () => {
    // Ce test vérifie que l'absence de résultats se traduit par un
    // tableau vide, pas par une erreur.

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [] });

    // Act
    const resultat = await getProjetsRepository();

    // Assert
    expect(resultat).toEqual([]);
  });

  it("erreur : propage l'erreur si la requête plante", async () => {
    // Ce test vérifie que si pool.query échoue (ex: connexion refusée),
    // l'erreur remonte bien jusqu'à l'appelant du repository.

    // Arrange
    mockedPool.query.mockRejectedValue(new Error("connexion refusée"));

    // Act
    const fn = () => getProjetsRepository();

    // Assert
    await expect(fn()).rejects.toThrow("connexion refusée");
  });
});

describe("getProjetByIdRepository", () => {
  it("succès : renvoie le projet correspondant à l'id", async () => {
    // Ce test vérifie que l'id est bien transmis en paramètre SQL ($1)
    // et que la première ligne du résultat est renvoyée.

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [fakeProjet] });

    // Act
    const resultat = await getProjetByIdRepository(1);

    // Assert
    expect(mockedPool.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE p.id = $1"),
      [1],
    );
    expect(resultat).toEqual(fakeProjet);
  });

  it("erreur : renvoie null si le projet n'existe pas", async () => {
    // Ce test vérifie que si la requête ne renvoie aucune ligne (id
    // inexistant), le repository renvoie null plutôt qu'une erreur.
    // Correspond au comportement réel : `return result.rows[0] || null;`

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [] });

    // Act
    const resultat = await getProjetByIdRepository(999);

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("putProjetRepository", () => {
  it("succès : met à jour un projet et renvoie la ligne modifiée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne modifiée
    // et transmet l'id en dernier paramètre de la requête UPDATE.

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [fakeProjet] });

    // Act
    const resultat = await putProjetRepository(1, fakeProjet);

    // Assert
    expect(mockedPool.query).toHaveBeenCalledTimes(1);
    const [query, values] = mockedPool.query.mock.calls[0];
    expect(query).toContain("UPDATE projet");
    expect(values[values.length - 1]).toBe(1); // id en dernier paramètre
    expect(resultat).toEqual(fakeProjet);
  });

  it("erreur : renvoie null si le projet à modifier n'existe pas", async () => {
    // Ce test vérifie le comportement réel actuel du repository : si
    // l'UPDATE ne retourne aucune ligne (id inexistant), il renvoie null
    // (`return result.rows[0] || null;`), sans lever d'erreur.

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [] });

    // Act
    const resultat = await putProjetRepository(999, fakeProjet);

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("deleteProjetRepository", () => {
  it("succès : supprime un projet et renvoie la ligne supprimée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne supprimée
    // par la requête DELETE ... RETURNING.

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [fakeProjet] });

    // Act
    const resultat = await deleteProjetRepository(1);

    // Assert
    expect(mockedPool.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM projet"),
      [1],
    );
    expect(resultat).toEqual(fakeProjet);
  });

  it("erreur : renvoie null si le projet à supprimer n'existe pas", async () => {
    // Ce test vérifie que si aucun projet ne correspond à l'id (rien
    // supprimé), le repository renvoie null plutôt qu'une erreur.

    // Arrange
    mockedPool.query.mockResolvedValue({ rows: [] });

    // Act
    const resultat = await deleteProjetRepository(999);

    // Assert
    expect(resultat).toBeNull();
  });
});
