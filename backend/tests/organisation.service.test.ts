import {
  getOrganisationIdService,
  getOrganisationService,
  postOrganisationService,
  putOrganisationService,
  deleteOrganisationService,
} from "../src/services/organisation.service";

import {
  getOrganisationIdRepository,
  getOrganisationRepository,
  postOrganisationRepository,
  putOrganisationRepository,
  deleteOrganisationRepository,
} from "../src/repositories/organisation.repository";

jest.mock("../src/repositories/organisation.repository", () => ({
  getOrganisationIdRepository: jest.fn(),
  getOrganisationRepository: jest.fn(),
  postOrganisationRepository: jest.fn(),
  putOrganisationRepository: jest.fn(),
  deleteOrganisationRepository: jest.fn(),
}));

describe("OrganisationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getOrganisationIdService doit retourner une organisation", async () => {
    const organisation = { id: 1, nom: "OpenAI" };
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(organisation);

    const result = await getOrganisationIdService(1);

    expect(getOrganisationIdRepository).toHaveBeenCalledWith(1);
    expect(result).toEqual(organisation);
  });

  it("getOrganisationIdService doit retourner undefined si aucune organisation", async () => {
    (getOrganisationIdRepository as jest.Mock).mockResolvedValue(undefined);

    const result = await getOrganisationIdService(1);

    expect(getOrganisationIdRepository).toHaveBeenCalledWith(1);
    expect(result).toBeUndefined();
  });

  it("getOrganisationService doit retourner la liste des organisations", async () => {
    const organisations = [
      { id: 1, nom: "OpenAI" },
      { id: 2, nom: "Google" },
    ];

    (getOrganisationRepository as jest.Mock).mockResolvedValue(organisations);

    const result = await getOrganisationService();

    expect(getOrganisationRepository).toHaveBeenCalled();
    expect(result).toEqual(organisations);
  });

  it("postOrganisationService doit créer une organisation", async () => {
    const data = { id: 1, nom: "OpenAI" };

    (postOrganisationRepository as jest.Mock).mockResolvedValue(data);

    const result = await postOrganisationService(data);

    expect(postOrganisationRepository).toHaveBeenCalledWith(data);
    expect(result).toEqual(data);
  });

  it("putOrganisationService doit modifier une organisation", async () => {
    const data = { nom: "Nouvelle organisation" };
    const organisation = { id: 1, nom: "Nouvelle organisation" };

    (putOrganisationRepository as jest.Mock).mockResolvedValue(organisation);

    const result = await putOrganisationService(1, data);

    expect(putOrganisationRepository).toHaveBeenCalledWith(1, data);
    expect(result).toEqual(organisation);
  });

  it("deleteOrganisationService doit supprimer une organisation", async () => {
    const organisation = { id: 1, nom: "OpenAI" };

    (deleteOrganisationRepository as jest.Mock).mockResolvedValue(organisation);

    const result = await deleteOrganisationService(1);

    expect(deleteOrganisationRepository).toHaveBeenCalledWith(1);
    expect(result).toEqual(organisation);
  });
});
