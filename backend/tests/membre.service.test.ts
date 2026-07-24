import {
  getMembreService,
  getMembreParIdService,
  putMembreService,
  postMembreService,
  deleteMembreService,
} from "../src/services/membre.service";
import {
  getMembresRepository,
  getMembreParIdRepository,
  putMembreRepository,
  postMembreRepository,
  deleteMembreRepository,
} from "../src/repositories/membre.repository";

// On mock le repository : le service ne doit pas toucher la vraie base de
// données pour être testé, on contrôle nous-mêmes ce que le repository renvoie.
jest.mock("../src/repositories/membre.repository");

// Avant chaque test, vide l'historique de tous les mocks pour garantir
// que chaque test démarre avec un état propre.
beforeEach(() => {
  jest.clearAllMocks();
});

describe("getMembreService", () => {
  it("succès : renvoie la liste renvoyée par le repository", async () => {
    // Ce test vérifie que le service transmet simplement (sans la modifier)
    // la liste que lui renvoie le repository.

    // Arrange
    const membres = [{ role: "membre" }];
    (getMembresRepository as jest.Mock).mockResolvedValue(membres);

    // Act
    const resultat = await getMembreService();

    // Assert
    expect(resultat).toBe(membres);
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    // Ce test vérifie que si le repository échoue, l'erreur remonte bien
    // jusqu'à l'appelant du service (elle n'est pas avalée en silence).

    // Arrange
    (getMembresRepository as jest.Mock).mockRejectedValue(new Error("DB down"));

    // Act
    const fn = () => getMembreService();

    // Assert
    await expect(fn()).rejects.toThrow("DB down");
  });
});

describe("getMembreParIdService", () => {
  it("succès : renvoie le membre trouvé par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id au repository
    // et renvoie exactement ce que le repository a trouvé.

    // Arrange
    const membre = { id: 5, role: "membre" };
    (getMembreParIdRepository as jest.Mock).mockResolvedValue(membre);

    // Act
    const resultat = await getMembreParIdService(5);

    // Assert
    expect(getMembreParIdRepository).toHaveBeenCalledWith(5);
    expect(resultat).toBe(membre);
  });

  it("erreur : renvoie null si le repository ne trouve rien", async () => {
    // Ce test vérifie que le service ne transforme pas un "rien trouvé"
    // en erreur : il renvoie simplement null, comme le repository.

    // Arrange
    (getMembreParIdRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await getMembreParIdService(999);

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("postMembreService", () => {
  it("succès : renvoie le membre créé par le repository quand le rôle est valide", async () => {
    // Ce test vérifie que le service transmet bien les données reçues au
    // repository, et renvoie le membre nouvellement créé.

    // Arrange
    const data = { utilisateur_id: 1, organisation_id: 2, role: "membre" };
    const membreCree = { id: 10, ...data };
    (postMembreRepository as jest.Mock).mockResolvedValue(membreCree);

    // Act
    const resultat = await postMembreService(data as any);

    // Assert
    expect(postMembreRepository).toHaveBeenCalledWith(data);
    expect(resultat).toBe(membreCree);
  });

  it("erreur : lève une erreur si le rôle est vide", async () => {
    // Ce test vérifie la validation métier du service : un rôle vide
    // (uniquement des espaces) doit être rejeté AVANT tout appel au repository.

    // Arrange
    const data = { utilisateur_id: 1, organisation_id: 2, role: "   " };

    // Act
    const fn = () => postMembreService(data as any);

    // Assert
    await expect(fn()).rejects.toThrow("Le role du membre est obligatoire");
    expect(postMembreRepository).not.toHaveBeenCalled();
  });

  it("erreur : lève une erreur si le rôle est manquant", async () => {
    // Ce test vérifie que l'absence totale de rôle est bien détectée
    // par la validation du service.

    // Arrange
    const data = { utilisateur_id: 1, organisation_id: 2 };

    // Act
    const fn = () => postMembreService(data as any);

    // Assert
    await expect(fn()).rejects.toThrow("Le role du membre est obligatoire");
    expect(postMembreRepository).not.toHaveBeenCalled();
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    // Ce test vérifie que si l'insertion échoue côté repository (ex: aucune
    // ligne retournée), l'erreur remonte bien jusqu'à l'appelant du service.

    // Arrange
    (postMembreRepository as jest.Mock).mockRejectedValue(
      new Error("Échec de la création du membre"),
    );

    // Act
    const fn = () => postMembreService({ role: "membre" } as any);

    // Assert
    await expect(fn()).rejects.toThrow("Échec de la création du membre");
  });
});

describe("putMembreService", () => {
  it("succès : renvoie le membre modifié par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id ET les nouvelles
    // données au repository, et renvoie le résultat de la modification.

    // Arrange
    const membreModifie = { id: 1, role: "admin" };
    (putMembreRepository as jest.Mock).mockResolvedValue(membreModifie);

    // Act
    const resultat = await putMembreService(1, { role: "admin" });

    // Assert
    expect(putMembreRepository).toHaveBeenCalledWith(1, { role: "admin" });
    expect(resultat).toBe(membreModifie);
  });

  it("erreur : renvoie null si le repository ne trouve rien à modifier", async () => {
    // Ce test vérifie le comportement réel actuel du service : il ne
    // transforme pas un "rien trouvé" en erreur, il renvoie null,
    // comme le repository.

    // Arrange
    (putMembreRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await putMembreService(999, { role: "admin" });

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("deleteMembreService", () => {
  it("succès : renvoie le membre supprimé par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id au repository
    // et renvoie exactement ce que le repository a supprimé.

    // Arrange
    const membreSupprime = { id: 7 };
    (deleteMembreRepository as jest.Mock).mockResolvedValue(membreSupprime);

    // Act
    const resultat = await deleteMembreService(7);

    // Assert
    expect(deleteMembreRepository).toHaveBeenCalledWith(7);
    expect(resultat).toBe(membreSupprime);
  });

  it("erreur : renvoie null si le repository ne trouve rien à supprimer", async () => {
    // Ce test vérifie que le service ne transforme pas un "rien supprimé"
    // en erreur : il renvoie simplement null, comme le repository.

    // Arrange
    (deleteMembreRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await deleteMembreService(999);

    // Assert
    expect(resultat).toBeNull();
  });
});
