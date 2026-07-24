import {
  getOrganisationsService,
  getOrganisationIdService,
  postOrganisationService,
  putOrganisationService,
  deleteOrganisationService,
} from "../src/services/organisation.service";
import {
  getOrganisationsRepository,
  getOrganisationIdRepository,
  postOrganisationRepository,
  putOrganisationRepository,
  deleteOrganisationRepository,
} from "../src/repositories/organisation.repository";

// On mock le repository : le service ne doit pas toucher la vraie base de
// données pour être testé, on contrôle nous-mêmes ce que le repository renvoie.
jest.mock("../src/repositories/organisation.repository");

// Avant chaque test, vide l'historique de tous les mocks pour garantir
// que chaque test démarre avec un état propre.
beforeEach(() => {
  jest.clearAllMocks();
});

describe("getOrganisationsService", () => {
  it("succès : renvoie la liste renvoyée par le repository", async () => {
    // Ce test vérifie que le service transmet simplement (sans la modifier)
    // la liste que lui renvoie le repository.

    // Arrange
    const organisations = [
      { id: 1, nom: "OpenAI" },
      { id: 2, nom: "Google" },
    ];
    (getOrganisationsRepository as jest.Mock).mockResolvedValue(organisations);

    // Act
    const resultat = await getOrganisationsService();

    // Assert
    expect(getOrganisationsRepository).toHaveBeenCalled();
    expect(resultat).toBe(organisations);
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    // Ce test vérifie que si le repository échoue, l'erreur remonte bien
    // jusqu'à l'appelant du service (elle n'est pas avalée en silence).

    // Arrange
    (getOrganisationsRepository as jest.Mock).mockRejectedValue(
      new Error("DB down"),
    );

    // Act
    const fn = () => getOrganisationsService();

    // Assert
    await expect(fn()).rejects.toThrow("DB down");
  });
});

describe("getOrganisationIdService", () => {
  it("succès : renvoie l'organisation trouvée par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id au repository
    // et renvoie exactement ce que le repository a trouvé.

    // Arrange
    const organisation = { id: 1, nom: "OpenAI" };
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(organisation);

    // Act
    const resultat = await getOrganisationIdService(1);

    // Assert
    expect(getOrganisationIdRepository).toHaveBeenCalledWith(1);
    expect(resultat).toBe(organisation);
  });

  it("erreur : renvoie null si le repository ne trouve rien", async () => {
    // Ce test vérifie que le service ne transforme pas un "rien trouvé"
    // en erreur : il renvoie simplement null, comme le repository.

    // Arrange
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await getOrganisationIdService(999);

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("postOrganisationService", () => {
  it("succès : renvoie l'organisation créée quand le nom est valide", async () => {
    // Ce test vérifie que le service transmet bien les données reçues au
    // repository, et renvoie l'organisation nouvellement créée.

    // Arrange
    const data = { nom: "OpenAI", est_actif: true, proprietaire_id: 1 };
    const organisationCreee = { id: 1, ...data };
    (postOrganisationRepository as jest.Mock).mockResolvedValue(
      organisationCreee,
    );

    // Act
    const resultat = await postOrganisationService(data as any);

    // Assert
    expect(postOrganisationRepository).toHaveBeenCalledWith(data);
    expect(resultat).toBe(organisationCreee);
  });

  it("erreur : lève une erreur si le nom est vide", async () => {
    // Ce test vérifie la validation métier du service : un nom vide
    // (uniquement des espaces) doit être rejeté AVANT tout appel au repository.

    // Arrange
    const data = { nom: "   ", est_actif: true, proprietaire_id: 1 };

    // Act
    const fn = () => postOrganisationService(data as any);

    // Assert
    await expect(fn()).rejects.toThrow(
      "Le nom de l'organisation est obligatoire",
    );
    expect(postOrganisationRepository).not.toHaveBeenCalled();
  });

  it("erreur : lève une erreur si le nom est manquant", async () => {
    // Ce test vérifie que l'absence totale de nom est bien détectée
    // par la validation du service.

    // Arrange
    const data = { est_actif: true, proprietaire_id: 1 };

    // Act
    const fn = () => postOrganisationService(data as any);

    // Assert
    await expect(fn()).rejects.toThrow(
      "Le nom de l'organisation est obligatoire",
    );
    expect(postOrganisationRepository).not.toHaveBeenCalled();
  });
});

describe("putOrganisationService", () => {
  it("succès : renvoie l'organisation modifiée par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id ET les nouvelles
    // données au repository, et renvoie le résultat de la modification.

    // Arrange
    const organisationModifiee = { id: 1, nom: "Nouvelle organisation" };
    (putOrganisationRepository as jest.Mock).mockResolvedValue(
      organisationModifiee,
    );

    // Act
    const resultat = await putOrganisationService(1, {
      nom: "Nouvelle organisation",
    });

    // Assert
    expect(putOrganisationRepository).toHaveBeenCalledWith(1, {
      nom: "Nouvelle organisation",
    });
    expect(resultat).toBe(organisationModifiee);
  });

  it("erreur : renvoie null si le repository ne trouve rien à modifier", async () => {
    // Ce test vérifie que le service ne transforme pas un "rien trouvé"
    // en erreur : il renvoie simplement null, comme le repository.

    // Arrange
    (putOrganisationRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await putOrganisationService(999, { nom: "Test" });

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("deleteOrganisationService", () => {
  it("succès : renvoie l'organisation supprimée par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id au repository
    // et renvoie exactement ce que le repository a supprimé.

    // Arrange
    const organisationSupprimee = { id: 1, nom: "OpenAI" };
    (deleteOrganisationRepository as jest.Mock).mockResolvedValue(
      organisationSupprimee,
    );

    // Act
    const resultat = await deleteOrganisationService(1);

    // Assert
    expect(deleteOrganisationRepository).toHaveBeenCalledWith(1);
    expect(resultat).toBe(organisationSupprimee);
  });

  it("erreur : renvoie null si le repository ne trouve rien à supprimer", async () => {
    // Ce test vérifie que le service ne transforme pas un "rien supprimé"
    // en erreur : il renvoie simplement null, comme le repository.

    // Arrange
    (deleteOrganisationRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await deleteOrganisationService(999);

    // Assert
    expect(resultat).toBeNull();
  });
});
