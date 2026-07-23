import "../style/pages/OrganisationPage.css";
import { useEffect } from "react";
import { useLoginStore } from "../stores/loginStore";
import { useUtilisateurStore } from "../stores/utilisateurStore";
import { useMembreStore } from "../stores/membreStore";
import { Link, useParams } from "react-router-dom";
import { useOrganisationStore } from "../stores/organisationStore";
import { FormulaireOrganisation } from "../components/FormulaireOrganisation";


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

  setRole(null);
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

  const OrganisationMembre = membres.filter(
    (membre) => membre.nomUtilisateur === utilisateur.nom,
  );


  return (
    <>
      <div className="organisation-header">
        <h1>Mes Organisations</h1>
        <FormulaireOrganisation/>
      </div>
      <hr />
      <div className="organisation-body">
        {OrganisationMembre.length === 0 ? (
          <p>Vous n'avez pas encore d'organisation.</p>
        ) : (
          OrganisationMembre.map((membre) => (
            <div
              className="organisation-container"
              key={membre.organisation_id}
            >
              <div className="container-header">
                <p className="organisation-nom">{membre.nomOrganisation}</p>
                <button
                  className="delete-button"
                  onClick={() => deleteOrganisation(membre.organisation_id)}
                >
                  x
                </button>
              </div>
              <p className="organisation-role">role : {membre.role}</p>
              <Link className="organisation-link" to={`${membre.organisation_id}/${membre.role}`} onClick={() => { setRole(membre.role); setIdMembre(membre.id)}}>
                Voir organisation
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}

