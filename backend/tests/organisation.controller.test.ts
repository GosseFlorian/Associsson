import { Request, Response } from "express";
import {
  getOrganisationsController,
  getOrganisationIdController,
  postOrganisationController,
  putOrganisationController,
  deleteOrganisationController,
} from "../src/controllers/organisation.controller";
import {
  getOrganisationsService,
  getOrganisationIdService,
  postOrganisationService,
  putOrganisationService,
  deleteOrganisationService,
} from "../src/services/organisation.service";

// jest.mock remplace toutes les fonctions du service par des fausses fonctions.
// On contrôle ensuite ce qu'elles renvoient dans chaque test (Arrange).
jest.mock("../src/services/organisation.service");

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

describe("getOrganisationsController", () => {
  it("succès : renvoie 200 et la liste des organisations", async () => {
    // Ce test vérifie que si le service renvoie une liste sans erreur,
    // le controller répond bien avec le status 200 et cette liste en JSON.

    // Arrange
    const organisations = [{ id: 1, nom: "OpenAI" }];
    (getOrganisationsService as jest.Mock).mockResolvedValue(organisations);
    const req = {} as Request;
    const res = mockResponse();

    // Act
    await getOrganisationsController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(organisations);
  });

  it("erreur : renvoie 500 si le service plante", async () => {
    // Ce test vérifie que si le service lève une exception (ex: base de
    // données injoignable), le controller ne plante pas mais répond 500.

    // Arrange
    (getOrganisationsService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = {} as Request;
    const res = mockResponse();

    // Act
    await getOrganisationsController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getOrganisationIdController", () => {
  it("succès : renvoie 200 et l'organisation trouvée", async () => {
    // Ce test vérifie que pour un id valide et existant, le controller
    // renvoie 200 avec l'organisation correspondante.

    // Arrange
    const organisation = { id: 1, nom: "OpenAI" };
    (getOrganisationIdService as jest.Mock).mockResolvedValue(organisation);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getOrganisationIdController(req, res);

    // Assert
    expect(getOrganisationIdService).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(organisation);
  });

  it("erreur : renvoie 400 si l'id n'est pas un nombre", async () => {
    // Ce test vérifie la validation d'entrée du controller : un id non
    // numérique doit être rejeté AVANT même d'appeler le service.

    // Arrange
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getOrganisationIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "ID invalide" });
  });

  it("erreur : renvoie 404 si l'organisation n'existe pas", async () => {
    // Ce test vérifie que si le service ne trouve aucune organisation pour
    // l'id donné, le controller répond 404.

    // Arrange
    (getOrganisationIdService as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getOrganisationIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Organisation non trouvé",
    });
  });

  it("erreur : renvoie 500 si le service plante", async () => {
    // Ce test vérifie que si le service lève une exception, le controller
    // répond 500.

    // Arrange
    (getOrganisationIdService as jest.Mock).mockRejectedValue(
      new Error("Erreur DB"),
    );
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await getOrganisationIdController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erreur interne du serveur",
    });
  });
});

