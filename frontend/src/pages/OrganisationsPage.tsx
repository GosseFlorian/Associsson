import "../style/pages/OrganisationPage.css";
import { useEffect } from "react";
import { useLoginStore } from "../stores/loginStore";
import { useUtilisateurStore } from "../stores/utilisateurStore";
import { useMembreStore } from "../stores/membreStore";
import { Link, useParams } from "react-router-dom";
import { useOrganisationStore } from "../stores/organisationStore";
import { FormulaireCreateOrganisation } from "../components/FormulaireCreateOrganisation";
import { FormulaireModifOrganisation } from "../components/FormulaireModifOrganisation";

export function OrganisationPage() {
  const { idUtilisateurPath } = useParams();
  const idUtilisateur = Number(idUtilisateurPath);
  const setRole = useLoginStore((state) => state.setRole);
  const setIdMembre = useLoginStore((state) => state.setIdMembre);

  const {
    utilisateur,
    fetchUtilisateurById,
    chargementUtilisateur,
    errorUtilisateur,
  } = useUtilisateurStore();

  const { membres, fetchMembre, chargementMembre, errorMembre } =
    useMembreStore();

  const { deleteOrganisation } = useOrganisationStore();

  useEffect(() => {
    setRole(null);
  }, [setRole]);

  useEffect(() => {
    fetchUtilisateurById(idUtilisateur);
    fetchMembre();
  }, [idUtilisateur, fetchUtilisateurById, fetchMembre]);

  if (chargementUtilisateur || chargementMembre) {
    return <p>Chargement...</p>;
  }

  if (errorUtilisateur || errorMembre) {
    return <p>{errorUtilisateur || errorMembre}</p>;
  }

  const handleDeleteOrganisation = async (id: number) => {
    await deleteOrganisation(id);
    await fetchMembre();
  };

  const OrganisationMembre = membres.filter(
    (membre) => membre.nomUtilisateur === utilisateur.nom,
  );

  return (
    <>
      <div className="organisation-header">
        <h1>Mes Organisations</h1>
        <FormulaireCreateOrganisation />
      </div>
      <div className="organisation-body">
        {OrganisationMembre.length === 0 ? (
          <p>Vous n'avez pas encore d'organisation.</p>
        ) : (
          OrganisationMembre.map((membre) => (
            <div
              className="organisation-container"
              key={membre.organisation_id}
            >
              {membre.role !== "admin" ? (
                <div className="container-header">
                  <p className="organisation-nom">{membre.nomOrganisation}</p>
                </div>
              ) : (
                <div className="container-header">
                    <p className="organisation-nom">{membre.nomOrganisation}</p>
                    <FormulaireModifOrganisation organisation_id={membre.organisation_id}/>
                  <button
                    className="update-button"
                    // onClick={() =>
                    //   handleUpdateOrganisation(membre.organisation_id)
                    // }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                      <path d="m15 5 4 4"></path>
                    </svg>
                  </button>
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteOrganisation(membre.organisation_id)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" x2="10" y1="11" y2="17"></line>
                      <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                  </button>
                </div>
              )}

              <p className="organisation-role">role : {membre.role}</p>
              <Link
                className="organisation-link"
                to={`${membre.organisation_id}/${membre.role}`}
                onClick={() => {
                  setRole(membre.role);
                  setIdMembre(membre.id);
                }}
              >
                Voir organisation
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}
