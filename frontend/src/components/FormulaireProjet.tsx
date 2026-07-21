import {useState } from "react";
import '../style/components/FormulaireProjet.css'


export function FormulaireProjet() {
  const [popupOuvert, setPopupOuvert] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setPopupOuvert(true)}>
        Ouvrir le formulaire
      </button>

      {popupOuvert && <PopupFormulaire onClose={() => setPopupOuvert(false)} />}
    </>
  );
}

function PopupFormulaire({ onClose }: { onClose: () => void }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
        <h1>Formulaire projet</h1>

        <form>
            <div className="nom">
                <label>Nom du Projet :</label>
                <input type="text" />
            </div>
            <CreationDate />
            <div className="description">
                <label>Description du projet :</label>
                <textarea />
            </div>
            <div className="btnValidation">
                <button type="submit">Valider</button>
            </div>
        </form>

        <button type="button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}

function CreationDate() {
    const [createdAt, setCreatedAt] = useState(() =>
        new Date().toLocaleDateString("fr-CA") // format YYYY-MM-DD
    );

    return (
        <div className="date">
            <label>Date de création :</label>
            <input
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
            />
        </div>
    );
}
