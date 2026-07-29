import { useState } from 'react'
import '../style/components/FormulaireCreateOrganisation.css'
import { Button } from './Button';

export function FormulaireCreateOrganisation() {
  const [popupOuvert, setPopupOuvert] = useState(false)

  return (
    <>
      <Button text='Ouvrir le Formulaire' action={() => setPopupOuvert(true)} active={ false} />
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
            <label htmlFor='nomOgranisation'>Nom de l'organisation :</label><br />
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
