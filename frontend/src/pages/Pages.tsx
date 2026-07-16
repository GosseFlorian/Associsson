import "./pages.css"
import { useState } from "react";

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
      <div id="organisation">
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
                <button> fitre des association</button>
              </div>
              <hr/>
              <div className="création-organisation">
                <p>texte</p>
                <CreateOrganisationForm/>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function CreateOrganisationForm() {
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  const [organisations, setOrganisations] = useState<{ nom: string; description: string }[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // On ajoute un objet complet (nom + description), pas juste le nom
    setOrganisations((prev) => [...prev, { nom, description }]);

    setNom("");
    setDescription("");
    setAfficherFormulaire(false);
  }

  return (
    <div>
      {!afficherFormulaire && (
        <button onClick={() => setAfficherFormulaire(true)}>
          Créer une organisation
        </button>
      )}

      {afficherFormulaire && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom de l'association</label>
            <br />
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Description</label>
            <br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <br />

          <button type="submit">Créer</button>
          <button type="button" onClick={() => setAfficherFormulaire(false)}>
            Annuler
          </button>
        </form>
      )}

      <div className="orga-list">
        {organisations.length === 0 ? (
          <p>Pas d'organisation ajoutée</p>
        ) : (
          organisations.map((orga, index) => (
            <OrganisationCard
              key={index}
              nom={orga.nom}
              description={orga.description}
            />
          ))
        )}
      </div>
    </div>
  );
}

function OrganisationCard({
  nom,
  description,
}: {
  nom: string;
  description: string;
}) {
  return (
    <div
      className="orga-card"
      onClick={() => (window.location.href = "/organisations/membre")}
    >
      <span className="orga-card__eyebrow">Nom de l'association :</span>
      <br/>
      <p className="orga-card__label">{nom}</p>
      <br/>
      {description && (
        <>
          <span className="orga-card__eyebrow">Description :</span>
          <p className="orga-card__description">{description}</p>
        </>
      )}
    </div>
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
