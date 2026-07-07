import { Organisation } from "../types";
import { getOrganisationRepository } from "../repositories/organisation.repository";

export const getOrganisationService = async (): Promise<Organisation[]> => {
  return await getOrganisationRepository();
};
