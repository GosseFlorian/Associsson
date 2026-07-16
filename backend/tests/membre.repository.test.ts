import { pool } from "../src/config/client";
import {
  getMembresRepository,
  getMembreParIdRepository,
  putMembreRepository,
  postMembreRepository,
  deleteMembreRepository,
} from "../src/repositories/membre.repository";

// On mock le module config/client entier : pool.query devient une fausse
// fonction. Le repository ne se connecte jamais à une vraie base de données.
jest.mock("../src/config/client", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("getMembresRepository", () => {
  it("succès : renvoie result.rows", async () => {
    // Ce test vérifie que le repository renvoie bien les lignes (rows)
    // du résultat SQL, sans les transformer.

    // Arrange
    const lignes = [
      { nomUtilisateur: "Jean", nomOrganisation: "ACME", role: "membre" },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: lignes });

    // Act
    const resultat = await getMembresRepository();

    // Assert
    expect(resultat).toBe(lignes);
  });

  it("erreur : propage l'erreur si la requête plante", async () => {
    // Ce test vérifie que si pool.query échoue (ex: connexion refusée),
    // l'erreur remonte bien jusqu'à l'appelant du repository.

    // Arrange
    (pool.query as jest.Mock).mockRejectedValue(new Error("connexion refusée"));

    // Act
    const fn = () => getMembresRepository();

    // Assert
    await expect(fn()).rejects.toThrow("connexion refusée");
  });
});

describe("getMembreParIdRepository", () => {
  it("succès : renvoie la ligne trouvée avec le bon id en paramètre", async () => {
    // Ce test vérifie que l'id est bien transmis en paramètre SQL ($1)
    // et que la première ligne du résultat est renvoyée.

    // Arrange
    const ligne = { nomUtilisateur: "Jean", role: "membre" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligne] });

    // Act
    const resultat = await getMembreParIdRepository(5);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [5]);
    expect(resultat).toBe(ligne);
  });

  it("erreur : renvoie undefined si aucune ligne trouvée", async () => {
    // Ce test vérifie que si la requête ne renvoie aucune ligne (id
    // inexistant), le repository renvoie undefined plutôt qu'une erreur.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const resultat = await getMembreParIdRepository(999);

    // Assert
    expect(resultat).toBeUndefined();
  });
});

describe("putMembreRepository", () => {
  it("succès : renvoie la ligne mise à jour", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne modifiée
    // par la requête UPDATE ... RETURNING *.

    // Arrange
    const ligneModifiee = { id: 1, role: "admin" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneModifiee] });

    // Act
    const resultat = await putMembreRepository(1, { role: "admin" });

    // Assert
    expect(resultat).toBe(ligneModifiee);
  });

  it("erreur : lève une erreur explicite si aucune ligne retournée", async () => {
    // Ce test vérifie le comportement volontaire du repository : si l'UPDATE
    // ne retourne aucune ligne (id inexistant), il lève une erreur explicite
    // au lieu de renvoyer silencieusement undefined.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const fn = () => putMembreRepository(1, {});

    // Assert
    await expect(fn()).rejects.toThrow("Echec de la modification");
  });
});

describe("postMembreRepository", () => {
  it("succès : renvoie la ligne créée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne créée
    // par la requête INSERT ... RETURNING *.

    // Arrange
    const ligneCreee = { id: 2, role: "licencie" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneCreee] });

    // Act
    const resultat = await postMembreRepository({
      utilisateur_id: 1,
      organisation_id: 2,
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
    const fn = () => postMembreRepository({} as any);

    // Assert
    await expect(fn()).rejects.toThrow("Échec de la création du membre");
  });
});

describe("deleteMembreRepository", () => {
  it("succès : renvoie la ligne supprimée", async () => {
    // Ce test vérifie que le repository renvoie bien la ligne supprimée
    // par la requête DELETE ... RETURNING *.

    // Arrange
    const ligneSupprimee = { id: 4 };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [ligneSupprimee] });

    // Act
    const resultat = await deleteMembreRepository(4);

    // Assert
    expect(resultat).toBe(ligneSupprimee);
  });

  it("erreur : renvoie undefined si rien n'a été supprimé", async () => {
    // Ce test vérifie que si aucun membre ne correspond à l'id (rien
    // supprimé), le repository renvoie undefined plutôt qu'une erreur.

    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const resultat = await deleteMembreRepository(999);

    // Assert
    expect(resultat).toBeUndefined();
  });
});
