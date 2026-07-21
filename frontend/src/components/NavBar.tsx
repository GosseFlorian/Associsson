import { useEffect } from "react";
import { useOrganisationStore } from "../stores/organisationStore";
import "../style/components/NavBar.css"
import { Link, useParams } from "react-router-dom"

export function NavBar() {
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

  let link = <Link to={`profilPage`} className="navBar-a">Mon Profil</Link>
  if (idOrganisation) {
    link = <Link to={`organisations/${idOrganisation}/${role}/profilPage`} className="navBar-a">Mon Profil</Link>
  }

  const url = window.location.href;
  let accueil = <a className="logo-home" href={`/${idUtilisateurPath}/organisations`}>Accueil</a>
  if (url.includes(`${role}/profilPage`)) {
    accueil = <a className="logo-home" href={`/${idUtilisateurPath}/organisations/${idOrganisation}/${role}`}>Revenir à l'organisation</a>
  }

  return (
    <>
      <header>
        {accueil}
        {Orga}
        {link}
      </header>
    </>
  )
}
