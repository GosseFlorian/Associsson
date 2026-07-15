import "./pages.css"

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
        <a href="/organisation">
          /organisation
        </a>
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

function OrganisationCard({ label = "ORGA1" }: { label?: string }) {
  return (
    <div
      className="orga-card"
      onClick={() => (window.location.href = "/organisations/membre")}
    >
      <span className="orga-card__eyebrow">ORGANISATION</span>
      <p className="orga-card__label">{label}</p>
    </div>
  );
}


export function Membre(){
  return (
    <>
      <div id="membre">
        
        <header className="membre">
          <a href="#organisation">/Organisation</a>
          <a href="#membre">/membre</a>
        </header>

        <SectionBar/>
        <div>
          <div>
            <button>Mes Tâches</button>
            <button> Calendrier</button>
            <button>Mon profil</button>
          </div>
          <div>

          </div>
        </div>
      </div>
    </>
  )
}