import { useState } from "react";
import '../style/components/FormulaireTache.css'

export function FormulaireTache() {
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
    const [dateEcheance, setDateEcheance] = useState(() =>
        new Date().toLocaleDateString("fr") 
    );
    const [nomTache, setNomTache] = useState ("")
    const [descriptionTache, setDescriptionTache] = useState("")
    const [statut, setStatut] = useState("en cours");
    const [priorite, setPriorite] = useState("basse"); // ou "haute", selon ton choix par défaut
    const [assigiantion, setAssigniantion] = useState ("");
    
    return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
        <h1 className="titre-formulaire">Formulaire tâche</h1>

        <form className="formulaire">
          
            <div className="nomdetache">
                <label htmlFor="nomTache">Nom de la tâche :</label>
                <input 
                type="text" 
                id="nomTache" 
                value={nomTache}
                onChange={(e) => setNomTache (e.target.value)}
                />
            </div>
          
            <div className="description-tache">
                <label htmlFor="descriptionTache">Description de la tâche :</label>
                <textarea 
                id="descriptionTache" 
                value={descriptionTache}
                onChange={(e) => setDescriptionTache (e.target.value)}
                />
            </div>

            <div className="statut-tache">
                <label htmlFor="statut">Statut :</label>
                <select
                    id="statut"
                    className={
                        statut === 'a faire'
                            ? 'statut-rouge'
                            : statut === 'en cours'
                            ? 'statut-orange'
                            : 'statut-vert'
                    }
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                >
                    <option value="a faire" className="option-rouge">a faire</option>
                    <option value="en cours" className="option-orange">en cours</option>
                    <option value="terminé" className="option-vert">Terminé</option>
                </select>
            </div>

            <div className="priorité-tache">
                <label htmlFor="priorite">Priorité :</label>
                <select
                    id="priorite"
                    className={
                        priorite === 'tres_haute'
                            ? 'priorite-rouge'
                            : priorite === 'haute'
                            ? 'priorite-orange'
                            : priorite === 'moyenne'
                            ? 'priorite-jaune'
                            : 'priorite-vert'
                    }
                    value={priorite}
                    onChange={(e) => setPriorite(e.target.value)}
                >
                    <option value="basse" className="option-vert">basse</option>
                    <option value="moyenne" className="option-jaune">moyenne</option>
                    <option value="haute" className="option-orange">haute</option>
                    <option value="tres_haute" className="option-rouge">très haute</option>
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
          
            <div className= "assignation">
                <label htmlFor="assignation">Assigné à :</label>
                <input 
                type="text" 
                id="assignation" 
                value={assigiantion}
                onChange={(e) => setAssigniantion(e.target.value)}
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


