import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMembreStore } from "../stores/membreStore";
import "../style/components/ProfilCard.css";

export function ProfilCard() {
  const { idOrganisation, idUtilisateurPath } = useParams();

  const idUtilisateur = Number(idUtilisateurPath);

  const membres = useMembreStore(
    (state) => state.membres
  );

  const fetchMembre = useMembreStore(
    (state) => state.fetchMembre
  );

  useEffect(() => {
    if (membres.length === 0) {
      fetchMembre();
    }
  }, [membres.length, fetchMembre]);

  if (!idUtilisateur || !idOrganisation) {
    return <p>Chargement...</p>;
  }

  const membre = membres.find(
    (m) =>
      m.utilisateur_id === idUtilisateur &&
      m.organisation_id === Number(idOrganisation)
  );

  if (!membre) {
    return <p>Chargement du profil...</p>;
  }

  function getInitiales(nom: string): string {
    const morceaux = nom.trim().split(" ");

    if (morceaux.length === 1) {
      return morceaux[0].slice(0, 2).toUpperCase();
    }

    return morceaux
      .map((mot) => mot[0])
      .join("")
      .toUpperCase();
  }

  function capitalize(texte: string): string {
    return texte.charAt(0).toUpperCase() + texte.slice(1);
  }

  return (
    <div className="profilCard-container">
      <div className="profilCard-img">
        {getInitiales(membre.nomUtilisateur)}
      </div>
      <h1 className="profilCard-name profilMargin">{membre.nomUtilisateur}</h1>
      <p className="profilCard-orga profilMargin">{membre.nomOrganisation}</p>
      <p className="profilCard-role profilMargin">{capitalize(membre.role)}</p>
    </div>
  );
}
