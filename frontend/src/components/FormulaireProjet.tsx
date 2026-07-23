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
  const [dateDebut, setDateDebut] = useState(() =>
    new Date().toLocaleDateString("fr") 
  );
  const [dateFin, setDateFin] = useState(() =>
    new Date().toLocaleDateString("fr") 
  );
  const [nomProjet, setNomProjet] = useState("");
  const [description, setDescription] = useState("");
  const [adresse, setAdresse] = useState("");
  const [estTerminer, setEstTerminer] = useState(false);
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
        
        <h1 className="titre-formulaire">Formulaire projet</h1>

        <form className="formulaire">
          
          <div className="nomProjet">
              <label htmlFor="nomProjet">Nom du projet :</label>
              <input 
              type="text" 
              id="nomProjet"
              value={nomProjet} 
              onChange={(e) => setNomProjet(e.target.value)} />
          </div>
          
          <div className="description">
              <label htmlFor="description">Description du projet :</label>
              <textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
          </div>
          
          <div className="dateDebut">
            <label htmlFor="dateDebut">Date de début :</label>
            <input
                type="date"
                id="dateDebut"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
            />
          </div>

          <div className="dateFin">
            <label htmlFor="dateFin">Date de fin :</label>
            <input
                type="date"
                id="dateFin"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
            />
          </div>

          <div className="adresse">
            <label htmlFor="adresse">Adresse:</label>
            <input
              type="text"
              id="adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />
          </div>
          
          <div className="estTerminer">
            <input 
              type="checkbox"
              id="estTerminer"
              checked={estTerminer}
              onChange={(e) => setEstTerminer(e.target.checked)}
            />
            <label htmlFor="estTerminer">Projet terminé</label>
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
