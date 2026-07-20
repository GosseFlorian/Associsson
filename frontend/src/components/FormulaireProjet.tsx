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
    const [menuOuvert, setMenuOuvert] = useState(false);
    const [choix, setChoix] = useState("");
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
        <h1>Formulaire Organisation</h1>

        <form>
            <div className="nom">
                <label>Nom du Projet :</label>
                <input type="text" />
            </div>

            <div className="choix">
                <label>Nom de organisation :</label>
                <input
                    type="text"
                    placeholder="Choisir l'Organisation"
                    value={choix}
                    readOnly
                    onClick={() => setMenuOuvert(!menuOuvert)}
                    style={{ width: "100%" }}
                />
                {menuOuvert && (
                    <div className="popup-dropdown">
                        <ul>
                            <li onClick={() => { setChoix("Choix 1"); setMenuOuvert(false); }}>Choix 1</li>
                            <li onClick={() => { setChoix("Choix 2"); setMenuOuvert(false); }}>Choix 2</li>
                            <li onClick={() => { setChoix("Choix 3"); setMenuOuvert(false); }}>Choix 3</li>
                        </ul>
                    </div>
                )}
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
