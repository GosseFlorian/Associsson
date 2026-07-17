import "../style/components/TacheCard.css";
import { useEffect } from "react";
import { useTacheStore } from "../stores/tacheStore";
import { useLoginStore } from "../stores/loginStore";

export function TacheCard() {
  const idMembre = useLoginStore(
    (state) => state.idMembre
  );

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

  if (!idMembre) {
    return <p>Aucun membre connecté</p>;
  }

  const tachesMembre = taches.filter(
    (tache) => tache.assigne_a === idMembre
  );

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  function formtext(texte: string): string {
    return texte
      .replace("_", " ")
      .charAt(0)
      .toUpperCase() + texte.slice(1);
  }

  if (tachesMembre.length === 0) {
    return <p>Aucune tâche assignée</p>;
  }
  return (
    <>
      {tachesMembre.map((tache) => (
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
