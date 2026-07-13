import {
  getOrganisationIdRepository,
  getOrganisationRepository,
  postOrganisationRepository,
  putOrganisationRepository,
  deleteOrganisationRepository,
} from "../src/repositories/organisation.repository";
import { pool } from "../src/config/client";

jest.mock("../src/config/client", () => ({
  pool: {
    query: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getOrganisationIdRepository", () => {
  it("doit retourner une organisation", async () => {
    const organisation = {
      nom: "OpenAI",
      date_creation: new Date(),
      est_actif: true,
      proprietaire_id: 1,
    };

    (pool.query as jest.Mock).mockResolvedValue({
      rows: [organisation],
    });

    const result = await getOrganisationIdRepository(1);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT nom, date_creation, est_actif, proprietaire_id FROM organisation WHERE id = $1",
      [1],
    );
    expect(result).toEqual(organisation);
  });
});

describe("getOrganisationRepository", () => {
  it("doit retourner la liste des organisations", async () => {
    const organisations = [
      {
        nom: "OpenAI",
        date_creation: new Date(),
        est_actif: true,
        proprietaire_id: 1,
      },
    ];

    (pool.query as jest.Mock).mockResolvedValue({
      rows: organisations,
    });

    const result = await getOrganisationRepository();

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT nom, date_creation, est_actif, proprietaire_id FROM organisation ORDER BY id",
    );
    expect(result).toEqual(organisations);
  });
});

describe("postOrganisationRepository", () => {
  it("doit créer une organisation", async () => {
    const organisation = {
      nom: "OpenAI",
      est_actif: true,
      proprietaire_id: 1,
    };

    (pool.query as jest.Mock).mockResolvedValue({
      rows: [organisation],
    });

    const result = await postOrganisationRepository(organisation);

    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO organisation (nom, est_actif, proprietaire_id) VALUES ($1, $2, $3) RETURNING *",
      [organisation.nom, organisation.est_actif, organisation.proprietaire_id],
    );
    expect(result).toEqual(organisation);
  });

  it("doit lever une erreur si la création échoue", async () => {
    const organisation = {
      nom: "OpenAI",
      est_actif: true,
      proprietaire_id: 1,
    };

    (pool.query as jest.Mock).mockResolvedValue({
      rows: [],
    });

    await expect(postOrganisationRepository(organisation)).rejects.toThrow(
      "Echec de la creation de l'organisation",
    );
  });
});

describe("putOrganisationRepository", () => {
  it("doit modifier une organisation", async () => {
    const data = {
      nom: "Nouveau nom",
    };

    const organisation = {
      id: 1,
      nom: "Nouveau nom",
    };

    (pool.query as jest.Mock).mockResolvedValue({
      rows: [organisation],
    });

    const result = await putOrganisationRepository(1, data);

    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      [data.nom, data.est_actif, data.proprietaire_id, 1],
    );
    expect(result).toEqual(organisation);
  });

  it("doit lever une erreur si aucune organisation n'est modifiée", async () => {
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [],
    });

    await expect(
      putOrganisationRepository(1, { nom: "Test" }),
    ).rejects.toThrow("Echec de la modification");
  });
});

describe("deleteOrganisationRepository", () => {
  it("doit supprimer une organisation", async () => {
    const organisation = {
      id: 1,
      nom: "OpenAI",
    };

    (pool.query as jest.Mock).mockResolvedValue({
      rows: [organisation],
    });

    const result = await deleteOrganisationRepository(1);

    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM organisation WHERE id = $1 RETURNING *",
      [1],
    );
    expect(result).toEqual(organisation);
  });

  it("doit lever une erreur si aucune organisation n'est supprimée", async () => {
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [],
    });

    await expect(deleteOrganisationRepository(1)).rejects.toThrow(
      "Echec de la modification",
    );
  });
});
