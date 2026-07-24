import { Request, Response } from "express";
import {
  getProjetsController,
  getProjetByIdController,
  postProjetController,
  putProjetController,
  deleteProjetController,
} from "../src/controllers/projet.controller";
import {
  getProjetsService,
  getProjetByIdService,
  postProjetService,
  putProjetService,
  deleteProjetService,
} from "../src/services/projet.service";
import { Projet } from "../src/types";

jest.mock("../src/services/projet.service");

const fakeProjet: Projet = {
  id: 1,
  organisation_id: 10,
  createur_id: 5,
  titre: "Projet Test",
  description: "Description test",
  date_debut: "2026-01-01",
  date_fin: "2026-12-31",
  adresse: "1 rue du Test",
  est_termine: false,
} as Projet;

// Petit helper pour simuler un objet Response Express avec status/json chaînables.
const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (overrides: Partial<Request> = {}): Request => {
  return {
    params: {},
    body: {},
    ...overrides,
  } as unknown as Request;
};
// Avant chaque test, vide l'historique de tous les mocks pour garantir
// que chaque test démarre avec un état propre.
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("projet.controller", () => {
  describe("getProjetsController", () => {
    it("retourne 200 et la liste des projets", async () => {
      (getProjetsService as jest.Mock).mockResolvedValueOnce([fakeProjet]);
      const req = mockRequest();
      const res = mockResponse();

      await getProjetsController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([fakeProjet]);
    });

    it("retourne 500 si le service échoue", async () => {
      (getProjetsService as jest.Mock).mockRejectedValueOnce(
        new Error("DB down"),
      );
      const req = mockRequest();
      const res = mockResponse();

      await getProjetsController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur interne du serveur",
      });
    });
  });

  describe("getProjetByIdController", () => {
    it("retourne 200 et le projet demandé", async () => {
      (getProjetByIdService as jest.Mock).mockResolvedValueOnce(fakeProjet);
      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      await getProjetByIdController(req, res);

      expect(getProjetByIdService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeProjet);
    });

    it("retourne 400 si l'id n'est pas un nombre", async () => {
      // Corrigé : le message réel renvoyé par le controller est
      // "ID invalide" (`res.status(400).json({ message: "ID invalide" })`),
      // pas "Identifiant invalide".
      const req = mockRequest({ params: { id: "abc" } });
      const res = mockResponse();

      await getProjetByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "ID invalide" });
    });

    it("retourne 404 si le projet n'existe pas", async () => {
      // Corrigé : le repository/service renvoie null, pas undefined.
      (getProjetByIdService as jest.Mock).mockResolvedValueOnce(null);
      const req = mockRequest({ params: { id: "999" } });
      const res = mockResponse();

      await getProjetByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Projet non trouvé" });
    });

    it("retourne 500 si le service échoue", async () => {
      (getProjetByIdService as jest.Mock).mockRejectedValueOnce(
        new Error("DB down"),
      );
      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      await getProjetByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("postProjetController", () => {
    it("crée un projet et retourne 201", async () => {
      // Corrigé : le controller réel utilise `res.status(201)` pour une
      // création, pas 200.
      (postProjetService as jest.Mock).mockResolvedValueOnce(fakeProjet);
      const req = mockRequest({ body: fakeProjet });
      const res = mockResponse();

      await postProjetController(req, res);

      expect(postProjetService).toHaveBeenCalledWith(fakeProjet);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeProjet);
    });

    it("retourne 400 si des champs obligatoires sont manquants", async () => {
      // Ajouté : le controller valide `data.titre` et `data.organisation_id`
      // avant d'appeler le service (non testé jusqu'ici).
      const req = mockRequest({ body: { titre: "Sans organisation" } });
      const res = mockResponse();

      await postProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(postProjetService).not.toHaveBeenCalled();
    });

    it("retourne 400 si le service lève une erreur de validation métier", async () => {
      // Ajouté : couvre la branche `error.message.includes("obligatoire")`
      // du controller, qui distingue erreur de validation et erreur serveur.
      (postProjetService as jest.Mock).mockRejectedValueOnce(
        new Error("Le titre du projet est obligatoire"),
      );
      const req = mockRequest({
        body: { titre: "   ", organisation_id: 10 },
      });
      const res = mockResponse();

      await postProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retourne 500 si la création échoue pour une autre raison", async () => {
      (postProjetService as jest.Mock).mockRejectedValueOnce(
        new Error("Erreur SQL"),
      );
      const req = mockRequest({ body: fakeProjet });
      const res = mockResponse();

      await postProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("putProjetController", () => {
    it("modifie un projet et retourne 200", async () => {
      (putProjetService as jest.Mock).mockResolvedValueOnce(fakeProjet);
      const req = mockRequest({ params: { id: "1" }, body: fakeProjet });
      const res = mockResponse();

      await putProjetController(req, res);

      expect(putProjetService).toHaveBeenCalledWith(1, fakeProjet);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeProjet);
    });

    it("retourne 400 si l'id est invalide", async () => {
      // Ajouté : couvre la validation d'id avant tout appel au service.
      const req = mockRequest({ params: { id: "abc" }, body: fakeProjet });
      const res = mockResponse();

      await putProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(putProjetService).not.toHaveBeenCalled();
    });

    it("retourne 400 si aucune donnée n'est fournie", async () => {
      // Ajouté : couvre la validation "Aucune donnée à modifier fournie".
      const req = mockRequest({ params: { id: "1" }, body: {} });
      const res = mockResponse();

      await putProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(putProjetService).not.toHaveBeenCalled();
    });

    it("retourne 404 si le projet n'existe pas", async () => {
      // Ajouté : couvre le cas où putProjetService renvoie null.
      (putProjetService as jest.Mock).mockResolvedValueOnce(null);
      const req = mockRequest({ params: { id: "999" }, body: fakeProjet });
      const res = mockResponse();

      await putProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Projet non trouvé" });
    });

    it("retourne 500 si la modification échoue", async () => {
      (putProjetService as jest.Mock).mockRejectedValueOnce(new Error("boom"));
      const req = mockRequest({ params: { id: "1" }, body: fakeProjet });
      const res = mockResponse();

      await putProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("deleteProjetController", () => {
    it("supprime un projet et retourne 200", async () => {
      (deleteProjetService as jest.Mock).mockResolvedValueOnce(fakeProjet);
      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      await deleteProjetController(req, res);

      expect(deleteProjetService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeProjet);
    });

    it("retourne 400 si l'id est invalide (NaN ou <= 0)", async () => {
      const req = mockRequest({ params: { id: "0" } });
      const res = mockResponse();

      await deleteProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "ID invalide" });
      expect(deleteProjetService).not.toHaveBeenCalled();
    });

    it("retourne 404 si le projet n'existe pas", async () => {
      // Ajouté : couvre le cas où deleteProjetService renvoie null.
      (deleteProjetService as jest.Mock).mockResolvedValueOnce(null);
      const req = mockRequest({ params: { id: "999" } });
      const res = mockResponse();

      await deleteProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Projet non trouvé" });
    });

    it("retourne 500 si la suppression échoue", async () => {
      (deleteProjetService as jest.Mock).mockRejectedValueOnce(
        new Error("boom"),
      );
      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      await deleteProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
