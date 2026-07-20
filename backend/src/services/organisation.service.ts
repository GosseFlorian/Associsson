import { Organisation, OrganisationDetails } from "../types";
import {
  getOrganisationIdRepository,
  getOrganisationsRepository,
  postOrganisationRepository,
  putOrganisationRepository,
  deleteOrganisationRepository,
} from "../repositories/organisation.repository";

export const getOrganisationsService = async (): Promise<
  OrganisationDetails[]
> => {
  return await getOrganisationsRepository();
};

export const getOrganisationIdService = async (
  id: number,
): Promise<OrganisationDetails | null> => {
  return await getOrganisationIdRepository(id);
};

export const postOrganisationService = async (
  data: Organisation,
): Promise<Organisation> => {
  // Validation du nom
  if (!data.nom || data.nom.trim() === "") {
    throw new Error("Le nom de l'organisation est obligatoire");
  }
  return await postOrganisationRepository(data);
};

export const putOrganisationService = async (
  id: number,
  data: Partial<Organisation>,
): Promise<Organisation | null> => {
  return await putOrganisationRepository(id, data);
};

export const deleteOrganisationService = async (
  id: number,
): Promise<Organisation | null> => {
  return await deleteOrganisationRepository(id);
};
