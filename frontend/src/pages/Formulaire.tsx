import {useState } from "react";
import "./formulaire.css"
export function FormulaireOrganisation() {
  return (
    <>
        <header className="en-tete">
            <a href="/organisations">/Organisation</a>
            <a href="/organisations">/ListeFormulaire</a>
            <a href="/organisations/ListeFormulaire/formulaire-organisation">/Formulaire organisation</a>
        </header>
        <div className="formulaire">
            <h1>Formulaire Organisation</h1>

            <form>
                <div className="nom">
                    <label>Nom de l'organisation :</label><br />
                    <input type="text" />
                </div>
                <div className="description">
                    <label>Description de l'organisation :</label>
                    <textarea />
                </div>
                <div className="btnValidation">
                    <button type="submit">Valider</button>
                </div>
            </form>
        </div>
    </>
  );
}
export function FormulaireProjet() {

    const [menuOuvert, setMenuOuvert] = useState(false);
    const [choix, setChoix] = useState("");

    return (
        <>
            <header className="en-tete">
                <a href="/organisations">/Organisation</a>
                <a href="/organisations">/ListeFormulaire</a>
                <a href="/organisations/ListeFormulaire/formulaire-projet">/Formulaire projet</a>
            </header>
            <div className="formulaire">
                <h1>Formulaire de projet</h1>

                <form>
                    <div className="nom">
                        <label>Nom du Projet :</label>
                        <input type="text" />
                    </div>

                    <div className="choix">
                        <label>Nom de organisation :</label>
                        <input
                            type="text"
                            placeholder="Choisir l'Organisation"
                            value={choix}
                            readOnly
                            onClick={() => setMenuOuvert(!menuOuvert)}
                            style={{ width: "100%" }}
                        />
                        {menuOuvert && (
                            <div className="popup-dropdown">
                                <ul>
                                    <li onClick={() => { setChoix("Choix 1"); setMenuOuvert(false); }}>Choix 1</li>
                                    <li onClick={() => { setChoix("Choix 2"); setMenuOuvert(false); }}>Choix 2</li>
                                    <li onClick={() => { setChoix("Choix 3"); setMenuOuvert(false); }}>Choix 3</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <CreationDate />
                    <div className="description">
                        <label>Description du projet :</label>
                        <textarea />
                    </div>
                    <div className="btnValidation">
                        <button type="submit">Valider</button>
                    </div>
                </form>
            </div>
        </>
    );
}
function CreationDate() {
    const [createdAt, setCreatedAt] = useState(() =>
        new Date().toLocaleDateString("fr-CA") // format YYYY-MM-DD
    );

    return (
        <div className="date">
            <label>Date de création :</label>
            <input
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
            />
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
      <h2>Gestion des tâches</h2>

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

export function FormulaireTache() {
    const [choixProjet, setChoixProjet] = useState("");
    const [menuProjetOuvert, setMenuProjetOuvert] = useState(false);
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
        <>
            <header className="en-tete">
                <a href="/organisations">/Organisation</a>
                <a href="/organisations">/ListeFormulaire</a>
                <a href="/organisations/ListeFormulaire/formulaire-projet">/Formulaire Tache</a>
            </header>

            <div className="formulaire">
                <h1>Formulaire de Tache</h1>

                <form>
                    <div className="choix">
                        <label>Nom du projet :</label>

                        <input
                            type="text"
                            placeholder="Sélectionner le projet"
                            value={choixProjet}
                            readOnly
                            onClick={() => setMenuProjetOuvert(!menuProjetOuvert)}
                            style={{ width: "100%" }}
                        />

                        {menuProjetOuvert && (
                            <div className="popup-dropdown">
                                <ul>
                                    <li onClick={() => { setChoixProjet("projet 1"); setMenuProjetOuvert(false); }}>projet 1</li>
                                    <li onClick={() => { setChoixProjet("projet 2"); setMenuProjetOuvert(false); }}>projet 2</li>
                                    <li onClick={() => { setChoixProjet("projet 3"); setMenuProjetOuvert(false); }}>projet 3</li>
                                </ul>
                            </div>
                        )}
                    </div>

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
            </div>
        </>
    );
}