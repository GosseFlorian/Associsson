import { useEffect } from "react";
import { useTacheStore } from "../stores/tacheStore";

interface TacheProjetCardProps {
  idProjet: number;
}

export function TacheProjetCard({ idProjet }: TacheProjetCardProps) {
  const fetchTache = useTacheStore(
    (state) => state.fetchTache
  );

  const taches = useTacheStore(
    (state) => state.taches
  );

  useEffect(() => {
    if (taches.length === 0) {
      fetchTache();
    }
  }, [taches.length, fetchTache]);

  const tachesProjet = taches.filter(
    (tache) => tache.projet_id === idProjet
  );

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  function formtext(texte: string): string {
    return texte.charAt(0).toUpperCase() + texte.slice(1);
  }

  if (tachesProjet.length === 0) {
    return <p>Aucune tâche pour ce projet</p>;
  }

  return (
    <>
      {tachesProjet.map((tache) => (
        <div
          className="tacheCard-container"
          key={tache.id}
        >
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
