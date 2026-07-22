import { Request, Response } from "express";
import {
  getTachesController,
  getTacheIdController,
  postTacheController,
  putTacheController,
  deleteTacheController,
} from "../src/controllers/tache.controller";
import {
  getTachesService,
  getTacheIdService,
  postTacheService,
  putTacheService,
  deleteTacheService,
} from "../src/services/tache.service";

// jest.mock remplace toutes les fonctions du service par des fausses fonctions.
// On contrôle ensuite ce qu'elles renvoient dans chaque test (Arrange).
jest.mock("../src/services/tache.service");

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

describe("getTachesController", () => {
  it("succès : renvoie 200 et la liste des tâches", async () => {
    // Ce test vérifie que si le service renvoie une liste sans erreur,
    // le controller répond bien avec le status 200 et cette liste en JSON.

    // Arrange
    const taches = [{ id: 1, titre: "Tâche 1" }];
    (getTachesService as jest.Mock).mockResolvedValue(taches);
    const req = {} as Request;
    const res = mockResponse();

    // Act
    await getTachesController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(taches);
  });

  it("erreur : renvoie 500 si le service plante", async () => {
    // Ce test vérifie que si le service lève une exception (ex: base de
    // données injoignable), le controller ne plante pas mais répond 500.

    // Arrange
    (getTachesService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = {} as Request;
    const res = mockResponse();

    // Act
    await getTachesController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getTacheIdController", () => {
  it("succès : renvoie 200 et la tâche trouvée", async () => {
    // Ce test vérifie que pour un id valide et existant, le controller
    // renvoie 200 avec la tâche correspondante.

    // Arrange
    const tache = { id: 5, titre: "Tâche 5" };
    (getTacheIdService as jest.Mock).mockResolvedValue(tache);
    const req = { params: { id: "5" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getTacheIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tache);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie la validation d'entrée du controller : un id non
    // numérique doit être rejeté AVANT même d'appeler le service.

    // Arrange
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getTacheIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 404 si la tâche n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucune tâche pour
    // l'id donné, le controller répond 404.

    // Arrange
    (getTacheIdService as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "999" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getTacheIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("postTacheController", () => {
  it("succès : renvoie 201 et la tâche créée", async () => {
    // Ce test vérifie que le controller transmet bien le body de la
    // requête au service, et renvoie la tâche créée avec 201.

    // Arrange
    const nouvelleTache = { id: 1, titre: "Nouvelle tâche" };
    (postTacheService as jest.Mock).mockResolvedValue(nouvelleTache);
    const req = {
      body: { titre: "Nouvelle tâche", projet_id: 1 },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await postTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(nouvelleTache);
  });

  it("erreur : renvoie 400 si le titre est manquant", async () => {
    // Ce test vérifie que la validation d'entrée du controller bloque
    // la création si le titre n'est pas fourni, sans appeler le service.

    // Arrange
    const req = { body: { projet_id: 1 } } as unknown as Request;
    const res = mockResponse();

    // Act
    await postTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(postTacheService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 400 si le projet_id est manquant", async () => {
    // Ce test vérifie que la validation d'entrée du controller bloque
    // la création si le projet_id n'est pas fourni, sans appeler le service.

    // Arrange
    const req = { body: { titre: "Une tâche" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await postTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(postTacheService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 400 si le service lève une erreur de validation métier", async () => {
    // Ce test vérifie que le controller distingue les erreurs de validation
    // métier (ex: titre vide après trim) des erreurs serveur, et renvoie 400.

    // Arrange
    (postTacheService as jest.Mock).mockRejectedValue(
      new Error("Le titre de la tâche est obligatoire"),
    );
    const req = { body: { titre: "  ", projet_id: 1 } } as unknown as Request;
    const res = mockResponse();

    // Act
    await postTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 500 si le service plante pour une autre raison", async () => {
    // Ce test vérifie que si la création échoue côté service pour une
    // raison qui n'est pas de la validation, le controller répond 500.

    // Arrange
    (postTacheService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = {
      body: { titre: "Une tâche", projet_id: 1 },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await postTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("putTacheController", () => {
  it("succès : renvoie 200 et la tâche modifiée", async () => {
    // Ce test vérifie que pour un id valide, le controller transmet bien
    // les nouvelles données au service et renvoie le résultat avec 200.

    // Arrange
    const tacheModifiee = { id: 3, statut: "termine" };
    (putTacheService as jest.Mock).mockResolvedValue(tacheModifiee);
    const req = {
      params: { id: "3" },
      body: { statut: "termine" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tacheModifiee);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie que la modification est bloquée dès la validation
    // de l'id, sans jamais appeler le service.

    // Arrange
    const req = { params: { id: "abc" }, body: {} } as unknown as Request;
    const res = mockResponse();

    // Act
    await putTacheController(req, res);

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
    await putTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(putTacheService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 404 si la tâche n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucune tâche pour
    // l'id donné, le controller répond 404.

    // Arrange
    (putTacheService as jest.Mock).mockResolvedValue(null);
    const req = {
      params: { id: "999" },
      body: { statut: "termine" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteTacheController", () => {
  it("succès : renvoie 200 et la tâche supprimée", async () => {
    // Ce test vérifie que pour un id valide et existant, le controller
    // renvoie 200 avec la tâche qui vient d'être supprimée.

    // Arrange
    const tacheSupprimee = { id: 7 };
    (deleteTacheService as jest.Mock).mockResolvedValue(tacheSupprimee);
    const req = { params: { id: "7" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tacheSupprimee);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie que la suppression est bloquée dès la validation
    // de l'id, sans jamais appeler le service.

    // Arrange
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 404 si la tâche n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucune tâche pour
    // l'id donné, le controller répond 404.

    // Arrange
    (deleteTacheService as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "999" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteTacheController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
