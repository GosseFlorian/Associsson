import { useState } from "react";
import "../style/components/FormulaireModif.css";
import { useTacheStore } from "../stores/tacheStore";

export function FormulaireModifTache({tache}) {
  const [popupOuvert, setPopupOuvert] = useState(false);

  return (
    <>
      <button className="edit-button" onClick={() => setPopupOuvert(true)}>
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
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
          <path d="m15 5 4 4"></path>
        </svg>
      </button>

      {popupOuvert && (
        <PopupFormulaire
          onClose={() => setPopupOuvert(false)}
          tache={tache}
        />
      )}
    </>
  );
}
type FormulaireTache = {
  onClose: () => void;
  tache: {
      id: number;
      titre: string;
      description: string;
      statut: string;
      priorite: string;
      date_echeance: string;
    };
};

function PopupFormulaire({ onClose, tache }: FormulaireTache) {
  {
    const { updateTache } = useTacheStore();
    const [dateEcheance, setDateEcheance] = useState(() =>
      new Date().toLocaleDateString("fr"),
    );
    const [nomTache, setNomTache] = useState(tache.titre);
    const [descriptionTache, setDescriptionTache] = useState(tache.description);
    const [priorite, setPriorite] = useState(tache.priorite);

    const handleSubmit = async () => {
      event.preventDefault();
      await updateTache(tache.id, {
        titre: nomTache,
        description: descriptionTache,
        priorite,
        date_echeance: dateEcheance,
      });
      onClose();
    };

    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
          <h1 className="titre-formulaire">Formulaire tâche</h1>

          <form onSubmit={handleSubmit} className="formulaire">
            <div className="nomdetache">
              <label htmlFor="nomTache">Nom de la tâche :</label>
              <input
                type="text"
                id="nomTache"
                value={nomTache}
                onChange={(e) => setNomTache(e.target.value)}
              />
            </div>

            <div className="description-tache">
              <label htmlFor="descriptionTache">Description de la tâche :</label>
              <textarea
                id="descriptionTache"
                value={descriptionTache}
                onChange={(e) => setDescriptionTache(e.target.value)}
              />
            </div>

            <div className="priorité-tache">
              <label htmlFor="priorite">Priorité :</label>
              <select
                id="priorite"
                className={
                  priorite === "tres_haute"
                    ? "priorite-rouge"
                    : priorite === "haute"
                      ? "priorite-orangered"
                      : priorite === "moyenne"
                        ? "priorite-orange"
                        : "priorite-vert"
                }
                value={priorite}
                onChange={(e) => setPriorite(e.target.value)}
              >
                <option value="faible" className="option-vert">
                  faible
                </option>
                <option value="moyenne" className="option-orange">
                  moyenne
                </option>
                <option value="haute" className="option-orangered">
                  haute
                </option>
                <option value="tres_haute" className="option-rouge">
                  très haute
                </option>
              </select>
            </div>

            <div className="date">
              <label htmlFor="dateEcheance">Date d'échéance :</label>
              <input
                type="date"
                id="dateEcheance"
                value={dateEcheance}
                onChange={(e) => setDateEcheance(e.target.value)}
              />
            </div>
            <div className="btnValidation">
              <button type="submit">Valider</button>
            </div>
          </form>
          <div className="btnfermer">
            <button type="button" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }
}
