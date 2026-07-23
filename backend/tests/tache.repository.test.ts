import { pool } from "../src/config/client";
import {
  getTachesRepository,
  getTacheByIdRepository,
  postTacheRepository,
  putTacheRepository,
  deleteTacheRepository,
} from "../src/repositories/tache.repository";

// On mock le module config/client entier : pool.query devient une fausse
// fonction. Le repository ne se connecte jamais à une vraie base de données.
jest.mock("../src/config/client", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("getTachesRepository", () => {
  it("succès : renvoie result.rows", async () => {
    // Ce test vérifie que le repository renvoie bien les lignes (rows)
    // du résultat SQL, sans les transformer.

    // Arrange
    const lignes = [
      { id: 1, titre: "Préparer réunion", statut: "a_faire", nomProjet: "Projet A" },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: lignes });

    // Act
    const resultat = await getTachesRepository();

    // Assert
    expect(resultat).toBe(lignes);
  });

  it("erreur : propage l'erreur si la requête plante", async () => {
    // Ce test vérifie que si pool.query échoue (ex: connexion refusée),
    // l'erreur remonte bien jusqu'à l'appelant du repository.

    // Arrange
    (pool.query as jest.Mock).mockRejectedValue(new Error("connexion refusée"));

    // Act
    const fn = () => getTachesRepository();

    // Assert
    await expect(fn()).rejects.toThrow("connexion refusée");
  });
});

describe("getTacheByIdRepository", () => {
  it("succès : renvoie la ligne trouvée avec le bon id en paramètre", async () => {
    // Ce test vérifie que l'id est bien transmis en paramètre SQL ($1)
    // et que la première ligne du résultat est renvoyée.

    // Arrange
    const ligne = { id: 5, titre: "Tâche 5", statut: "en_cours" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligne] });

    // Act
    const resultat = await getTacheByIdRepository(5);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [5]);
    expect(resultat).toBe(ligne);
  });

  it("erreur : renvoie null si aucune ligne trouvée", async () => {
    // Ce test vérifie que si la requête ne renvoie aucune ligne (id
    // inexistant), le repository renvoie null plutôt qu'une erreur.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const resultat = await getTacheByIdRepository(999);

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("postTacheRepository", () => {
  it("succès : renvoie la ligne créée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne créée
    // par la requête INSERT ... RETURNING *.

    // Arrange
    const ligneCreee = { id: 2, titre: "Nouvelle tâche", statut: "a_faire" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneCreee] });

    // Act
    const resultat = await postTacheRepository({
      titre: "Nouvelle tâche",
      statut: "a_faire",
      priorite: "moyenne",
      projet_id: 1,
    } as any);

    // Assert
    expect(resultat).toBe(ligneCreee);
  });

  it("erreur : lève une erreur explicite si l'insertion ne renvoie rien", async () => {
    // Ce test vérifie que si l'INSERT ne retourne aucune ligne (cas
    // anormal), le repository lève une erreur explicite plutôt que de
    // renvoyer undefined silencieusement.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const fn = () => postTacheRepository({} as any);

    // Assert
    await expect(fn()).rejects.toThrow("Échec de la création de la tâche");
  });
});

describe("putTacheRepository", () => {
  it("succès : renvoie la ligne mise à jour", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne modifiée
    // par la requête UPDATE ... RETURNING *.

    // Arrange
    const ligneModifiee = { id: 1, titre: "Tâche modifiée", statut: "termine" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneModifiee] });

    // Act
    const resultat = await putTacheRepository(1, { statut: "termine" });

    // Assert
    expect(resultat).toBe(ligneModifiee);
  });

  it("erreur : renvoie null si aucune ligne trouvée pour l'id donné", async () => {
    // Ce test vérifie que si l'UPDATE ne retourne aucune ligne (id
    // inexistant), le repository renvoie null plutôt qu'une erreur,
    // contrairement à membre.repository qui lève une erreur explicite.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const resultat = await putTacheRepository(999, { statut: "termine" });

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("deleteTacheRepository", () => {
  it("succès : renvoie la ligne supprimée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne supprimée
    // par la requête DELETE ... RETURNING *.

    // Arrange
    const ligneSupprimee = { id: 4, titre: "Tâche à supprimer" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneSupprimee] });

    // Act
    const resultat = await deleteTacheRepository(4);

    // Assert
    expect(resultat).toBe(ligneSupprimee);
  });

  it("erreur : renvoie null si rien n'a été supprimé", async () => {
    // Ce test vérifie que si aucune tâche ne correspond à l'id (rien
    // supprimé), le repository renvoie null plutôt qu'une erreur.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const resultat = await deleteTacheRepository(999);

    // Assert
    expect(resultat).toBeNull();
  });
});
