import "../style/components/TacheCard.css";
import { useEffect } from "react";
import { useTacheStore } from "../stores/tacheStore";

export function TacheCard() {
  const taches = useTacheStore((state) => state.taches);
  const chargement = useTacheStore((state) => state.chargement);
  const fetchTache = useTacheStore((state) => state.fetchTache);

  useEffect(() => {
    fetchTache();
  }, [fetchTache]);

  if (chargement) {
    return <p> chargement</p>
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
