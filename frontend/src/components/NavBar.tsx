import { useEffect } from "react";
import { useOrganisationStore } from "../stores/organisationStore";
import "../style/components/NavBar.css"
import { Link, useParams, useNavigate } from "react-router-dom"

export function NavBar() {
  const navigate = useNavigate();
  const { idUtilisateurPath, idOrganisation, role } = useParams()
  const {
    organisations,
    chargementOrganisation,
    errorOrganisation,
    fetchOrganisation,
  } = useOrganisationStore();

  useEffect(() => {
    fetchOrganisation();
  }, [fetchOrganisation]);

  if (chargementOrganisation) {
    return <p>Chargement des organisations...</p>;
  }

  if (errorOrganisation) {
    return <p>Erreur : {errorOrganisation}</p>;
  }

  const organisation = organisations.find(
    (org) => org.id === Number(idOrganisation)
  );

  let Orga = <p className="orga-p">Choisir Organisation</p>

  if (organisation && organisation.nom) {
    Orga = <p className="orga-p">{ organisation.nom}</p>
  }

  const url = window.location.href;
  console.log()
  let accueil = <button className="logo-home" onClick={() => navigate(-1)}>Retour</button>
  if (url.includes(`${idUtilisateurPath}/organisations/${idOrganisation}/${role}`)) {
    accueil = <a className="logo-home" href={`/${idUtilisateurPath}/organisations`}>Choix Organisation</a>
  } else if (url.includes(`${idUtilisateurPath}/organisations`)) {
    accueil = <p className="logo-home">Accueil</p>
  }

  return (
    <>
      <header>
        {accueil}
        {Orga}
        <Link to={`profilPage`} className="navBar-a">Mon Profil</Link>
      </header>
    </>
  )
}
