import "./pages.css"
import { useState } from "react";
import { Link } from "react-router-dom";

function SectionBar () {
  return(
    <>
      <section className="section-bar">
          <button> Logo home</button>
          <button> Liste déroulante Organisation</button>
          <button> Logo Pofil</button>
        </section>
    </>
  )
}

export function Organisation() {
  
  return (
    <>
      <div>
        <header className="organisation">
            <a href="/organisations">/Organisation</a>
          </header>
        <main>

          <SectionBar/>

          <section className="mes-organisation">
            <div className="organisation-1">
              <div className="entete-1">
                <div >
                  <p>MES ORGANISATIONS</p>
                  <p>Text</p>
                </div>
                <ListeFormulaire/>
              </div>
              <hr/>
              <div className="création-organisation">
                <p>texte</p>
                <button> fitre des listes des associations</button>
              </div>
              <div>
                <span>card</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export function ListeFormulaire() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <section>
      <button onClick={() => setMenuOuvert(!menuOuvert)}>
        Liste de formulaires
      </button>

      {menuOuvert && (
        <ul className="menu-formulaire">
          <li>
            <Link to="/organisations/ListeFormulaire/formulaire-organisation">
              Créer un organisation
            </Link>
          </li>
          <li>
            <Link to="/organisations/ListeFormulaire/formulaire-projet">
              Créer un projet
            </Link>
          </li>
          <li>
            <Link to="/organisations/ListeFormulaire/formulaire-tache">
              Créer une tache
            </Link>
          </li>
        </ul>

      )}
    </section>
  );
}

export function Membre(){
  return (
    <>
      <div id="membre">

        <header className="membre">
          <a href="/organisations">/Organisation</a>
          <a href="/organisations/membre">/membre</a>
        </header>

        <SectionBar/>
        <CarteMembre/>
      </div>
    </>
  )
}

function CarteMembre() {
  const [ongletActif, setOngletActif] = useState<"taches" | "calendrier" | "profil" | null>(null);

  return (
    <div className="carte-membre">
      <div className="classeur">
        <button onClick={() => setOngletActif("taches")}>Mes Tâches</button>
        <button onClick={() => setOngletActif("calendrier")}>Calendrier</button>
        <button onClick={() => setOngletActif("profil")}>Mon profil</button>
      </div>

      <div>
        {ongletActif === "taches" && <div>Contenu de Mes Tâches...</div>}
        {ongletActif === "calendrier" && <div>Contenu du Calendrier...</div>}
        {ongletActif === "profil" && <div>Contenu de Mon profil...</div>}
      </div>
    </div>
  );
}
