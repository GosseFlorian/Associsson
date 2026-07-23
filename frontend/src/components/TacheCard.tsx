import "../style/components/TacheCard.css";
import { useEffect, useMemo } from "react";
import { useTacheStore } from "../stores/tacheStore";
import { useLoginStore } from "../stores/loginStore";

export function TacheCard() {
  const idMembre = useLoginStore((state) => state.idMembre);

  const fetchTache = useTacheStore((state) => state.fetchTache);
  const taches = useTacheStore((state) => state.taches);

  useEffect(() => {
    fetchTache();
  }, [fetchTache]);

  const tachesMembre = useMemo(() => {
    if (!idMembre) return [];
    return taches.filter(
      (tache) => tache.assigne_a === idMembre
    );
  }, [taches, idMembre]);

  const statistiques = useMemo(() => {
    return {
      aFaire: tachesMembre.filter(
        (tache) => tache.statut === "a_faire"
      ).length,

      enCours: tachesMembre.filter(
        (tache) => tache.statut === "en_cours"
      ).length,

      termine: tachesMembre.filter(
        (tache) => tache.statut === "termine"
      ).length,
    };
  }, [tachesMembre]);

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  function formatText(texte: string): string {
    const texteFormate = texte.replace("_", " ");

    return texteFormate.charAt(0).toUpperCase() + texteFormate.slice(1);
  }

  if (!idMembre) {
    return <p>Aucun membre connecté</p>;
  }

  return (
    <div className="tacheCard">
      <div className="tache-stats">
        <div className="a_faire">
          <p>À faire : {statistiques.aFaire}</p>
        </div>
        <div className="en_cours">
          <p>En cours : {statistiques.enCours}</p>
        </div>
        <div className="termine">
          <p>Terminées : {statistiques.termine}</p>
        </div>
      </div>

      {tachesMembre.length === 0 ? (
          <p className="no-tache">Aucune tâche assignée</p>
      ) : (
        tachesMembre.map((tache) => (
          <div className="tacheCard-container" key={tache.id}>
            <h2 className="tacheCard tacheCard-titre">{tache.titre}</h2>

            <p className="tacheCard">{tache.description}</p>
            <p className="tacheCard">Date d'échéance : {formatDate(tache.date_echeance)}</p>

            <div className="tache-info">
              <p className={`bg tacheCard ${tache.statut}`}>{formatText(tache.statut)}</p>
              <p className={`bg tacheCard ${tache.priorite}`}>{formatText(tache.priorite)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
