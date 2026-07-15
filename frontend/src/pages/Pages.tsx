import "./pages.css"

export function Organisation() {
  return (
    <>
    <div className="body">
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
            <div className="entete-1">
              <div >
                <p>MES ORGANISATIONS</p>
                <p>Text</p>
              </div>
              <button> Nouvelle organisation</button>
            </div>
            <hr/>
            <div className="création-organisation">
              <p>texte</p>
              <button> Créer ma première organisation</button>
            </div>
          </div>
          <div className="organisation-2">
            <div className="entete-2">
              <div >
              <p>MES ORGANISATIONS</p>
              <p>texte</p>
              </div>
              <button> Nouvelle organisation</button>
            </div>
            <hr/>
            <div>
              <div className="organisationCarte">
                <OrganisationCard/>
              </div>
            </div>  
          </div>
        </section>
      </main>
    </div>
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