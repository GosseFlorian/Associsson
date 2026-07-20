import { useEffect } from "react";
import { useProjetStore } from "../stores/projetStore";
import "../style/components/ProjetCard.css";
import { Button } from "./Button";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { TacheProjetCard } from "./TacheProjetCard";


export function ProjetCard() {
  const [projetOuvert, setProjetOuvert] = useState<number | null>(null);
  const { idOrganisation } = useParams();

  const fetchProjet = useProjetStore(
    (state) => state.fetchProjet
  );

  const projets = useProjetStore(
    (state) => state.projets
  );

  useEffect(() => {
    if (projets.length === 0) {
      fetchProjet();
    }
  }, [projets.length, fetchProjet]);

  const listeProjet = projets.filter(
    (projet) =>
      projet.organisation_id === Number(idOrganisation)
  );

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  if (listeProjet.length === 0) {
    return <p>Aucun projet trouvé</p>;
  }

  return (
    <>
      {listeProjet.map((projet) => (
        <div
          className="projetCard-container"
          key={projet.id}
        >
          <h2 className="projetCard">{projet.titre}</h2>
          <p className="projetCard">{projet.description}</p>
          <p className="projetCard">Date de début : {formatDate(projet.date_debut)}</p>
          <p className="projetCard">Adresse : {projet.adresse}</p>
          <p className={projet.est_termine
              ? "termine projetCard"
              : "en-cours projetCard"
          }>
            {projet.est_termine ? "Terminé" : "En cours"}
          </p>

          <Button
            text="voir tache"
            action={() =>
              setProjetOuvert(
                projetOuvert === projet.id ? null : projet.id
              )
            }
            active={false}
          />
          {projetOuvert === projet.id && (
            <TacheProjetCard idProjet={projet.id} />
          )}
        </div>
      ))}
    </>
  );
}
