import { Request, Response } from "express";
import {
  getUtilisateursController,
  getUtilisateurIdController,
  postUtilisateurController,
  putUtilisateurController,
  deleteUtilisateurController,
} from "../src/controllers/utilisateur.controller";
import {
  getUtilisateursService,
  getUtilisateurIdService,
  postUtilisateurService,
  putUtilisateurService,
  deleteUtilisateurService,
} from "../src/services/utilisateur.service";

// jest.mock remplace toutes les fonctions du service par des fausses fonctions.
// On contrôle ensuite ce qu'elles renvoient dans chaque test (Arrange).
jest.mock("../src/services/utilisateur.service");

// Faux "Response" Express minimal : juste status() et json(), chaînés
// comme le fait vraiment Express (res.status(x).json(y)).
function mockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

// Avant chaque test, vide l'historique de tous les mocks pour garantir
// que chaque test démarre avec un état propre.
beforeEach(() => {
  jest.clearAllMocks();
});

describe("getUtilisateursController", () => {
  it("succès : renvoie 200 et la liste des utilisateurs", async () => {
    // Ce test vérifie que si le service renvoie une liste sans erreur,
    // le controller répond bien avec le status 200 et cette liste en JSON.

    // Arrange
    const utilisateurs = [{ id: 1, nom: "Jean" }];
    (getUtilisateursService as jest.Mock).mockResolvedValue(utilisateurs);
    const req = {} as Request;
    const res = mockResponse();

    // Act
    await getUtilisateursController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(utilisateurs);
  });

  it("erreur : renvoie 500 si le service plante", async () => {
    // Ce test vérifie que si le service lève une exception (ex: base de
    // données injoignable), le controller ne plante pas mais répond 500.

    // Arrange
    (getUtilisateursService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = {} as Request;
    const res = mockResponse();

    // Act
    await getUtilisateursController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getUtilisateurIdController", () => {
  it("succès : renvoie 200 et l'utilisateur trouvé", async () => {
    // Ce test vérifie que pour un id valide et existant, le controller
    // renvoie 200 avec l'utilisateur correspondant.

    // Arrange
    const utilisateur = { id: 5, nom: "Jean" };
    (getUtilisateurIdService as jest.Mock).mockResolvedValue(utilisateur);
    const req = { params: { id: "5" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getUtilisateurIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(utilisateur);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie la validation d'entrée du controller : un id non
    // numérique doit être rejeté AVANT même d'appeler le service.

    // Arrange
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getUtilisateurIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 404 si l'utilisateur n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucun utilisateur pour
    // l'id donné, le controller répond 404.

    // Arrange
    (getUtilisateurIdService as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "999" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getUtilisateurIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("postUtilisateurController", () => {
  it("succès : renvoie 201 et l'utilisateur créé", async () => {
    // Ce test vérifie que le controller transmet bien le body de la
    // requête au service, et renvoie l'utilisateur créé avec 201.

    // Arrange
    const nouvelUtilisateur = { id: 1, nom: "Marie" };
    (postUtilisateurService as jest.Mock).mockResolvedValue(nouvelUtilisateur);
    const req = {
      body: { nom: "Marie", email: "marie@test.fr", mot_de_passe: "secret123" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await postUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(nouvelUtilisateur);
  });

  it("erreur : renvoie 400 si des champs obligatoires sont manquants", async () => {
    // Ce test vérifie que la validation d'entrée du controller bloque
    // la création si nom, email ou mot de passe ne sont pas fournis,
    // sans appeler le service.

    // Arrange
    const req = { body: { nom: "Marie" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await postUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(postUtilisateurService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 400 si le service lève une erreur de format d'email", async () => {
    // Ce test vérifie que le controller distingue les erreurs de validation
    // métier (email invalide) des erreurs serveur, et renvoie 400.

    // Arrange
    (postUtilisateurService as jest.Mock).mockRejectedValue(
      new Error("Format de l'adresse email invalide."),
    );
    const req = {
      body: { nom: "Marie", email: "invalide", mot_de_passe: "secret123" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await postUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 400 si le service lève une erreur de mot de passe", async () => {
    // Ce test vérifie que le controller renvoie 400 pour une erreur de
    // validation liée au mot de passe.

    // Arrange
    (postUtilisateurService as jest.Mock).mockRejectedValue(
      new Error("Le mot de passe doit contenir au moins 6 caractères."),
    );
    const req = {
      body: { nom: "Marie", email: "marie@test.fr", mot_de_passe: "abc" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await postUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 500 si le service plante pour une autre raison", async () => {
    // Ce test vérifie que si la création échoue côté service pour une
    // raison qui n'est pas de la validation, le controller répond 500.

    // Arrange
    (postUtilisateurService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = {
      body: { nom: "Marie", email: "marie@test.fr", mot_de_passe: "secret123" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await postUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("putUtilisateurController", () => {
  it("succès : renvoie 200 et l'utilisateur modifié", async () => {
    // Ce test vérifie que pour un id valide, le controller transmet bien
    // les nouvelles données au service et renvoie le résultat avec 200.

    // Arrange
    const utilisateurModifie = { id: 3, nom: "Nouveau nom" };
    (putUtilisateurService as jest.Mock).mockResolvedValue(utilisateurModifie);
    const req = {
      params: { id: "3" },
      body: { nom: "Nouveau nom" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(utilisateurModifie);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie que la modification est bloquée dès la validation
    // de l'id, sans jamais appeler le service.

    // Arrange
    const req = { params: { id: "abc" }, body: {} } as unknown as Request;
    const res = mockResponse();

    // Act
    await putUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 400 si aucune donnée n'est fournie", async () => {
    // Ce test vérifie que la modification est bloquée si le body est
    // vide, sans jamais appeler le service.

    // Arrange
    const req = { params: { id: "3" }, body: {} } as unknown as Request;
    const res = mockResponse();

    // Act
    await putUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(putUtilisateurService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 404 si l'utilisateur n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucun utilisateur pour
    // l'id donné, le controller répond 404.

    // Arrange
    (putUtilisateurService as jest.Mock).mockResolvedValue(null);
    const req = {
      params: { id: "999" },
      body: { nom: "X" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("erreur : renvoie 400 si le service lève une erreur de validation métier", async () => {
    // Ce test vérifie que le controller distingue les erreurs de validation
    // métier (ex: email invalide) des erreurs serveur, et renvoie 400.

    // Arrange
    (putUtilisateurService as jest.Mock).mockRejectedValue(
      new Error("Format de l'adresse email invalide."),
    );
    const req = {
      params: { id: "3" },
      body: { email: "invalide" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("deleteUtilisateurController", () => {
  it("succès : renvoie 200 et l'utilisateur supprimé", async () => {
    // Ce test vérifie que pour un id valide et existant, le controller
    // renvoie 200 avec l'utilisateur qui vient d'être supprimé.

    // Arrange
    const utilisateurSupprime = { id: 7 };
    (deleteUtilisateurService as jest.Mock).mockResolvedValue(
      utilisateurSupprime,
    );
    const req = { params: { id: "7" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(utilisateurSupprime);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie que la suppression est bloquée dès la validation
    // de l'id, sans jamais appeler le service.

    // Arrange
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 404 si l'utilisateur n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucun utilisateur pour
    // l'id donné, le controller répond 404.

    // Arrange
    (deleteUtilisateurService as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "999" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteUtilisateurController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
