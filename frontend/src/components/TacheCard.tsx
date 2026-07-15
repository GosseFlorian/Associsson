import "../style/TacheCard.css";
import { useEffect, useState } from "react";

type Tache = {
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  date_echeance: string;
};

export function TacheCard() {
  const [taches, setTaches] = useState<Tache[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/tache")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Tâches introuvables");
        }

        return response.json();
      })
      .then((data) => {
        setTaches(data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    return <p>Impossible de charger les tâches.</p>;
  }

  if (taches.length === 0) {
    return <p>Chargement...</p>;
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  function formtext(str: string): string {
    return str.replace(/_/g, " ")
  }

  return (
    <>
      {taches.map((tache) => (
        <div className="tacheCard-container" key={tache.titre}>
          <h2 className="tacheCard tacheCard-titre">{tache.titre}</h2>
          <p className="tacheCard">{tache.description}</p>
          <p className="tacheCard">Date d'échéance : {formatDate(tache.date_echeance)}</p>
          <div className="tache-info">
            <p className={`bg tacheCard ${tache.statut}`}>{formtext(tache.statut)}</p>
            <p className={`bg tacheCard ${tache.priorite}`}>{formtext(tache.priorite)}</p>
          </div>
        </div>
      ))}
    </>
  );
}
