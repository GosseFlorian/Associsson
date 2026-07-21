import {
  getTachesService,
  getTacheIdService,
  postTacheService,
  putTacheService,
  deleteTacheService,
} from "../src/services/tache.service";
import {
  getTachesRepository,
  getTacheByIdRepository,
  postTacheRepository,
  putTacheRepository,
  deleteTacheRepository,
} from "../src/repositories/tache.repository";

// On mock le repository : le service ne doit pas toucher la vraie base de
// données pour être testé, on contrôle nous-mêmes ce que le repository renvoie.
jest.mock("../src/repositories/tache.repository");

// Avant chaque test, vide l'historique de tous les mocks pour garantir
// que chaque test démarre avec un état propre.
beforeEach(() => {
  jest.clearAllMocks();
});

describe("getTachesService", () => {
  it("succès : renvoie la liste renvoyée par le repository", async () => {
    // Ce test vérifie que le service transmet simplement (sans la modifier)
    // la liste que lui renvoie le repository.

    // Arrange
    const taches = [{ id: 1, titre: "Tâche 1", statut: "a_faire" }];
    (getTachesRepository as jest.Mock).mockResolvedValue(taches);

    // Act
    const resultat = await getTachesService();

    // Assert
    expect(resultat).toBe(taches);
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    // Ce test vérifie que si le repository échoue, l'erreur remonte bien
    // jusqu'à l'appelant du service (elle n'est pas avalée en silence).

    // Arrange
    (getTachesRepository as jest.Mock).mockRejectedValue(new Error("DB down"));

    // Act
    const fn = () => getTachesService();

    // Assert
    await expect(fn()).rejects.toThrow("DB down");
  });
});

describe("getTacheIdService", () => {
  it("succès : renvoie la tâche trouvée par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id au repository
    // et renvoie exactement ce que le repository a trouvé.

    // Arrange
    const tache = { id: 5, titre: "Tâche 5", statut: "en_cours" };
    (getTacheByIdRepository as jest.Mock).mockResolvedValue(tache);

    // Act
    const resultat = await getTacheIdService(5);

    // Assert
    expect(getTacheByIdRepository).toHaveBeenCalledWith(5);
    expect(resultat).toBe(tache);
  });

  it("erreur : renvoie null si le repository ne trouve rien", async () => {
    // Ce test vérifie que le service ne transforme pas un "rien trouvé"
    // en erreur : il renvoie simplement null, comme le repository.

    // Arrange
    (getTacheByIdRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await getTacheIdService(999);

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("postTacheService", () => {
  it("succès : renvoie la tâche créée par le repository quand le titre est valide", async () => {
    // Ce test vérifie que le service transmet bien les données reçues au
    // repository, et renvoie la tâche nouvellement créée.

    // Arrange
    const data = {
      titre: "Nouvelle tâche",
      statut: "a_faire",
      priorite: "moyenne",
      projet_id: 1,
    };
    const tacheCreee = { id: 10, ...data };
    (postTacheRepository as jest.Mock).mockResolvedValue(tacheCreee);

    // Act
    const resultat = await postTacheService(data as any);

    // Assert
    expect(postTacheRepository).toHaveBeenCalledWith(data);
    expect(resultat).toBe(tacheCreee);
  });

  it("erreur : lève une erreur si le titre est vide", async () => {
    // Ce test vérifie la validation métier du service : un titre vide
    // (uniquement des espaces) doit être rejeté AVANT tout appel au repository.

    // Arrange
    const data = {
      titre: "   ",
      statut: "a_faire",
      priorite: "moyenne",
      projet_id: 1,
    };

    // Act
    const fn = () => postTacheService(data as any);

    // Assert
    await expect(fn()).rejects.toThrow("Le titre de la tâche est obligatoire");
    expect(postTacheRepository).not.toHaveBeenCalled();
  });

  it("erreur : lève une erreur si le titre est manquant", async () => {
    // Ce test vérifie que l'absence totale de titre est bien détectée
    // par la validation du service.

    // Arrange
    const data = { statut: "a_faire", priorite: "moyenne", projet_id: 1 };

    // Act
    const fn = () => postTacheService(data as any);

    // Assert
    await expect(fn()).rejects.toThrow("Le titre de la tâche est obligatoire");
  });
});

describe("putTacheService", () => {
  it("succès : renvoie la tâche modifiée par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id ET les nouvelles
    // données au repository, et renvoie le résultat de la modification.

    // Arrange
    const tacheModifiee = { id: 1, titre: "Tâche modifiée", statut: "termine" };
    (putTacheRepository as jest.Mock).mockResolvedValue(tacheModifiee);

    // Act
    const resultat = await putTacheService(1, { statut: "termine" });

    // Assert
    expect(putTacheRepository).toHaveBeenCalledWith(1, { statut: "termine" });
    expect(resultat).toBe(tacheModifiee);
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    // Ce test vérifie que l'erreur levée par le repository remonte bien
    // jusqu'à l'appelant du service.

    // Arrange
    (putTacheRepository as jest.Mock).mockRejectedValue(
      new Error("Echec de la modification"),
    );

    // Act
    const fn = () => putTacheService(1, {});

    // Assert
    await expect(fn()).rejects.toThrow("Echec de la modification");
  });
});

describe("deleteTacheService", () => {
  it("succès : renvoie la tâche supprimée par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id au repository
    // et renvoie exactement ce que le repository a supprimé.

    // Arrange
    const tacheSupprimee = { id: 7 };
    (deleteTacheRepository as jest.Mock).mockResolvedValue(tacheSupprimee);

    // Act
    const resultat = await deleteTacheService(7);

    // Assert
    expect(deleteTacheRepository).toHaveBeenCalledWith(7);
    expect(resultat).toBe(tacheSupprimee);
  });

  it("erreur : renvoie null si le repository ne trouve rien à supprimer", async () => {
    // Ce test vérifie que le service ne transforme pas un "rien supprimé"
    // en erreur : il renvoie simplement null, comme le repository.

    // Arrange
    (deleteTacheRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await deleteTacheService(999);

    // Assert
    expect(resultat).toBeNull();
  });
});
