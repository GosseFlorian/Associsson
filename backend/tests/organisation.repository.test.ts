import { pool } from "../src/config/client";
import {
  getOrganisationsRepository,
  getOrganisationIdRepository,
  postOrganisationRepository,
  putOrganisationRepository,
  deleteOrganisationRepository,
} from "../src/repositories/organisation.repository";

// On mock le module config/client entier : pool.query devient une fausse
// fonction. Le repository ne se connecte jamais à une vraie base de données.
jest.mock("../src/config/client", () => ({
  pool: {
    query: jest.fn(),
  },
}));

// Avant chaque test, vide l'historique de tous les mocks pour garantir
// que chaque test démarre avec un état propre.
beforeEach(() => {
  jest.clearAllMocks();
});

describe("getOrganisationsRepository", () => {
  it("succès : renvoie result.rows", async () => {
    // Ce test vérifie que le repository renvoie bien les lignes (rows)
    // du résultat SQL, sans les transformer.

    // Arrange
    const lignes = [
      {
        id: 1,
        nom: "OpenAI",
        date_creation: new Date(),
        est_actif: true,
        proprietaire_id: 1,
        nomProprietaire: "Jean",
      },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: lignes });

    // Act
    const resultat = await getOrganisationsRepository();

    // Assert
    expect(resultat).toBe(lignes);
  });

  it("erreur : propage l'erreur si la requête plante", async () => {
    // Ce test vérifie que si pool.query échoue (ex: connexion refusée),
    // l'erreur remonte bien jusqu'à l'appelant du repository.

    // Arrange
    (pool.query as jest.Mock).mockRejectedValue(new Error("connexion refusée"));

    // Act
    const fn = () => getOrganisationsRepository();

    // Assert
    await expect(fn()).rejects.toThrow("connexion refusée");
  });
});

describe("getOrganisationIdRepository", () => {
  it("succès : renvoie la ligne trouvée avec le bon id en paramètre", async () => {
    // Ce test vérifie que l'id est bien transmis en paramètre SQL ($1)
    // et que la première ligne du résultat est renvoyée.

    // Arrange
    const ligne = { id: 5, nom: "OpenAI", nomProprietaire: "Jean" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligne] });

    // Act
    const resultat = await getOrganisationIdRepository(5);

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
    const resultat = await getOrganisationIdRepository(999);

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("postOrganisationRepository", () => {
  it("succès : renvoie la ligne créée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne créée
    // par la requête INSERT ... RETURNING id, nom, est_actif, proprietaire_id.

    // Arrange
    const ligneCreee = {
      id: 2,
      nom: "OpenAI",
      est_actif: true,
      proprietaire_id: 1,
    };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneCreee] });

    // Act
    const resultat = await postOrganisationRepository({
      nom: "OpenAI",
      est_actif: true,
      proprietaire_id: 1,
    } as any);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
      "OpenAI",
      true,
      1,
    ]);
    expect(resultat).toBe(ligneCreee);
  });

  it("erreur : lève une erreur explicite si l'insertion ne renvoie rien", async () => {
    // Ce test vérifie que si l'INSERT ne retourne aucune ligne (cas
    // anormal), le repository lève une erreur explicite plutôt que de
    // renvoyer undefined silencieusement.
    // Le message exact dans le code source est "Echec de la création de
    // l'organisation" (sans accent sur "Echec").

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const fn = () => postOrganisationRepository({} as any);

    // Assert
    await expect(fn()).rejects.toThrow(
      "Echec de la création de l'organisation",
    );
  });
});

describe("putOrganisationRepository", () => {
  it("succès : renvoie la ligne mise à jour", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne modifiée
    // par la requête UPDATE ... RETURNING id, nom, est_actif, proprietaire_id.

    // Arrange
    const ligneModifiee = { id: 1, nom: "Nouveau nom" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneModifiee] });

    // Act
    const resultat = await putOrganisationRepository(1, { nom: "Nouveau nom" });

    // Assert
    expect(resultat).toBe(ligneModifiee);
  });

  it("erreur : renvoie null si aucune ligne trouvée pour l'id donné", async () => {
    // Ce test vérifie le comportement réel du repository : si l'UPDATE ne
    // retourne aucune ligne (id inexistant), il renvoie null
    // (`return result.rows[0] || null;`), sans lever d'erreur.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const resultat = await putOrganisationRepository(999, { nom: "Test" });

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("deleteOrganisationRepository", () => {
  it("succès : renvoie la ligne supprimée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne supprimée
    // par la requête DELETE ... RETURNING id, nom, est_actif, proprietaire_id.

    // Arrange
    const ligneSupprimee = { id: 1, nom: "OpenAI" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneSupprimee] });

    // Act
    const resultat = await deleteOrganisationRepository(1);

    // Assert
    expect(resultat).toBe(ligneSupprimee);
  });

  it("erreur : renvoie null si rien n'a été supprimé", async () => {
    // Ce test vérifie que si aucune organisation ne correspond à l'id
    // (rien supprimé), le repository renvoie null plutôt qu'une erreur.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const resultat = await deleteOrganisationRepository(999);

    // Assert
    expect(resultat).toBeNull();
  });
});
