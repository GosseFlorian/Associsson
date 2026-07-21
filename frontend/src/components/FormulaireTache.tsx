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

interface Tache {
  id: number;
  titre: string;
  echeance?: string;
  description?: string;
}

function PopupFormulaire({ onClose }: { onClose: () => void }) {
    const [liste, setListe] = useState<Tache[]>([]);
    const [idEnEdition, setIdEnEdition] = useState<number | null>(null);
    const [texteEdition, setTexteEdition] = useState("");
    const [echeanceEdition, setEcheanceEdition] = useState("");
    const [descriptionEdition, setDescriptionEdition] = useState("");

    const ajouterTache = (titre: string, echeance: string, description: string) => {
        const nouvelleTache: Tache = {
            id: Date.now(),
            titre,
            echeance: echeance || undefined,
            description: description || undefined,
        };
        setListe([...liste, nouvelleTache]);
    };

    const supprimerTache = (id: number) => {
        setListe(liste.filter((t) => t.id !== id));
    };

    const commencerEdition = (t: Tache) => {
        setIdEnEdition(t.id);
        setTexteEdition(t.titre);
        setEcheanceEdition(t.echeance ?? "");
        setDescriptionEdition(t.description ?? "");
    };

    const validerEdition = (id: number) => {
        if (texteEdition.trim() === "") return;
        setListe(
            liste.map((t) =>
                t.id === id
                    ? {
                          ...t,
                          titre: texteEdition,
                          echeance: echeanceEdition,
                          description: descriptionEdition,
                      }
                    : t
            )
        );
        setIdEnEdition(null);
        setTexteEdition("");
        setEcheanceEdition("");
        setDescriptionEdition("");
    };

    const annulerEdition = () => {
        setIdEnEdition(null);
        setTexteEdition("");
        setEcheanceEdition("");
        setDescriptionEdition("");
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
                                                <input
                                                    type="date"
                                                    value={echeanceEdition}
                                                    onChange={(e) => setEcheanceEdition(e.target.value)}
                                                />
                                                <textarea
                                                    value={descriptionEdition}
                                                    onChange={(e) => setDescriptionEdition(e.target.value)}
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
                        <button type="button" onClick={onClose}>
                            Valider
                        </button>
                    </div>
                </form>

                <button type="button" onClick={onClose}>
                    Fermer
                </button>
            </div>
        </div>
    );
}

function AjoutTache({ onAjouter }: { onAjouter: (titre: string, echeance: string, description: string) => void }) {
  const [tache, setTache] = useState("");
  const [echeance, setEcheance] = useState("");
  const [description, setDescription] = useState("");

  const ajouterTache = () => {
    if (tache.trim() === "") return;
    onAjouter(tache, echeance, description);
    setTache("");
    setEcheance("");
    setDescription("");
  };

  return (
    <div>
        <div className="nom">
            <label> Tache :</label>
            <input
                type="text"
                placeholder="Nouvelle tâche"
                value={tache}
                onChange={(e) => setTache(e.target.value)}
            />
        </div>
            <div className="date" >
            <label> date d'échéance :</label>
            <input
                type="date"
                value={echeance}
                onChange={(e) => setEcheance(e.target.value)}
            />
        </div>
        <div className="description">
            <label>Description de l'organisation :</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>
        <button className="btnAjout" type="button" onClick={ajouterTache}>Ajouter</button>
        <p className="liste">Liste des tâches</p>
    </div>
  );
}
