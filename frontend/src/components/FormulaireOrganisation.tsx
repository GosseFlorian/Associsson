import { useState } from 'react'
import '../style/components/FormulaireOrganisation.css'

export function FormulaireOrganisation() {
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
        <h1>Formulaire Organisation</h1>

        <form>
          <div className="nom">
            <label>Nom de l'organisation :</label><br />
            <input type="text" />
          </div>
          <div className="description">
            <label>Description de l'organisation :</label>
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