import { useState } from "react";
import '../style/components/FormulaireCreateTache.css'
import { useLoginStore } from "../stores/loginStore";
import { Button } from "./Button";
import { useTacheStore } from "../stores/tacheStore";

export function FormulaireCreateTache({ projet_id }) {
  const [popupOuvert, setPopupOuvert] = useState(false)

  return (
    <>
      <Button text='Ajouter une tache' action={() => setPopupOuvert(true)} active={ false} />
      {popupOuvert && <PopupFormulaire onClose={() => setPopupOuvert(false)} projet_id={ projet_id} />}
    </>
  );
}
type FormulaireTache = {
  onClose: () => void,
  projet_id: number
}

function PopupFormulaire({ onClose, projet_id }: FormulaireTache) {
  const { createTache, fetchTache } = useTacheStore();
  const { role, idMembre } = useLoginStore();
    const [dateEcheance, setDateEcheance] = useState(() =>
        new Date().toLocaleDateString("fr")
    );
  const [nomTache, setNomTache] = useState ("")
  const [descriptionTache, setDescriptionTache] = useState("")
  const [statut, setStatut] = useState("en_cours");
  const [priorite, setPriorite] = useState("faible");
  const [assignation, setAssignation] = useState(idMembre);

  const handleSubmit = async () => {
    event.preventDefault();
    await createTache({
      titre: nomTache,
      description: descriptionTache,
      statut,
      priorite,
      date_echeance : dateEcheance,
      projet_id,
      createur_id: idMembre,
      assigne_a: Number(assignation),
    });
    await fetchTache();
    onClose();
  }

    return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
        <h1 className="titre-formulaire">Formulaire tâche</h1>

        <form onSubmit={handleSubmit} className="formulaire">
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
                        statut === 'en_cours'
                            ? 'statut-orange'
                            : 'statut-vert'
                    }
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                >
                    <option value="en_cours" className="option-orange">en cours</option>
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
                            ? 'priorite-orangered'
                            : priorite === 'moyenne'
                            ? 'priorite-orange'
                            : 'priorite-vert'
                    }
                    value={priorite}
                    onChange={(e) => setPriorite(e.target.value)}
                >
                    <option value="faible" className="option-vert">faible</option>
                    <option value="moyenne" className="option-orange">moyenne</option>
                    <option value="haute" className="option-orangered">haute</option>
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

            <div className={role === "admin"
                            ? "assignation"
                            : "assignation cache"}>
                <label htmlFor="assignation">Assigné à :</label>
                <input
                type="text"
                id="assignation"
                value={assignation}
                onChange={(e) => setAssignation(Number(e.target.value))}
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
