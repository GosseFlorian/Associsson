import "../style/ProfilCard.css"
import { useState, useEffect } from "react";

type ProfilCardProps = {
  id: number;
};

type Membre = {
  nomUtilisateur: string;
  nomOrganisation: string;
  role: string;
};

export function ProfilCard({ id }: ProfilCardProps) {
  const [membre, setMembre] = useState<Membre | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/membre/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Membre introuvable");
        }

        return response.json();
      })
      .then((data) => {
        setMembre(data);
      })
      .catch(() => {
        setError(true);
      });
  }, [id]);

  if (error) {
    return (
      <div className="profilCard-container">
        <h1>Membre introuvable</h1>
        <p>Ce membre n'existe pas.</p>
      </div>
    );
  }

  if (!membre) {
    return <p>Chargement...</p>;
  }

  function getInitiales(nom: string): string {
    const morceaux = nom.trim().split(" ");

    if (morceaux.length === 1) {
      return morceaux[0].slice(0, 2).toUpperCase();
    }

    return morceaux
      .map(mot => mot[0])
      .join("")
      .toUpperCase();
  }

  function capitalize(texte: string): string {
    return texte.charAt(0).toUpperCase() + texte.slice(1);
  }

  return (
    <>
      <div className="profilCard-container">
        <div className="profilCard-img">{ getInitiales(membre.nomUtilisateur)}</div>
        <h1 className="profilCard-name profilMargin">{membre.nomUtilisateur}</h1>
        <p className="profilCard-orga profilMargin">{membre.nomOrganisation}</p>
        <p className="profilCard-role profilMargin">{capitalize(membre.role)}</p>
      </div>
    </>
  );
}
