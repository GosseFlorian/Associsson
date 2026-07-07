import { Organisation } from "../types";
import { getOrganisationIdRepository } from "../repositories/organisation.repository";

export const getOrganisationIdService = async (
  id: number,
): Promise<Organisation | undefined> => {
  return await getOrganisationIdRepository(id);
};
