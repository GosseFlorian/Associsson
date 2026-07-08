import { Organisation } from "../types";
import {
  getOrganisationIdRepository,
  getOrganisationRepository,
  postOrganisationRepository,
  putOrganisationRepository,
} from "../repositories/organisation.repository";

export const getOrganisationIdService = async (
  id: number,
): Promise<Organisation | undefined> => {
  return await getOrganisationIdRepository(id);
};

export const getOrganisationService = async (): Promise<Organisation[]> => {
  return await getOrganisationRepository();
};

export const postOrganisationService = async (
  data: Organisation,
): Promise<Organisation> => {
  return await postOrganisationRepository(data);
};

export const putOrganisationService = async (
  id: number,
  data: Partial<Organisation>,
): Promise<Organisation> => {
  return await putOrganisationRepository(id, data);
};
