import { useState } from 'react'
import '../style/components/FormulaireCreateOrganisation.css'
import { Button } from './Button';
import { useOrganisationStore } from '../stores/organisationStore';
import { useLoginStore } from '../stores/loginStore';
import { useMembreStore } from '../stores/membreStore';

export function FormulaireCreateOrganisation() {
  const [popupOuvert, setPopupOuvert] = useState(false);

  return (
    <>
      <Button text='Ouvrir le Formulaire' action={() => setPopupOuvert(true)} active={ false} />
      {popupOuvert && <PopupFormulaire onClose={() => setPopupOuvert(false)} />}
    </>
  );
}

function PopupFormulaire({ onClose }: { onClose: () => void }) {
  const { createOrganisation } = useOrganisationStore();
  const { idUtilisateur } = useLoginStore();
  const { fetchMembre } = useMembreStore();
  const [nomOrganisation, setNomOrganisation] = useState("");

  const handleSubmit = async () => {
    event.preventDefault();
    await createOrganisation(nomOrganisation, idUtilisateur);
    await fetchMembre();
  onClose();
}

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
        <h1 className="titre-formulaire">Formulaire Organisation</h1>

        <form onSubmit={handleSubmit}>
          <div className="nomOrganisation">
            <label htmlFor="nomOrganisation">
              Nom de l'organisation :
            </label>
            <input
              id="nomOrganisation"
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