describe("postOrganisationController", () => {
  it("succès : renvoie 201 et l'organisation créée", async () => {
    // Ce test vérifie que le controller transmet bien le body de la
    // requête au service, et renvoie l'organisation créée avec 201.
    // Le code réel utilise `res.status(201)` pour une création.

    // Arrange
    const data = { nom: "OpenAI" };
    const organisation = { id: 1, nom: "OpenAI" };
    (postOrganisationService as jest.Mock).mockResolvedValue(organisation);
    const req = { body: data } as Request;
    const res = mockResponse();

    // Act
    await postOrganisationController(req, res);

    // Assert
    expect(postOrganisationService).toHaveBeenCalledWith(data);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(organisation);
  });

  it("erreur : renvoie 400 si le nom est manquant", async () => {
    // Ce test vérifie que la validation d'entrée du controller bloque
    // la création si le nom n'est pas fourni, sans appeler le service.

    // Arrange
    const req = { body: {} } as Request;
    const res = mockResponse();

    // Act
    await postOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(postOrganisationService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 400 si le service lève une erreur de validation métier", async () => {
    // Ce test vérifie que le controller distingue les erreurs de validation
    // métier (ex: nom vide après trim) des erreurs serveur, et renvoie 400.

    // Arrange
    (postOrganisationService as jest.Mock).mockRejectedValue(
      new Error("Le nom de l'organisation est obligatoire"),
    );
    const req = { body: { nom: "  " } } as Request;
    const res = mockResponse();

    // Act
    await postOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("erreur : renvoie 500 si le service plante pour une autre raison", async () => {
    // Ce test vérifie que si la création échoue côté service pour une
    // raison qui n'est pas de la validation, le controller répond 500.

    // Arrange
    (postOrganisationService as jest.Mock).mockRejectedValue(
      new Error("Erreur DB"),
    );
    const req = { body: { nom: "OpenAI" } } as Request;
    const res = mockResponse();

    // Act
    await postOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erreur interne du serveur",
    });
  });
});

describe("putOrganisationController", () => {
  it("succès : renvoie 200 après modification", async () => {
    // Ce test vérifie que pour un id valide, le controller transmet bien
    // les nouvelles données au service et renvoie le résultat avec 200.

    // Arrange
    const organisation = { id: 1, nom: "Nouvelle organisation" };
    (putOrganisationService as jest.Mock).mockResolvedValue(organisation);
    const req = {
      params: { id: "1" },
      body: { nom: "Nouvelle organisation" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putOrganisationController(req, res);

    // Assert
    expect(putOrganisationService).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(organisation);
  });

  it("erreur : renvoie 400 si l'id est invalide", async () => {
    // Ce test vérifie que la modification est bloquée dès la validation
    // de l'id, sans jamais appeler le service.

    // Arrange
    const req = {
      params: { id: "abc" },
      body: { nom: "test" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "ID invalide" });
    expect(putOrganisationService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 400 si aucune donnée n'est fournie", async () => {
    // Ce test vérifie que la modification est bloquée si le body est
    // vide, sans jamais appeler le service.

    // Arrange
    const req = { params: { id: "1" }, body: {} } as unknown as Request;
    const res = mockResponse();

    // Act
    await putOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(putOrganisationService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 404 si organisation inexistante", async () => {
    // Ce test vérifie que si le service ne trouve aucune organisation pour
    // l'id donné, le controller répond 404.
    // Attention : il faut fournir au moins un champ dans le body pour
    // dépasser la validation "aucune donnée fournie" et atteindre le service.

    // Arrange
    (putOrganisationService as jest.Mock).mockResolvedValue(null);
    const req = {
      params: { id: "1" },
      body: { nom: "test" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Organisation non trouvé",
    });
  });

  it("erreur : renvoie 500 si le service échoue", async () => {
    // Ce test vérifie que si le service lève une exception, le controller
    // répond 500.

    // Arrange
    (putOrganisationService as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = {
      params: { id: "1" },
      body: { nom: "test" },
    } as unknown as Request;
    const res = mockResponse();

    // Act
    await putOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("deleteOrganisationController", () => {
  it("succès : renvoie 200 après suppression", async () => {
    // Ce test vérifie que pour un id valide et existant, le controller
    // renvoie 200 avec l'organisation qui vient d'être supprimée.

    // Arrange
    const organisation = { id: 1, nom: "OpenAI" };
    (deleteOrganisationService as jest.Mock).mockResolvedValue(organisation);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteOrganisationController(req, res);

    // Assert
    expect(deleteOrganisationService).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(organisation);
  });

  it("erreur : renvoie 400 si id invalide", async () => {
    // Ce test vérifie que la suppression est bloquée dès la validation
    // de l'id, sans jamais appeler le service.

    // Arrange
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(deleteOrganisationService).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 404 si organisation inexistante", async () => {
    // Ce test vérifie que si le service ne trouve aucune organisation pour
    // l'id donné, le controller répond 404.

    // Arrange
    (deleteOrganisationService as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("erreur : renvoie 500 si le service échoue", async () => {
    // Ce test vérifie que si le service lève une exception, le controller
    // répond 500.

    // Arrange
    (deleteOrganisationService as jest.Mock).mockRejectedValue(
      new Error("boom"),
    );
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    // Act
    await deleteOrganisationController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
