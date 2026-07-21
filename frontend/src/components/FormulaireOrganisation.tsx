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
  const [nomOrganisation, setNomOrganisation] = useState("");

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
        <h1 className="titre-formulaire">Formulaire Organisation</h1>

        <form>
          <div className="nomOrganisation">
            <label>Nom de l'organisation :</label><br />
            <input 
            type="text"
            value={nomOrganisation}
            onChange={(e) => setNomOrganisation(e.target.value)}
             />
            
          </div>
          <div className="btnValidation">
            <button type="submit">Valider</button>
          </div>
        </form>

        <div className='btnfermer'>
          <button type="button" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}