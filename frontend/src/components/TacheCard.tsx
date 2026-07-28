import "../style/components/TacheCard.css";
import { useEffect, useMemo } from "react";
import { useTacheStore } from "../stores/tacheStore";
import { useLoginStore } from "../stores/loginStore";

export function TacheCard() {
  const idMembre = useLoginStore((state) => state.idMembre);
  const { taches, fetchTache, toggleTache } = useTacheStore();

  useEffect(() => {
    fetchTache();
  }, [fetchTache]);

  const tachesMembre = useMemo(() => {
    if (!idMembre) return [];
    return taches.filter((tache) => tache.assigne_a === idMembre);
  }, [taches, idMembre]);

  const statistiques = useMemo(() => {
    return {
      enCours: tachesMembre.filter((tache) => tache.statut === "en_cours")
        .length,

      termine: tachesMembre.filter((tache) => tache.statut === "termine")
        .length,
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
        <div>
          <p className="tache-en_cours">En cours</p>
          <p>{statistiques.enCours}</p>
        </div>
        <div>
          <p className="tache-termine">Terminées</p>
          <p>{statistiques.termine}</p>
        </div>
      </div>

      {tachesMembre.length === 0 ? (
        <p className="no-tache">Aucune tâche assignée</p>
      ) : (
        tachesMembre.map((tache) => (
          <div className="tacheCard-container" key={tache.id}>
            <button className="button" onClick={() => toggleTache(tache.id)}>
              {tache.statut === "termine" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-check"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              ) : (
                ""
              )}
            </button>
            <div className="Tache-description">
              <h2 className="tacheCard tacheCard-titre">{tache.titre}</h2>

              <p className="tacheCard">{tache.description}</p>
              <p className="tacheCard">
                Date d'échéance : {formatDate(tache.date_echeance)}
              </p>
            </div>

            <div className="tache-info">
              <p className={`bg tacheCard ${tache.statut}`}>
                {formatText(tache.statut)}
              </p>
              <p className={`bg tacheCard ${tache.priorite}`}>
                {formatText(tache.priorite)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
