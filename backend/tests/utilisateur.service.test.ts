import {
  getUtilisateursService,
  getUtilisateurIdService,
  postUtilisateurService,
  putUtilisateurService,
  deleteUtilisateurService,
} from "../src/services/utilisateur.service";
import {
  getUtilisateursRepository,
  getUtilisateurIdRepository,
  postUtilisateurRepository,
  putUtilisateurRepository,
  deleteUtilisateurRepository,
} from "../src/repositories/utilisateur.repository";

// On mock le repository : le service ne doit pas toucher la vraie base de
// données pour être testé, on contrôle nous-mêmes ce que le repository renvoie.
jest.mock("../src/repositories/utilisateur.repository");

// Avant chaque test, vide l'historique de tous les mocks pour garantir
// que chaque test démarre avec un état propre.
beforeEach(() => {
  jest.clearAllMocks();
});

describe("getUtilisateursService", () => {
  it("succès : renvoie la liste renvoyée par le repository", async () => {
    // Ce test vérifie que le service transmet simplement (sans la modifier)
    // la liste que lui renvoie le repository.

    // Arrange
    const utilisateurs = [{ id: 1, nom: "Jean", email: "jean@test.fr" }];
    (getUtilisateursRepository as jest.Mock).mockResolvedValue(utilisateurs);

    // Act
    const resultat = await getUtilisateursService();

    // Assert
    expect(resultat).toBe(utilisateurs);
  });

  it("erreur : propage l'erreur si le repository plante", async () => {
    // Ce test vérifie que si le repository échoue, l'erreur remonte bien
    // jusqu'à l'appelant du service (elle n'est pas avalée en silence).

    // Arrange
    (getUtilisateursRepository as jest.Mock).mockRejectedValue(
      new Error("DB down"),
    );

    // Act
    const fn = () => getUtilisateursService();

    // Assert
    await expect(fn()).rejects.toThrow("DB down");
  });
});

describe("getUtilisateurIdService", () => {
  it("succès : renvoie l'utilisateur trouvé par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id au repository
    // et renvoie exactement ce que le repository a trouvé.

    // Arrange
    const utilisateur = { id: 5, nom: "Jean", email: "jean@test.fr" };
    (getUtilisateurIdRepository as jest.Mock).mockResolvedValue(utilisateur);

    // Act
    const resultat = await getUtilisateurIdService(5);

    // Assert
    expect(getUtilisateurIdRepository).toHaveBeenCalledWith(5);
    expect(resultat).toBe(utilisateur);
  });

  it("erreur : renvoie null si le repository ne trouve rien", async () => {
    // Ce test vérifie que le service ne transforme pas un "rien trouvé"
    // en erreur : il renvoie simplement null, comme le repository.

    // Arrange
    (getUtilisateurIdRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await getUtilisateurIdService(999);

    // Assert
    expect(resultat).toBeNull();
  });
});

describe("postUtilisateurService", () => {
  it("succès : renvoie l'utilisateur créé quand email et mot de passe sont valides", async () => {
    // Ce test vérifie que le service transmet bien les données reçues au
    // repository, et renvoie l'utilisateur nouvellement créé.

    // Arrange
    const data = {
      nom: "Marie",
      email: "marie@test.fr",
      mot_de_passe: "secret123",
    };
    const utilisateurCree = { id: 10, ...data };
    (postUtilisateurRepository as jest.Mock).mockResolvedValue(utilisateurCree);

    // Act
    const resultat = await postUtilisateurService(data as any);

    // Assert
    expect(postUtilisateurRepository).toHaveBeenCalledWith(data);
    expect(resultat).toBe(utilisateurCree);
  });

  it("erreur : lève une erreur si l'email est mal formaté", async () => {
    // Ce test vérifie la validation métier du service : un email sans
    // '@' ou domaine doit être rejeté AVANT tout appel au repository.

    // Arrange
    const data = {
      nom: "Marie",
      email: "email-invalide",
      mot_de_passe: "secret123",
    };

    // Act
    const fn = () => postUtilisateurService(data as any);

    // Assert
    await expect(fn()).rejects.toThrow("Format de l'adresse email invalide.");
    expect(postUtilisateurRepository).not.toHaveBeenCalled();
  });

  it("erreur : lève une erreur si le mot de passe est trop court", async () => {
    // Ce test vérifie la validation métier du service : un mot de passe
    // de moins de 6 caractères doit être rejeté AVANT tout appel au repository.

    // Arrange
    const data = { nom: "Marie", email: "marie@test.fr", mot_de_passe: "abc" };

    // Act
    const fn = () => postUtilisateurService(data as any);

    // Assert
    await expect(fn()).rejects.toThrow(
      "Le mot de passe doit contenir au moins 6 caractères.",
    );
    expect(postUtilisateurRepository).not.toHaveBeenCalled();
  });

  it("erreur : lève une erreur si le mot de passe est manquant", async () => {
    // Ce test vérifie que l'absence totale de mot de passe est bien
    // détectée par la validation du service.

    // Arrange
    const data = { nom: "Marie", email: "marie@test.fr" };

    // Act
    const fn = () => postUtilisateurService(data as any);

    // Assert
    await expect(fn()).rejects.toThrow(
      "Le mot de passe doit contenir au moins 6 caractères.",
    );
  });
});

