import { useEffect } from "react";
import { useOrganisationStore } from "../stores/organisationStore";
import "../style/components/NavBar.css"
import { useParams } from "react-router-dom"

export function NavBar() {
  const { idUtilisateurPath, idOrganisation } = useParams()
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

  let Orga = <p className="orga-p">Choisir Organisation</p>;

  if(idOrganisation) {
    Orga = <p className="orga-p">{ organisation.nom}</p>
  }

  return (
    <>
      <header>
        <a className="logo-home" href={`/${idUtilisateurPath}/organisations`}>Accueil</a>
        {Orga}
        <a href="/profilPage" className="navBar-a">Mon Profil</a>
      </header>
    </>
  )
}
