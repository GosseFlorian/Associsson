import "../style/components/TacheCard.css";
import { useEffect, useMemo } from "react";
import { useTacheStore } from "../stores/tacheStore";
import { useLoginStore } from "../stores/loginStore";
import { FormulaireModifTache } from "./FormulaireModifTache";

export function TacheCard() {
  const idMembre = useLoginStore((state) => state.idMembre);
  const { taches, fetchTache, toggleTache, deleteTache } = useTacheStore();
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

  const handleDeleteTache = async (id: number) => {
    await deleteTache(id);
    await fetchTache();
  };

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
      <div className="tache-container">
      {tachesMembre.length === 0 ? (
        <p className="no-tache">Aucune tâche assignée</p>
      ) : (
        tachesMembre.map((tache) => (
          <div className="tacheCard-container" key={tache.id}>
            <div className="tache-button">
            {/* Button toggle V */}

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
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              ) : (
                ""
              )}
            </button>

            {/* Button edit V */}
            <FormulaireModifTache tache={tache}/>
            {/* Button suppression V */}

            <button
              className={tache.createur_id === idMembre ? "delete-button" : "delete-button cache"}
              onClick={() =>
                handleDeleteTache(tache.id)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" x2="10" y1="11" y2="17"></line>
                <line x1="14" x2="14" y1="11" y2="17"></line>
              </svg>
            </button>
            </div>
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
    </div>
  );
}
