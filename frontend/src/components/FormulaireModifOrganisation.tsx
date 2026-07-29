import { useState } from "react";
import "../style/components/FormulaireCreateOrganisation.css";
import { Button } from "./Button";
import { useOrganisationStore } from "../stores/organisationStore";
import { useMembreStore } from "../stores/membreStore";

export function FormulaireModifOrganisation({ organisation_id }: {organisation_id: number}) {
  const [popupOuvert, setPopupOuvert] = useState(false);

  return (
    <>
      <Button text={<svg
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
      </svg>} action={() => setPopupOuvert(true)} active={ false} />
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
