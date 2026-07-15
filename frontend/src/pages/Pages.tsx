import "./pages.css"

export function Organisation() {
  return (
    <>
    <header className="organisation">
      <span>/organisation</span>
    </header>
    <main>
      
      <section className="section-bar">
        <button> Logo home</button>
        <button> Liste déroulante Organisation</button>
        <button> Logo Pofil</button>
      </section>
      
      <section className="mes-organisation">
        <div className="organisation-1">
          <div >
            <div >
              <h1>MES ORGANISATIONS</h1>
              <p>Text</p>
            </div>
            <button> Nouvelle organisation</button>
          </div>
          <hr/>
          <div>
            <p>texte</p>
            <button> Créer ma première organisation</button>
          </div>
        </div>
        <div className="organisation-2">
          <div >
            <div >
            <h1>MES ORGANISATIONS</h1>
            <p>texte</p>
            </div>
            <button> Nouvelle organisation</button>
          </div>
          <hr/>
          <div>
            <div>
              <OrganisationCard/>
            </div>
          </div>  
        </div>
      </section>
    </main>
    </>
  );
}

export function OrganisationCard({ label = "ORGA1" }: { label?: string }) {
  return (
    <div className="orga-card">
      <span className="orga-card__eyebrow">ORGANISATION</span>
      <p className="orga-card__label">{label}</p>
    </div>
  );
}