import { useEffect } from "react";
import { useOrganisationStore } from "../stores/organisationStore";
import "../style/components/NavBar.css";
import { useLoginStore } from "../stores/loginStore";
import { Link, useParams, useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  const deconnexion = useLoginStore((state) => state.deconnexion);
  const { idUtilisateurPath, idOrganisation, role } = useParams();
  const {
    organisations,
    chargementOrganisation,
    errorOrganisation,
    fetchOrganisation,
  } = useOrganisationStore();

  useEffect(() => {
    fetchOrganisation();
  }, [fetchOrganisation]);

  const handleDeconnexion = () => {
    deconnexion();
    navigate("/login");
  };

  if (chargementOrganisation) {
    return <p>Chargement des organisations...</p>;
  }

  if (errorOrganisation) {
    return <p>Erreur : {errorOrganisation}</p>;
  }

  const organisation = organisations.find(
    (org) => org.id === Number(idOrganisation),
  );

  let Orga = <p className="orga-p">Choisir Organisation</p>;

  if (organisation && organisation.nom) {
    Orga = <p className="orga-p">{organisation.nom}</p>;
  }


  const url = window.location.href;

  let MonProfil = <Link to={`profilPage`} className="navBar-a">
    Mon Profil
  </Link>
  if (url.includes("profilPage")) {
    Orga = <p className="orga-p">Votre Profil</p>;
    MonProfil = <p></p>
  }

  let accueil = (
    <button className="logo-home" onClick={() => navigate(-1)}>
      Retour
    </button>
  );
  if (
    url.includes(`${idUtilisateurPath}/organisations/${idOrganisation}/${role}`)
  ) {
    accueil = (
      <a className="logo-home" href={`/${idUtilisateurPath}/organisations`}>
        Choix Organisation
      </a>
    );
  } else if (url.includes(`${idUtilisateurPath}/organisations`)) {
    accueil = <p className="logo-home">Accueil</p>;
  }

  return (
    <>
      <header>
        {accueil}
        {Orga}
        <div>
          {MonProfil}
          <button onClick={handleDeconnexion}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 512 512"
              fill="currentColor"
            >
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
            </svg>Deconnexion
          </button>
        </div>
      </header>
    </>
  );
}