describe("putUtilisateurService", () => {
  it("succès : renvoie l'utilisateur modifié par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id ET les nouvelles
    // données au repository, et renvoie le résultat de la modification.

    // Arrange
    const utilisateurModifie = { id: 1, nom: "Jean Modifié" };
    (putUtilisateurRepository as jest.Mock).mockResolvedValue(
      utilisateurModifie,
    );

    // Act
    const resultat = await putUtilisateurService(1, { nom: "Jean Modifié" });

    // Assert
    expect(putUtilisateurRepository).toHaveBeenCalledWith(1, {
      nom: "Jean Modifié",
    });
    expect(resultat).toBe(utilisateurModifie);
  });

  it("erreur : lève une erreur si le nouvel email est mal formaté", async () => {
    // Ce test vérifie que la validation d'email s'applique aussi lors
    // d'une modification, et bloque l'appel au repository si invalide.

    // Arrange
    const data = { email: "pas-un-email" };

    // Act
    const fn = () => putUtilisateurService(1, data);

    // Assert
    await expect(fn()).rejects.toThrow("Format de l'adresse email invalide.");
    expect(putUtilisateurRepository).not.toHaveBeenCalled();
  });

  it("erreur : lève une erreur si le nouveau mot de passe est trop court", async () => {
    // Ce test vérifie que la validation de mot de passe s'applique aussi
    // lors d'une modification, et bloque l'appel au repository si invalide.

    // Arrange
    const data = { mot_de_passe: "123" };

    // Act
    const fn = () => putUtilisateurService(1, data);

    // Assert
    await expect(fn()).rejects.toThrow(
      "Le mot de passe doit contenir au moins 6 caractères.",
    );
    expect(putUtilisateurRepository).not.toHaveBeenCalled();
  });

  it("succès : ne valide pas l'email ou le mot de passe si non fournis", async () => {
    // Ce test vérifie qu'une modification partielle (ex: uniquement le nom)
    // ne déclenche pas les validations d'email/mot de passe.

    // Arrange
    const utilisateurModifie = { id: 1, nom: "Nouveau nom" };
    (putUtilisateurRepository as jest.Mock).mockResolvedValue(
      utilisateurModifie,
    );

    // Act
    const resultat = await putUtilisateurService(1, { nom: "Nouveau nom" });

    // Assert
    expect(resultat).toBe(utilisateurModifie);
  });
});

describe("deleteUtilisateurService", () => {
  it("succès : renvoie l'utilisateur supprimé par le repository", async () => {
    // Ce test vérifie que le service transmet bien l'id au repository
    // et renvoie exactement ce que le repository a supprimé.

    // Arrange
    const utilisateurSupprime = { id: 7 };
    (deleteUtilisateurRepository as jest.Mock).mockResolvedValue(
      utilisateurSupprime,
    );

    // Act
    const resultat = await deleteUtilisateurService(7);

    // Assert
    expect(deleteUtilisateurRepository).toHaveBeenCalledWith(7);
    expect(resultat).toBe(utilisateurSupprime);
  });

  it("erreur : renvoie null si le repository ne trouve rien à supprimer", async () => {
    // Ce test vérifie que le service ne transforme pas un "rien supprimé"
    // en erreur : il renvoie simplement null, comme le repository.

    // Arrange
    (deleteUtilisateurRepository as jest.Mock).mockResolvedValue(null);

    // Act
    const resultat = await deleteUtilisateurService(999);

    // Assert
    expect(resultat).toBeNull();
  });
});
