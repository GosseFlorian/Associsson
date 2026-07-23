import { pool } from "../src/config/client";
import {
  getUtilisateursRepository,
  getUtilisateurIdRepository,
  postUtilisateurRepository,
  putUtilisateurRepository,
  deleteUtilisateurRepository,
} from "../src/repositories/utilisateur.repository";

// On mock le module config/client entier : pool.query devient une fausse
// fonction. Le repository ne se connecte jamais à une vraie base de données.
jest.mock("../src/config/client", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("getUtilisateursRepository", () => {
  it("succès : renvoie result.rows", async () => {
    // Ce test vérifie que le repository renvoie bien les lignes (rows)
    // du résultat SQL, sans les transformer.

    // Arrange
    const lignes = [{ id: 1, nom: "Jean", email: "jean@test.fr" }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: lignes });

    // Act
    const resultat = await getUtilisateursRepository();

    // Assert
    expect(resultat).toBe(lignes);
  });

  it("erreur : propage l'erreur si la requête plante", async () => {
    // Ce test vérifie que si pool.query échoue (ex: connexion refusée),
    // l'erreur remonte bien jusqu'à l'appelant du repository.

    // Arrange
    (pool.query as jest.Mock).mockRejectedValue(new Error("connexion refusée"));

    // Act
    const fn = () => getUtilisateursRepository();

    // Assert
    await expect(fn()).rejects.toThrow("connexion refusée");
  });
});

describe("getUtilisateurIdRepository", () => {
  it("succès : renvoie la ligne trouvée avec le bon id en paramètre", async () => {
    // Ce test vérifie que l'id est bien transmis en paramètre SQL ($1)
    // et que la première ligne du résultat est renvoyée.

    // Arrange
    const ligne = { id: 5, nom: "Jean", email: "jean@test.fr" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligne] });

    // Act
    const resultat = await getUtilisateurIdRepository(5);

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
    const resultat = await getUtilisateurIdRepository(999);

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("postUtilisateurRepository", () => {
  it("succès : renvoie la ligne créée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne créée
    // par la requête INSERT ... RETURNING *.

    // Arrange
    const ligneCreee = { id: 2, nom: "Marie", email: "marie@test.fr" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneCreee] });

    // Act
    const resultat = await postUtilisateurRepository({
      nom: "Marie",
      email: "marie@test.fr",
      mot_de_passe: "secret123",
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
    const fn = () => postUtilisateurRepository({} as any);

    // Assert
    await expect(fn()).rejects.toThrow(
      "Échec de la création de l'utilisateur en base de données",
    );
  });
});

describe("putUtilisateurRepository", () => {
  it("succès : renvoie la ligne mise à jour", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne modifiée
    // par la requête UPDATE ... RETURNING *.

    // Arrange
    const ligneModifiee = { id: 1, nom: "Jean Modifié", email: "jean@test.fr" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneModifiee] });

    // Act
    const resultat = await putUtilisateurRepository(1, { nom: "Jean Modifié" });

    // Assert
    expect(resultat).toBe(ligneModifiee);
  });

  it("erreur : renvoie null si aucune ligne trouvée pour l'id donné", async () => {
    // Ce test vérifie que si l'UPDATE ne retourne aucune ligne (id
    // inexistant), le repository renvoie null plutôt qu'une erreur.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const resultat = await putUtilisateurRepository(999, { nom: "X" });

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("deleteUtilisateurRepository", () => {
  it("succès : renvoie la ligne supprimée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne supprimée
    // par la requête DELETE ... RETURNING *.

    // Arrange
    const ligneSupprimee = { id: 4, nom: "Jean" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneSupprimee] });

    // Act
    const resultat = await deleteUtilisateurRepository(4);

    // Assert
    expect(resultat).toBe(ligneSupprimee);
  });

  it("erreur : renvoie null si rien n'a été supprimé", async () => {
    // Ce test vérifie que si aucun utilisateur ne correspond à l'id (rien
    // supprimé), le repository renvoie null plutôt qu'une erreur.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const resultat = await deleteUtilisateurRepository(999);

    // Assert
    expect(resultat).toBeNull();
  });
});
