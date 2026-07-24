import { Request, Response } from "express";
import {
  getMembresController,
  getMembresParIdController,
  putMembreController,
  postMembreController,
  deleteMembreController,
} from "../src/controllers/membre.controller";
import {
  getMembreService,
  getMembreParIdService,
  putMembreService,
  postMembreService,
  deleteMembreService,
} from "../src/services/membre.service";

// jest.mock remplace toutes les fonctions du service par des fausses fonctions.
// On contrôle ensuite ce qu'elles renvoient dans chaque test (Arrange).
jest.mock("../src/services/membre.service");

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

describe("getMembresController", () => {
  it("succès : renvoie 200 et la liste des membres", async () => {
    // Ce test vérifie que si le service renvoie une liste sans erreur,
    // le controller répond bien avec le status 200 et cette liste en JSON.

    // Arrange
    const membres = [{ role: "membre" }];
    (getMembreService as jest.Mock).mockResolvedValue(membres);
    const req = {} as Request;
    const res = mockResponse();

    // Act
    await getMembresController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(membres);
  });

  it("erreur : renvoie 500 si le service plante", async () => {
    // Ce test vérifie que si le service lève une exception (ex: base de
    // données injoignable), le controller ne plante pas mais répond 500.

    // Arrange
    (getMembreService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = {} as Request;
    const res = mockResponse();

    // Act
    await getMembresController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getMembresParIdController", () => {
  it("succès : renvoie 200 et le membre trouvé", async () => {
    // Ce test vérifie que pour un id valide et existant, le controller
    // renvoie 200 avec le membre correspondant.

    // Arrange
    const membre = { id: 5, role: "membre" };
    (getMembreParIdService as jest.Mock).mockResolvedValue(membre);
    const req = { params: { id: "5" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getMembresParIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(membre);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie la validation d'entrée du controller : un id non
    // numérique doit être rejeté AVANT même d'appeler le service.

    // Arrange
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getMembresParIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 404 si le membre n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucun membre pour
    // l'id donné, le controller répond 404.

    // Arrange
    (getMembreParIdService as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "999" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getMembresParIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("erreur : renvoie 500 si le service plante", async () => {
    // Ce test vérifie que si le service lève une exception, le controller
    // répond 500 (branche catch de getMembresParIdController).

    // Arrange
    (getMembreParIdService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = { params: { id: "5" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getMembresParIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("putMembreController", () => {
  it("succès : renvoie 200 et le membre modifié", async () => {
    // Ce test vérifie que pour un id valide, le controller transmet bien
    // les nouvelles données au service et renvoie le résultat avec 200.

    // Arrange
    const membreModifie = { id: 3, role: "admin" };
    (putMembreService as jest.Mock).mockResolvedValue(membreModifie);
    const req = {
      params: { id: "3" },
      body: { role: "admin" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(membreModifie);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie que la modification est bloquée dès la validation
    // de l'id, sans jamais appeler le service.

    // Arrange
    const req = { params: { id: "abc" }, body: {} } as unknown as Request;
    const res = mockResponse();

    // Act
    await putMembreController(req, res);

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
    await putMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(putMembreService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 404 si le membre n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucun membre pour
    // l'id donné, le controller répond 404.

    // Arrange
    (putMembreService as jest.Mock).mockResolvedValue(null);
    const req = {
      params: { id: "999" },
      body: { role: "admin" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("erreur : renvoie 500 si le service plante", async () => {
    // Ce test vérifie que si le service lève une exception, le controller
    // répond 500.

    // Arrange
    (putMembreService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = {
      params: { id: "3" },
      body: { role: "admin" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("postMembreController", () => {
  it("succès : renvoie 201 et le membre créé", async () => {
    // Ce test vérifie que le controller transmet bien le body de la
    // requête au service, et renvoie le membre créé avec 201.
    // Le code réel utilise `res.status(201)` pour une création.

    // Arrange
    const nouveauMembre = { id: 1, role: "membre" };
    (postMembreService as jest.Mock).mockResolvedValue(nouveauMembre);
    const req = {
      body: { utilisateur_id: 1, organisation_id: 2 },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await postMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(nouveauMembre);
  });

  it("erreur : renvoie 400 si des champs obligatoires sont manquants", async () => {
    // Ce test vérifie que la validation d'entrée du controller bloque
    // la création si utilisateur_id ou organisation_id ne sont pas
    // fournis, sans appeler le service.

    // Arrange
    const req = { body: { utilisateur_id: 1 } } as unknown as Request;
    const res = mockResponse();

    // Act
    await postMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(postMembreService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 400 si le service lève une erreur de validation métier", async () => {
    // Ce test vérifie que le controller distingue les erreurs de validation
    // métier (ex: rôle obligatoire manquant) des erreurs serveur, et
    // renvoie 400 dans ce cas (branche `error.message.includes("obligatoire")`).

    // Arrange
    (postMembreService as jest.Mock).mockRejectedValue(
      new Error("Le role du membre est obligatoire"),
    );
    const req = {
      body: { utilisateur_id: 1, organisation_id: 2, role: "" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await postMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 500 si le service plante pour une autre raison", async () => {
    // Ce test vérifie que si la création échoue côté service pour une
    // raison qui n'est pas de la validation, le controller répond 500.

    // Arrange
    (postMembreService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = {
      body: { utilisateur_id: 1, organisation_id: 2 },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await postMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("deleteMembreController", () => {
  it("succès : renvoie 200 et le membre supprimé", async () => {
    // Ce test vérifie que pour un id valide et existant, le controller
    // renvoie 200 avec le membre qui vient d'être supprimé.

    // Arrange
    const membreSupprime = { id: 7 };
    (deleteMembreService as jest.Mock).mockResolvedValue(membreSupprime);
    const req = { params: { id: "7" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(membreSupprime);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie que la suppression est bloquée dès la validation
    // de l'id, sans jamais appeler le service.

    // Arrange
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 404 si le membre n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucun membre pour
    // l'id donné, le controller répond 404.

    // Arrange
    (deleteMembreService as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "999" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("erreur : renvoie 500 si le service plante", async () => {
    // Ce test vérifie que si le service lève une exception, le controller
    // répond 500.

    // Arrange
    (deleteMembreService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = { params: { id: "7" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteMembreController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
