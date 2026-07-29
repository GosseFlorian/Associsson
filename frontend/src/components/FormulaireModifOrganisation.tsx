import { useState } from "react";
import "../style/components/FormulaireCreateOrganisation.css";
import { Button } from "./Button";
import { useOrganisationStore } from "../stores/organisationStore";
import { useMembreStore } from "../stores/membreStore";

export function FormulaireModifOrganisation({ organisation_id }: {organisation_id: number}) {
  const [popupOuvert, setPopupOuvert] = useState(false);

  return (
    <>
      <Button text='Ouvrir le Formulaire' action={() => setPopupOuvert(true)} active={ false} />
      {popupOuvert && <PopupFormulaire onClose={() => setPopupOuvert(false)} organisation_id={organisation_id}/>}
    </>
  );
}

function PopupFormulaire({organisation_id, onClose }: { onClose: () => void, organisation_id: number}) {
  const { updateOrganisation } = useOrganisationStore();
  const { fetchMembre } = useMembreStore();
  const [nomOrganisation, setNomOrganisation] = useState("");

  const handleSubmit = async () => {
    event.preventDefault();
    await updateOrganisation(organisation_id, nomOrganisation);
    await fetchMembre();
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
        <h1 className="titre-formulaire">
          Modifier l'organisation
        </h1>

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
            <button type="submit">Enregistrer</button>
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
