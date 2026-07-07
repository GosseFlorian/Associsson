import { Organisation } from "../types";
import {
  getOrganisationIdRepository,
  getOrganisationRepository,
} from "../repositories/organisation.repository";

export const getOrganisationIdService = async (
  id: number,
): Promise<Organisation | undefined> => {
  return await getOrganisationIdRepository(id);
};

export const getOrganisationService = async (): Promise<Organisation[]> => {
  return await getOrganisationRepository();
};
