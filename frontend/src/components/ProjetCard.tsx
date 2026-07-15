import "../style/ProjetCard.css";
import { useEffect, useState } from "react";
import { Button } from "./Button";

type Projet = {
  titre: string;
  description: string;
  date_debut: string;
  adresse: string;
  est_termine: boolean;
};

export function ProjetCard() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/projet")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Projets introuvables");
        }
        return response.json();
      })
      .then((data) => {
        setProjets(data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    return <p>Impossible de charger les projets.</p>;
  }

  if (projets.length === 0) {
    return <p>Chargement...</p>;
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  return (
    <>
      {projets.map((projet) => (
        <div className="projetCard-container">
          <h2 className="projetCard">{projet.titre}</h2>
          <p className="projetCard">{projet.description}</p>
          <p className="projetCard">Date de début : {formatDate(projet.date_debut)}</p>
          <p className="projetCard">Adresse : {projet.adresse}</p>
          <p className={ projet.est_termine ? "termine projetCard" : "en-cours projetCard"}>
            {projet.est_termine ? "Terminé" : "En cours"}
          </p>
          <Button text="voir tache" action={() => "test"} active={ false } />
        </div>
      ))}
    </>
  );
}
