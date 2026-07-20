import {useState } from "react";
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
    const [liste, setListe] = useState<Tache[]>([]);
    const [idEnEdition, setIdEnEdition] = useState<number | null>(null);
    const [texteEdition, setTexteEdition] = useState("");

    const ajouterTache = (titre: string) => {
        const nouvelleTache: Tache = {
            id: Date.now(),
            titre: titre
        };
        setListe([...liste, nouvelleTache]);
    };

    const supprimerTache = (id: number) => {
        setListe(liste.filter((t) => t.id !== id));
    };

    const commencerEdition = (t: Tache) => {
        setIdEnEdition(t.id);
        setTexteEdition(t.titre);
    };

    const validerEdition = (id: number) => {
        if (texteEdition.trim() === "") return;
        setListe(liste.map((t) => (t.id === id ? { ...t, titre: texteEdition } : t)));
        setIdEnEdition(null);
        setTexteEdition("");
    };

    const annulerEdition = () => {
        setIdEnEdition(null);
        setTexteEdition("");
    };
    return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
        <h1>Formulaire de Tache</h1>

        <form>
            <AjoutTache onAjouter={ajouterTache} />

            <div className="listeTaches">
                {liste.length === 0 ? (
                    <p>Aucune tâche pour le moment</p>
                ) : (
                    <ul>
                        {liste.map((t) => (
                            <li key={t.id}>
                                {idEnEdition === t.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={texteEdition}
                                            onChange={(e) => setTexteEdition(e.target.value)}
                                        />
                                        <button type="button" onClick={() => validerEdition(t.id)}>
                                            Enregistrer
                                        </button>
                                        <button type="button" onClick={annulerEdition}>
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>{t.titre}</span>
                                        <button type="button" onClick={() => commencerEdition(t)}>
                                            Modifier
                                        </button>
                                        <button type="button" onClick={() => supprimerTache(t.id)}>
                                            Supprimer
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="btnValidation">
                <button type="button">Valider</button>
            </div>
        </form>

        <button type="button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}

type Tache = {
  id: number;
  titre: string;
};

function AjoutTache({ onAjouter }: { onAjouter: (titre: string) => void }) {
  const [tache, setTache] = useState("");

  const ajouterTache = () => {
    if (tache.trim() === "") return;
    onAjouter(tache);
    setTache("");
  };

  return (
    <div>
      <h2>Liste des tâches</h2>
        <div className="choix">
            <label>Nom du projet :</label>

            <input
                type="text"
                placeholder="Sélectionner le projet"
            />
        </div>
        <input
            type="text"
            placeholder="Nouvelle tâche"
            value={tache}
            onChange={(e) => setTache(e.target.value)}
        />
        <button type="button" onClick={ajouterTache}>Ajouter</button>
    </div>
  );
}