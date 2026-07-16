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
      (getProjetsService as jest.Mock).mockRejectedValueOnce(new Error("DB down"));
      const req = mockRequest();
      const res = mockResponse();

      await getProjetsController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
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
      const req = mockRequest({ params: { id: "abc" } });
      const res = mockResponse();

      await getProjetByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Identifiant invalide" });
    });

    it("retourne 404 si le projet n'existe pas", async () => {
      (getProjetByIdService as jest.Mock).mockResolvedValueOnce(undefined);
      const req = mockRequest({ params: { id: "999" } });
      const res = mockResponse();

      await getProjetByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Projet non trouvé" });
    });

    it("retourne 500 si le service échoue", async () => {
      (getProjetByIdService as jest.Mock).mockRejectedValueOnce(new Error("DB down"));
      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      await getProjetByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("postProjetController", () => {
    it("crée un projet et retourne 200", async () => {
      (postProjetService as jest.Mock).mockResolvedValueOnce(fakeProjet);
      const req = mockRequest({ body: fakeProjet });
      const res = mockResponse();

      await postProjetController(req, res);

      expect(postProjetService).toHaveBeenCalledWith(fakeProjet);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeProjet);
    });

    it("retourne 500 si la création échoue", async () => {
      (postProjetService as jest.Mock).mockRejectedValueOnce(new Error("Erreur SQL"));
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

    it("retourne 500 si la modification échoue", async () => {
      (putProjetService as jest.Mock).mockRejectedValueOnce(new Error("Projet non trouvé"));
      const req = mockRequest({ params: { id: "999" }, body: fakeProjet });
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

    it("retourne 500 si la suppression échoue", async () => {
      (deleteProjetService as jest.Mock).mockRejectedValueOnce(new Error("Projet non trouvé"));
      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      await deleteProjetController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
